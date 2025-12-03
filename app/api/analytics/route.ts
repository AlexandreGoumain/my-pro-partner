import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { calculatePeriodDates, calculatePercentageChange, type Period } from "@/lib/utils/date-periods";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/analytics
 * Get company analytics
 */
export async function GET(req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const searchParams = req.nextUrl.searchParams;
            const periodParam = searchParams.get("period") || "30d";

            // Validate and cast period
            const period = (["7d", "30d", "90d", "12m"].includes(periodParam)
                ? periodParam
                : "30d") as Exclude<Period, "custom">;

            // Use centralized date period calculation
            const { startDate, previousStartDate } = calculatePeriodDates(period);

            // Fetch documents for the period
            const documents = await prisma.document.findMany({
                where: {
                    entrepriseId: ctx.entrepriseId,
                    type: "FACTURE",
                    statut: "PAYE",
                    dateEmission: {
                        gte: startDate,
                    },
                },
                include: {
                    client: true,
                    paiements: true,
                    lignes: {
                        include: {
                            article: true,
                        },
                    },
                },
            });

            // Fetch previous period documents for comparison
            const previousDocuments = await prisma.document.findMany({
                where: {
                    entrepriseId: ctx.entrepriseId,
                    type: "FACTURE",
                    statut: "PAYE",
                    dateEmission: {
                        gte: previousStartDate,
                        lt: startDate,
                    },
                },
            });

            // Calculate totals
            const totalRevenue = documents.reduce(
                (sum, doc) => sum + Number(doc.total_ttc),
                0
            );
            const previousRevenue = previousDocuments.reduce(
                (sum, doc) => sum + Number(doc.total_ttc),
                0
            );
            const revenueChange = calculatePercentageChange(totalRevenue, previousRevenue);

            const totalOrders = documents.length;
            const previousOrders = previousDocuments.length;
            const ordersChange = calculatePercentageChange(totalOrders, previousOrders);

            // Unique clients
            const clientIds = new Set(documents.map((doc) => doc.clientId));
            const totalClients = clientIds.size;
            const previousClientIds = new Set(
                previousDocuments.map((doc) => doc.clientId)
            );
            const clientsChange = calculatePercentageChange(totalClients, previousClientIds.size);

            // Average order
            const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
            const previousAverageOrder =
                previousOrders > 0 ? previousRevenue / previousOrders : 0;
            const averageOrderChange = calculatePercentageChange(averageOrder, previousAverageOrder);

            // Top clients
            const clientStats = new Map<
                string,
                { client: { id: string; nom: string; prenom: string | null }; totalSpent: number; orderCount: number }
            >();

            documents.forEach((doc) => {
                const existing = clientStats.get(doc.clientId);
                if (existing) {
                    existing.totalSpent += Number(doc.total_ttc);
                    existing.orderCount++;
                } else {
                    clientStats.set(doc.clientId, {
                        client: doc.client,
                        totalSpent: Number(doc.total_ttc),
                        orderCount: 1,
                    });
                }
            });

            const topClients = Array.from(clientStats.values())
                .sort((a, b) => b.totalSpent - a.totalSpent)
                .slice(0, 10)
                .map((stat) => ({
                    id: stat.client.id,
                    nom: stat.client.nom,
                    prenom: stat.client.prenom,
                    totalSpent: stat.totalSpent,
                    orderCount: stat.orderCount,
                }));

            // Top products
            const productStats = new Map<
                string,
                { id: string; nom: string; totalSold: number; revenue: number }
            >();

            documents.forEach((doc) => {
                doc.lignes.forEach((ligne) => {
                    if (ligne.article) {
                        const existing = productStats.get(ligne.article.id);
                        if (existing) {
                            existing.totalSold += Number(ligne.quantite);
                            existing.revenue += Number(ligne.montant_ttc);
                        } else {
                            productStats.set(ligne.article.id, {
                                id: ligne.article.id,
                                nom: ligne.article.nom,
                                totalSold: Number(ligne.quantite),
                                revenue: Number(ligne.montant_ttc),
                            });
                        }
                    }
                });
            });

            const topProducts = Array.from(productStats.values())
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 10);

            // Payment methods
            const paymentStats = new Map<string, { count: number; amount: number }>();

            documents.forEach((doc) => {
                doc.paiements.forEach((paiement) => {
                    const existing = paymentStats.get(paiement.moyen_paiement);
                    if (existing) {
                        existing.count++;
                        existing.amount += Number(paiement.montant);
                    } else {
                        paymentStats.set(paiement.moyen_paiement, {
                            count: 1,
                            amount: Number(paiement.montant),
                        });
                    }
                });
            });

            const paymentMethods = Array.from(paymentStats.entries()).map(
                ([method, stats]) => ({
                    method,
                    count: stats.count,
                    amount: stats.amount,
                })
            );

            const data = {
                overview: {
                    totalRevenue,
                    revenueChange,
                    totalOrders,
                    ordersChange,
                    totalClients,
                    clientsChange,
                    averageOrder,
                    averageOrderChange,
                },
                topClients,
                topProducts,
                paymentMethods,
            };

            return NextResponse.json({ data });
        },
        {
            context: { resourceName: "Analytics", operation: "overview" },
        }
    );
}
