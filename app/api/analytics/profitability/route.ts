import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { validateFeatureAccess } from "@/lib/middleware/feature-validation";

export async function GET(req: NextRequest) {
    try {
        const { entrepriseId, entreprise } = await requireTenantAuth();

        // Check if user's plan allows advanced analytics (PRO+ only)
        const featureCheck = await validateFeatureAccess(entreprise.plan, "hasAdvancedAnalytics");
        if (featureCheck) return featureCheck;

        const searchParams = req.nextUrl.searchParams;
        const period = searchParams.get("period") || "all"; // all, year, quarter, month
        const topLimit = parseInt(searchParams.get("topLimit") || "10");

        // Calculate date range based on period
        const now = new Date();
        let dateFrom: Date | undefined;

        switch (period) {
            case "month":
                dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case "quarter":
                const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
                dateFrom = new Date(now.getFullYear(), quarterStartMonth, 1);
                break;
            case "year":
                dateFrom = new Date(now.getFullYear(), 0, 1);
                break;
        }

        // Get all paid invoices with their lines and articles
        const invoices = await prisma.document.findMany({
            where: {
                entrepriseId,
                type: "FACTURE",
                statut: "PAYE",
                ...(dateFrom && {
                    dateEmission: {
                        gte: dateFrom,
                    },
                }),
            },
            select: {
                id: true,
                dateEmission: true,
                total_ttc: true,
                lignes: {
                    select: {
                        designation: true,
                        quantite: true,
                        montant_ttc: true,
                        article: {
                            select: {
                                id: true,
                                reference: true,
                                nom: true,
                                type: true,
                                categorieId: true,
                                categorie: {
                                    select: {
                                        id: true,
                                        nom: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        // Initialize aggregation structures
        const typeRevenue = {
            PRODUIT: { revenue: 0, count: 0, quantity: 0 },
            SERVICE: { revenue: 0, count: 0, quantity: 0 },
            UNKNOWN: { revenue: 0, count: 0, quantity: 0 },
        };

        const categoryRevenue = new Map<
            string,
            {
                categorieId: string;
                nom: string;
                revenue: number;
                count: number;
                articles: Map<
                    string,
                    { nom: string; reference: string; revenue: number; quantity: number }
                >;
            }
        >();

        const uncategorizedRevenue = {
            revenue: 0,
            count: 0,
            articles: new Map<
                string,
                { nom: string; reference: string; revenue: number; quantity: number }
            >(),
        };

        // Process invoice lines
        for (const invoice of invoices) {
            for (const ligne of invoice.lignes) {
                const revenue = Number(ligne.montant_ttc);
                const quantity = Number(ligne.quantite);

                if (ligne.article) {
                    const article = ligne.article;
                    const type = article.type || "UNKNOWN";

                    // Aggregate by type
                    typeRevenue[type as keyof typeof typeRevenue].revenue += revenue;
                    typeRevenue[type as keyof typeof typeRevenue].count += 1;
                    typeRevenue[type as keyof typeof typeRevenue].quantity += quantity;

                    // Aggregate by category
                    if (article.categorie) {
                        const categoryId = article.categorie.id;
                        if (!categoryRevenue.has(categoryId)) {
                            categoryRevenue.set(categoryId, {
                                categorieId: categoryId,
                                nom: article.categorie.nom,
                                revenue: 0,
                                count: 0,
                                articles: new Map(),
                            });
                        }

                        const category = categoryRevenue.get(categoryId)!;
                        category.revenue += revenue;
                        category.count += 1;

                        // Track article performance within category
                        if (!category.articles.has(article.id)) {
                            category.articles.set(article.id, {
                                nom: article.nom,
                                reference: article.reference,
                                revenue: 0,
                                quantity: 0,
                            });
                        }
                        const articleData = category.articles.get(article.id)!;
                        articleData.revenue += revenue;
                        articleData.quantity += quantity;
                    } else {
                        // Uncategorized articles
                        uncategorizedRevenue.revenue += revenue;
                        uncategorizedRevenue.count += 1;

                        if (!uncategorizedRevenue.articles.has(article.id)) {
                            uncategorizedRevenue.articles.set(article.id, {
                                nom: article.nom,
                                reference: article.reference,
                                revenue: 0,
                                quantity: 0,
                            });
                        }
                        const articleData = uncategorizedRevenue.articles.get(article.id)!;
                        articleData.revenue += revenue;
                        articleData.quantity += quantity;
                    }
                } else {
                    // Lines without articles
                    typeRevenue.UNKNOWN.revenue += revenue;
                    typeRevenue.UNKNOWN.count += 1;
                    typeRevenue.UNKNOWN.quantity += quantity;
                }
            }
        }

        // Calculate total revenue
        const totalRevenue =
            typeRevenue.PRODUIT.revenue +
            typeRevenue.SERVICE.revenue +
            typeRevenue.UNKNOWN.revenue;

        // Format type breakdown
        const byType = {
            PRODUIT: {
                revenue: typeRevenue.PRODUIT.revenue,
                count: typeRevenue.PRODUIT.count,
                quantity: typeRevenue.PRODUIT.quantity,
                percentage: totalRevenue > 0 ? (typeRevenue.PRODUIT.revenue / totalRevenue) * 100 : 0,
            },
            SERVICE: {
                revenue: typeRevenue.SERVICE.revenue,
                count: typeRevenue.SERVICE.count,
                quantity: typeRevenue.SERVICE.quantity,
                percentage: totalRevenue > 0 ? (typeRevenue.SERVICE.revenue / totalRevenue) * 100 : 0,
            },
            UNKNOWN: {
                revenue: typeRevenue.UNKNOWN.revenue,
                count: typeRevenue.UNKNOWN.count,
                quantity: typeRevenue.UNKNOWN.quantity,
                percentage: totalRevenue > 0 ? (typeRevenue.UNKNOWN.revenue / totalRevenue) * 100 : 0,
            },
        };

        // Format category breakdown
        const byCategory = Array.from(categoryRevenue.values())
            .map((category) => {
                const topArticles = Array.from(category.articles.values())
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, topLimit)
                    .map((article) => ({
                        nom: article.nom,
                        reference: article.reference,
                        revenue: article.revenue,
                        quantity: article.quantity,
                    }));

                return {
                    categorieId: category.categorieId,
                    nom: category.nom,
                    revenue: category.revenue,
                    count: category.count,
                    percentage: totalRevenue > 0 ? (category.revenue / totalRevenue) * 100 : 0,
                    topArticles,
                };
            })
            .sort((a, b) => b.revenue - a.revenue);

        // Add uncategorized if exists
        if (uncategorizedRevenue.revenue > 0) {
            const topUncategorized = Array.from(uncategorizedRevenue.articles.values())
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, topLimit)
                .map((article) => ({
                    nom: article.nom,
                    reference: article.reference,
                    revenue: article.revenue,
                    quantity: article.quantity,
                }));

            byCategory.push({
                categorieId: "uncategorized",
                nom: "Sans catégorie",
                revenue: uncategorizedRevenue.revenue,
                count: uncategorizedRevenue.count,
                percentage:
                    totalRevenue > 0 ? (uncategorizedRevenue.revenue / totalRevenue) * 100 : 0,
                topArticles: topUncategorized,
            });
        }

        // Calculate trends (compare with previous period)
        let previousPeriodRevenue = 0;
        if (dateFrom) {
            const periodLength = now.getTime() - dateFrom.getTime();
            const previousDateFrom = new Date(dateFrom.getTime() - periodLength);

            const previousInvoices = await prisma.document.findMany({
                where: {
                    entrepriseId,
                    type: "FACTURE",
                    statut: "PAYE",
                    dateEmission: {
                        gte: previousDateFrom,
                        lt: dateFrom,
                    },
                },
                select: {
                    total_ttc: true,
                },
            });

            previousPeriodRevenue = previousInvoices.reduce(
                (sum, inv) => sum + Number(inv.total_ttc),
                0
            );
        }

        const growth =
            previousPeriodRevenue > 0
                ? ((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100
                : 0;

        return NextResponse.json({
            byType,
            byCategory,
            summary: {
                totalRevenue,
                totalInvoices: invoices.length,
                period,
                dateFrom: dateFrom?.toISOString(),
                dateTo: now.toISOString(),
            },
            trends: {
                currentPeriod: totalRevenue,
                previousPeriod: previousPeriodRevenue,
                growth: Math.round(growth * 100) / 100,
            },
        });
    } catch (error) {
        return handleTenantError(error);
    }
}
