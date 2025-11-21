import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";
import { requireTenantAuth, verifyResourceAccess } from "@/lib/middleware/tenant-isolation";
import { requireBusinessType } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { reparationAddPieceSchema } from "@/lib/validation";
import { Prisma } from "@/lib/generated/prisma/client";

// GET: List pieces for repair
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandling(async () => {
    // Check business type
    const businessTypeCheck = await requireBusinessType("INFORMATIQUE");
    if (businessTypeCheck) return businessTypeCheck;

    const { id } = await params;

    // Verify ownership
    await verifyResourceAccess(
      id,
      (id) => prisma.reparation.findUnique({
        where: { id },
      }),
      "Reparation"
    );

    // Get pieces
    const pieces = await prisma.reparationLignePiece.findMany({
      where: { reparationId: id },
      include: {
        article: true,
        ressourceAtelier: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(pieces);
  }, { resourceName: "ReparationPiece", operation: "list" });
}

// POST: Add piece to repair
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandling(async () => {
    // Check business type
    const businessTypeCheck = await requireBusinessType("INFORMATIQUE");
    if (businessTypeCheck) return businessTypeCheck;

    const { user, entrepriseId } = await requireTenantAuth();
    const { id } = await params;

    // Verify ownership
    const { resource: reparation } = await verifyResourceAccess(
      id,
      (id) => prisma.reparation.findUnique({
        where: { id },
      }),
      "Reparation"
    );

    const body = await req.json();
    const result = reparationAddPieceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Données invalides",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { articleId, ressourceAtelierId, designation, quantite, prixUnitaire } = result.data;

    // Verify article or ressource exists and belongs to entreprise
    if (articleId) {
      const article = await prisma.article.findUnique({
        where: { id: articleId },
      });

      if (!article) {
        return NextResponse.json(
          { message: "Article introuvable" },
          { status: 404 }
        );
      }

      if (article.entrepriseId !== entrepriseId) {
        return NextResponse.json(
          { message: "Accès non autorisé" },
          { status: 403 }
        );
      }

      // Check stock availability
      if (article.gestion_stock && article.stock_actuel < quantite) {
        return NextResponse.json(
          { message: `Stock insuffisant pour ${article.nom}. Disponible : ${article.stock_actuel}` },
          { status: 400 }
        );
      }
    } else if (ressourceAtelierId) {
      const ressource = await prisma.ressourceAtelier.findUnique({
        where: { id: ressourceAtelierId },
      });

      if (!ressource) {
        return NextResponse.json(
          { message: "Ressource d'atelier introuvable" },
          { status: 404 }
        );
      }

      if (ressource.entrepriseId !== entrepriseId) {
        return NextResponse.json(
          { message: "Accès non autorisé" },
          { status: 403 }
        );
      }

      // Check quantity availability
      if (ressource.quantite < quantite) {
        return NextResponse.json(
          { message: `Quantité insuffisante pour ${ressource.nom}. Disponible : ${ressource.quantite}` },
          { status: 400 }
        );
      }
    }

    // Calculate amount
    const montant = prixUnitaire * quantite;

    // Add piece in transaction
    const piece = await prisma.$transaction(async (tx) => {
      // Create piece line
      const newPiece = await tx.reparationLignePiece.create({
        data: {
          reparationId: id,
          articleId: articleId || undefined,
          ressourceAtelierId: ressourceAtelierId || undefined,
          designation,
          quantite,
          prixUnitaire: new Prisma.Decimal(prixUnitaire),
          montant: new Prisma.Decimal(montant),
        },
        include: {
          article: true,
          ressourceAtelier: true,
        },
      });

      // Update stock if article
      if (articleId) {
        const article = await tx.article.findUnique({
          where: { id: articleId },
        });

        if (article && article.gestion_stock) {
          const stockAvant = article.stock_actuel;
          const stockApres = stockAvant - quantite;

          await tx.article.update({
            where: { id: articleId },
            data: {
              stock_actuel: {
                decrement: quantite,
              },
            },
          });

          // Create stock movement
          await tx.mouvementStock.create({
            data: {
              articleId,
              type: "SORTIE",
              quantite,
              stock_avant: stockAvant,
              stock_apres: stockApres,
              motif: `Utilisé dans réparation ${reparation.numero}`,
              entrepriseId,
              createdBy: user.id,
            },
          });
        }
      }

      // Update ressource if ressourceAtelier
      if (ressourceAtelierId) {
        await tx.ressourceAtelier.update({
          where: { id: ressourceAtelierId },
          data: {
            quantite: {
              decrement: quantite,
            },
            utiliseDansReparation: true,
            dateUtilisation: new Date(),
            reparationId: id,
          },
        });
      }

      // Recalculate repair costs
      const allPieces = await tx.reparationLignePiece.findMany({
        where: { reparationId: id },
      });

      const totalPieces = allPieces.reduce(
        (sum, p) => sum + Number(p.montant),
        0
      );

      const coutTotal = Number(reparation.coutMain) + totalPieces;

      await tx.reparation.update({
        where: { id },
        data: {
          coutPieces: new Prisma.Decimal(totalPieces),
          coutTotal: new Prisma.Decimal(coutTotal),
        },
      });

      return newPiece;
    });

    // Create history entry
    await prisma.reparationHistorique.create({
      data: {
        reparationId: id,
        action: "PIECE_ADDED",
        description: `Pièce ajoutée : ${designation} (x${quantite}) - ${montant}€`,
        metadata: {
          pieceId: piece.id,
          designation,
          quantite,
          montant,
        },
        createdBy: user.id,
      },
    });

    return NextResponse.json(piece, { status: 201 });
  }, { resourceName: "ReparationPiece", operation: "create" });
}
