import { prisma } from "@/lib/prisma";
import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextResponse } from "next/server";

/**
 * GET /api/articles/alerts
 * Returns articles with low stock (stock_actuel <= stock_min)
 * Optimized endpoint that filters on the database side
 */
export async function GET() {
    try {
        const { entrepriseId } = await requireTenantAuth();

        // Query all articles with stock management enabled
        // Note: Prisma doesn't support field-to-field comparison in WHERE clause
        // So we fetch all and filter in application layer (still more efficient than client-side)
        const allArticles = await prisma.article.findMany({
            where: {
                entrepriseId,
                actif: true,
                gestion_stock: true,
            },
            include: {
                categorie: {
                    select: {
                        id: true,
                        nom: true,
                    },
                },
            },
            orderBy: {
                stock_actuel: "asc",
            },
        });

        // Filter articles with low stock: stock_actuel <= stock_min
        const articles = allArticles.filter(
            (article) => article.stock_actuel <= article.stock_min
        );

        // Transform to expected format
        const alerts = articles.map((article) => ({
            id: article.id,
            reference: article.reference,
            nom: article.nom,
            stock_actuel: article.stock_actuel,
            stock_min: article.stock_min,
            prix_ht: Number(article.prix_ht),
            categorie: article.categorie
                ? {
                      id: article.categorie.id,
                      nom: article.categorie.nom,
                  }
                : null,
        }));

        return NextResponse.json(alerts);
    } catch (error) {
        return handleTenantError(error);
    }
}
