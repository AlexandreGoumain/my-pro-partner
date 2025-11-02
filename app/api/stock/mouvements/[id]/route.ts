import { requireAuth } from "@/lib/api/auth-middleware";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET: Récupérer un mouvement de stock par ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionOrError = await requireAuth();
    if (sessionOrError instanceof NextResponse) return sessionOrError;

    const { id } = await params;
    const mouvement = await prisma.mouvementStock.findUnique({
      where: { id },
      include: {
        article: {
          select: {
            id: true,
            reference: true,
            nom: true,
            unite: true,
            stock_actuel: true,
          },
        },
      },
    });

    if (!mouvement) {
      return NextResponse.json(
        { message: "Mouvement non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(mouvement);
  } catch (error) {
    console.error("Erreur lors de la récupération du mouvement:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE: Annuler un mouvement de stock
// Note: Cette opération inverse le mouvement en créant un mouvement compensatoire
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionOrError = await requireAuth();
    if (sessionOrError instanceof NextResponse) return sessionOrError;
    const session = sessionOrError;

    const { id } = await params;
    // Récupérer le mouvement à annuler
    const mouvementOriginal = await prisma.mouvementStock.findUnique({
      where: { id },
      include: {
        article: true,
      },
    });

    if (!mouvementOriginal) {
      return NextResponse.json(
        { message: "Mouvement non trouvé" },
        { status: 404 }
      );
    }

    const entrepriseId = mouvementOriginal.entrepriseId;

    // Créer un mouvement compensatoire et supprimer l'original en transaction
    await prisma.$transaction(async (tx) => {
      // Calculer le mouvement inverse
      const stock_avant = mouvementOriginal.article.stock_actuel;
      const stock_apres = stock_avant - mouvementOriginal.quantite;

      // Vérifier que le stock ne devient pas négatif
      if (stock_apres < 0) {
        throw new Error("Impossible d'annuler ce mouvement : stock insuffisant");
      }

      // Créer un mouvement compensatoire (AJUSTEMENT avec quantité inverse)
      await tx.mouvementStock.create({
        data: {
          articleId: mouvementOriginal.articleId,
          type: "AJUSTEMENT",
          quantite: -mouvementOriginal.quantite,
          stock_avant,
          stock_apres,
          motif: `Annulation du mouvement ${mouvementOriginal.id}`,
          reference: mouvementOriginal.reference,
          notes: `Mouvement compensatoire pour annuler: ${mouvementOriginal.type} de ${mouvementOriginal.quantite}`,
          createdBy: session.user?.email || null,
          entrepriseId,
        },
      });

      // Mettre à jour le stock de l'article
      await tx.article.update({
        where: { id: mouvementOriginal.articleId },
        data: { stock_actuel: stock_apres },
      });

      // Supprimer le mouvement original
      await tx.mouvementStock.delete({
        where: { id: (await params).id },
      });
    });

    return NextResponse.json(
      { message: "Mouvement annulé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'annulation du mouvement:", error);

    if (error instanceof Error && error.message.includes("stock insuffisant")) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
