import { withApiHandler } from "@/lib/api/api-handler";
import { NotFoundError, BusinessError, ValidationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { stockAdjustmentSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

// PUT: Ajuster rapidement le stock d'un article
export async function PUT(
    req: NextRequest,
    { params }: RouteParams
) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const body = await req.json();
            const result = stockAdjustmentSchema.safeParse(body);
            if (!result.success) {
                throw new ValidationError(result.error.errors[0].message);
            }

            const { quantite, motif } = result.data;

            // Vérifier que l'article existe et a la gestion de stock activée
            const article = await prisma.article.findUnique({
                where: { id },
            });

            if (!article) {
                throw new NotFoundError("Article non trouvé");
            }

            if (!article.gestion_stock) {
                throw new BusinessError("La gestion de stock n'est pas activée pour cet article");
            }

            // Calculer le nouveau stock
            const stock_avant = article.stock_actuel;
            const stock_apres = stock_avant + quantite;

            // Vérifier que le stock ne devient pas négatif
            if (stock_apres < 0) {
                throw new BusinessError(
                    `Stock insuffisant. Stock actuel: ${stock_avant}, quantité demandée: ${Math.abs(quantite)}`
                );
            }

            // Déterminer le type de mouvement basé sur la quantité
            const type = quantite > 0 ? "ENTREE" : "SORTIE";
            const entrepriseId = article.entrepriseId;

            // Créer le mouvement et mettre à jour le stock en une transaction
            const result_article = await prisma.$transaction(async (tx) => {
                // Créer le mouvement
                await tx.mouvementStock.create({
                    data: {
                        articleId: id,
                        type: "AJUSTEMENT",
                        quantite,
                        stock_avant,
                        stock_apres,
                        motif: motif || `Ajustement ${type === "ENTREE" ? "positif" : "négatif"}`,
                        createdBy: ctx.userId,
                        entrepriseId,
                    },
                });

                // Mettre à jour le stock de l'article
                const updatedArticle = await tx.article.update({
                    where: { id },
                    data: { stock_actuel: stock_apres },
                    include: {
                        categorie: true,
                    },
                });

                return updatedArticle;
            });

            return NextResponse.json(result_article);
        },
        {
            context: { resourceName: "Articles", operation: "adjustStock" },
        }
    );
}
