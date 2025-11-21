import { prisma } from "@/lib/prisma";
import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";

export interface ArticlesStats {
    total: number;
    produits: number;
    services: number;
    actifs: number;
    stockFaible: number;
}

export async function GET(_req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        // Execute all queries in parallel for better performance
        const [total, produits, services, actifs] = await Promise.all([
            // Total articles
            prisma.article.count({
                where: { entrepriseId },
            }),

            // Produits (type="PRODUIT")
            prisma.article.count({
                where: {
                    entrepriseId,
                    type: "PRODUIT",
                },
            }),

            // Services (type="SERVICE")
            prisma.article.count({
                where: {
                    entrepriseId,
                    type: "SERVICE",
                },
            }),

            // Articles actifs (actif=true)
            prisma.article.count({
                where: {
                    entrepriseId,
                    actif: true,
                },
            }),
        ]);

        // Stock faible (stock_actuel <= stock_min pour les produits uniquement)
        // Need to use raw query to compare two columns
        const stockFaibleResult = await prisma.$queryRaw<
            Array<{ count: bigint }>
        >`
            SELECT COUNT(*) as count
            FROM "Article"
            WHERE "entrepriseId" = ${entrepriseId}
              AND "type" = 'PRODUIT'
              AND "gestion_stock" = true
              AND "stock_actuel" <= "stock_min"
        `;
        const stockFaible = Number(stockFaibleResult[0].count);

        const stats: ArticlesStats = {
            total,
            produits,
            services,
            actifs,
            stockFaible,
        };

        return NextResponse.json(stats);
    } catch (error) {
        return handleTenantError(error);
    }
}
