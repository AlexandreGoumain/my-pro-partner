import { withApiHandler } from "@/lib/api/api-handler";
import { NotFoundError, BusinessError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

// GET: Récupérer un mouvement de stock par ID
export async function GET(
    _req: NextRequest,
    { params }: RouteParams
) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;
            const mouvement = await prisma.mouvementStock.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
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
                throw new NotFoundError("Mouvement non trouvé");
            }

            return NextResponse.json(mouvement);
        },
        {
            context: { resourceName: "MouvementStock", operation: "get" },
        }
    );
}

// DELETE: Annuler un mouvement de stock
// Note: Cette opération inverse le mouvement en créant un mouvement compensatoire
export async function DELETE(
    _req: NextRequest,
    { params }: RouteParams
) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            // Récupérer le mouvement à annuler
            const mouvementOriginal = await prisma.mouvementStock.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    article: true,
                },
            });

            if (!mouvementOriginal) {
                throw new NotFoundError("Mouvement non trouvé");
            }

            // Créer un mouvement compensatoire et supprimer l'original en transaction
            await prisma.$transaction(async (tx) => {
                // Calculer le mouvement inverse
                const stock_avant = mouvementOriginal.article.stock_actuel;
                const stock_apres = stock_avant - mouvementOriginal.quantite;

                // Vérifier que le stock ne devient pas négatif
                if (stock_apres < 0) {
                    throw new BusinessError("Impossible d'annuler ce mouvement : stock insuffisant");
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
                        createdBy: ctx.userId,
                        entrepriseId: ctx.entrepriseId,
                    },
                });

                // Mettre à jour le stock de l'article
                await tx.article.update({
                    where: { id: mouvementOriginal.articleId },
                    data: { stock_actuel: stock_apres },
                });

                // Supprimer le mouvement original
                await tx.mouvementStock.delete({
                    where: { id },
                });
            });

            return NextResponse.json({
                success: true,
                message: "Mouvement annulé avec succès",
            });
        },
        {
            context: { resourceName: "MouvementStock", operation: "delete" },
        }
    );
}
