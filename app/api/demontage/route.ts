import { withErrorHandling } from "@/lib/errors";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { requireTenantAuth } from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { ArticleService } from "@/lib/services/article.service";
import { demontageCreateSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

// POST: Create dismantling record and pieces
export async function POST(req: NextRequest) {
    return withErrorHandling(
        async () => {
            // Check business type
            const capabilityCheck = await requireCapability("atelier");
            if (capabilityCheck) return capabilityCheck;

            const { entrepriseId } = await requireTenantAuth();

            const body = await req.json();
            const result = demontageCreateSchema.safeParse(body);

            if (!result.success) {
                return NextResponse.json(
                    {
                        message: "Données invalides",
                        errors: result.error.flatten().fieldErrors,
                    },
                    { status: 400 }
                );
            }

            const { articleSourceId, motif, notes, ressources } = result.data;

            // Verify source article exists and is OCCASION type
            const sourceArticle = await prisma.article.findUnique({
                where: { id: articleSourceId },
                include: { rachat: true },
            });

            if (!sourceArticle) {
                return NextResponse.json(
                    { message: "Article source introuvable" },
                    { status: 404 }
                );
            }

            if (sourceArticle.type !== "OCCASION") {
                return NextResponse.json(
                    {
                        message:
                            "Seuls les articles d'occasion peuvent être démontés",
                    },
                    { status: 400 }
                );
            }

            if (sourceArticle.entrepriseId !== entrepriseId) {
                return NextResponse.json(
                    { message: "Accès non autorisé" },
                    { status: 403 }
                );
            }

            // Create dismantling record and pieces in transaction
            const result_demontage = await prisma.$transaction(async (tx) => {
                // Create dismantling record
                const demontage = await tx.demontageArticle.create({
                    data: {
                        articleSourceId,
                        entrepriseId,
                        motif: motif || "",
                        notes: notes || "",
                    },
                });

                // Generate references for all pieces FIRST (in sequence to avoid duplicates)
                const references: string[] = [];
                for (let i = 0; i < ressources.length; i++) {
                    const reference = await ArticleService.generateReference(
                        "PIECE",
                        entrepriseId
                    );
                    references.push(reference);
                }

                // Create each piece as a new article
                const pieces = await Promise.all(
                    ressources.map(async (ressource, index) => {
                        // Calculate estimated value based on source article
                        const valeurEstimee = sourceArticle.rachat
                            ? Number(sourceArticle.rachat.prixRachat) * 0.15
                            : Number(sourceArticle.prix_ht) * 0.1;

                        // Create piece article with pre-generated reference
                        return tx.article.create({
                            data: {
                                reference: references[index],
                                nom: ressource.nom,
                                description: ressource.description || "",
                                type: "PIECE",
                                prix_ht: valeurEstimee * 2, // Prix de vente = 2x valeur estimée
                                tva_taux: 20,
                                stock_actuel: ressource.quantite,
                                stock_min: 0,
                                gestion_stock: true,
                                actif: true,
                                entrepriseId,
                                categorieId: sourceArticle.categorieId,
                                // Piece-specific fields
                                typePiece: ressource.typeRessource,
                                etatPiece: ressource.etat,
                                marque:
                                    ressource.marque ||
                                    sourceArticle.rachat?.notes?.split(" ")[0],
                                modele:
                                    ressource.modele ||
                                    sourceArticle.nom.split(" ")[0],
                                articleOrigineId: articleSourceId,
                                valeurEstimee,
                            },
                        });
                    })
                );

                // Update source article stock to 0 (disassembled)
                await tx.article.update({
                    where: { id: articleSourceId },
                    data: {
                        stock_actuel: 0,
                        actif: false,
                    },
                });

                return { demontage, pieces };
            });

            return NextResponse.json(result_demontage, { status: 201 });
        },
        { resourceName: "Demontage", operation: "create" }
    );
}

// GET: List all dismantlings
export async function GET(req: NextRequest) {
    return withErrorHandling(
        async () => {
            const capabilityCheck = await requireCapability("atelier");
            if (capabilityCheck) return capabilityCheck;

            const { entrepriseId } = await requireTenantAuth();

            const searchParams = req.nextUrl.searchParams;
            const page = parseInt(searchParams.get("page") || "1");
            const limit = parseInt(searchParams.get("limit") || "20");

            const where = { entrepriseId };

            const total = await prisma.demontageArticle.count({ where });

            const demontages = await prisma.demontageArticle.findMany({
                where,
                include: {
                    articleSource: {
                        include: {
                            categorie: true,
                            piecesDetachees: true,
                        },
                    },
                },
                orderBy: {
                    dateDemontage: "desc",
                },
                skip: (page - 1) * limit,
                take: limit,
            });

            return NextResponse.json({
                items: demontages,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            });
        },
        { resourceName: "Demontage", operation: "list" }
    );
}
