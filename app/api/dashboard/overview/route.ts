import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import type {
    ActivityEvent,
    BusinessHealth,
    ClientMetrics,
    DashboardOverview,
    DocumentPipeline,
    Goal,
    Insight,
    PaymentMetrics,
    PeriodComparison,
    RevenueMetrics,
    SalesMetrics,
    StockMetrics,
    TopPerformers,
} from "@/lib/types/dashboard";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/dashboard/overview
 * Comprehensive dashboard data aggregation endpoint
 * Returns all metrics, insights, and business intelligence
 */
export async function GET(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        // Get period from query params (default: last 30 days)
        const searchParams = req.nextUrl.searchParams;
        const periodDays = parseInt(searchParams.get("period") || "30");

        const now = new Date();
        const periodStart = new Date(now);
        periodStart.setDate(periodStart.getDate() - periodDays);

        // Define date ranges for comparisons
        const firstDayThisMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );
        const firstDayLastMonth = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
        );
        const firstDayThisYear = new Date(now.getFullYear(), 0, 1);
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Fetch all data in parallel for performance
        const [documents, clients, articles, mouvementsStock, paiements] =
            await Promise.all([
                prisma.document.findMany({
                    where: { entrepriseId },
                    select: {
                        id: true,
                        type: true,
                        numero: true,
                        total_ttc: true,
                        statut: true,
                        dateEmission: true,
                        dateEcheance: true,
                        createdAt: true,
                        client: {
                            select: {
                                id: true,
                                nom: true,
                                prenom: true,
                            },
                        },
                        lignes: {
                            select: {
                                article: {
                                    select: {
                                        id: true,
                                        reference: true,
                                        nom: true,
                                    },
                                },
                                quantite: true,
                                prix_unitaire_ht: true,
                                montant_ttc: true,
                            },
                        },
                    },
                }),
                prisma.client.findMany({
                    where: { entrepriseId },
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        createdAt: true,
                        updatedAt: true,
                        documents: {
                            where: { statut: "PAYE", type: "FACTURE" },
                            select: {
                                total_ttc: true,
                                dateEmission: true,
                            },
                        },
                    },
                }),
                prisma.article.findMany({
                    where: { entrepriseId },
                    select: {
                        id: true,
                        reference: true,
                        nom: true,
                        prix_ht: true,
                        tva_taux: true,
                        stock_actuel: true,
                        stock_min: true,
                        valeurEstimee: true,
                    },
                }),
                prisma.mouvementStock.findMany({
                    where: {
                        article: { entrepriseId },
                        createdAt: { gte: periodStart },
                    },
                    select: {
                        type: true,
                        quantite: true,
                        createdAt: true,
                    },
                }),
                prisma.paiement.findMany({
                    where: {
                        document: { entrepriseId },
                    },
                    select: {
                        montant: true,
                        date_paiement: true,
                        documentId: true,
                    },
                }),
            ]);

        // Calculate all metrics
        const revenue = calculateRevenueMetrics(
            documents,
            now,
            firstDayThisMonth,
            firstDayLastMonth
        );
        const payments = calculatePaymentMetrics(documents, paiements, now);
        const clientMetrics = calculateClientMetrics(
            clients,
            now,
            thirtyDaysAgo
        );
        const sales = calculateSalesMetrics(
            documents,
            now,
            firstDayThisMonth,
            firstDayLastMonth
        );
        const stock = calculateStockMetrics(
            articles,
            mouvementsStock,
            periodDays
        );
        const topPerformers = calculateTopPerformers(
            clients,
            documents,
            articles
        );
        const pipeline = calculateDocumentPipeline(documents);
        const health = calculateBusinessHealth(
            revenue,
            payments,
            clientMetrics,
            sales,
            stock
        );
        const insights = generateInsights(
            documents,
            clients,
            articles,
            health,
            sales,
            stock
        );
        const activities = generateActivityTimeline(
            documents,
            clients,
            mouvementsStock
        );
        const goals = calculateGoals(revenue, sales, clientMetrics);

        const overview: DashboardOverview = {
            revenue,
            payments,
            clients: clientMetrics,
            sales,
            stock,
            topPerformers,
            pipeline,
            health,
            insights,
            activities,
            goals,
            lastUpdated: now,
            period: {
                start: periodStart,
                end: now,
            },
        };

        return NextResponse.json({ success: true, data: overview });
    } catch (error) {
        return handleTenantError(error);
    }
}

// ============================================================================
// Helper Functions - Revenue Metrics
// ============================================================================

function calculateRevenueMetrics(
    documents: any[],
    now: Date,
    firstDayThisMonth: Date,
    firstDayLastMonth: Date
): RevenueMetrics {
    const invoices = documents.filter((d) => d.type === "FACTURE");
    const paidInvoices = invoices.filter((i) => i.statut === "PAYE");

    // Total revenue (all time)
    const total = paidInvoices.reduce((sum, i) => sum + Number(i.total_ttc), 0);

    // This month
    const thisMonth = paidInvoices
        .filter((i) => new Date(i.dateEmission) >= firstDayThisMonth)
        .reduce((sum, i) => sum + Number(i.total_ttc), 0);

    // Last month
    const lastMonth = paidInvoices
        .filter(
            (i) =>
                new Date(i.dateEmission) >= firstDayLastMonth &&
                new Date(i.dateEmission) < firstDayThisMonth
        )
        .reduce((sum, i) => sum + Number(i.total_ttc), 0);

    // Comparison
    const change =
        lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;
    const comparison: PeriodComparison = {
        current: thisMonth,
        previous: lastMonth,
        change: Math.round(change * 10) / 10,
        trend: change > 2 ? "up" : change < -2 ? "down" : "stable",
    };

    // 6-month trend
    const trend = [];
    for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonth = new Date(
            now.getFullYear(),
            now.getMonth() - i + 1,
            1
        );
        const monthRevenue = paidInvoices
            .filter(
                (inv) =>
                    new Date(inv.dateEmission) >= monthDate &&
                    new Date(inv.dateEmission) < nextMonth
            )
            .reduce((sum, inv) => sum + Number(inv.total_ttc), 0);

        trend.push({
            month: monthDate.toLocaleDateString("fr-FR", {
                month: "short",
                year: "numeric",
            }),
            amount: monthRevenue,
        });
    }

    // Average transaction
    const averageTransaction =
        paidInvoices.length > 0 ? total / paidInvoices.length : 0;

    // Projected end of month (simple linear projection)
    const dayOfMonth = now.getDate();
    const daysInMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
    ).getDate();
    const projectedEndOfMonth =
        dayOfMonth > 0 ? (thisMonth / dayOfMonth) * daysInMonth : 0;

    return {
        total,
        thisMonth,
        lastMonth,
        comparison,
        trend,
        averageTransaction,
        projectedEndOfMonth,
    };
}

// ============================================================================
// Helper Functions - Payment Metrics
// ============================================================================

function calculatePaymentMetrics(
    documents: any[],
    paiements: any[],
    now: Date
): PaymentMetrics {
    const invoices = documents.filter((d) => d.type === "FACTURE");
    const unpaidInvoices = invoices.filter(
        (i) => i.statut !== "PAYE" && i.statut !== "ANNULE"
    );

    // Outstanding amount (total unpaid)
    const outstanding = unpaidInvoices.reduce(
        (sum, i) => sum + Number(i.total_ttc),
        0
    );

    // Overdue amount
    const overdue = unpaidInvoices
        .filter((i) => i.dateEcheance && new Date(i.dateEcheance) < now)
        .reduce((sum, i) => sum + Number(i.total_ttc), 0);

    // Average payment delay
    const paidInvoices = invoices.filter((i) => i.statut === "PAYE");
    let totalDelay = 0;
    let delayCount = 0;

    paidInvoices.forEach((invoice) => {
        const payment = paiements.find((p) => p.documentId === invoice.id);
        if (payment && invoice.dateEcheance) {
            const delay = Math.max(
                0,
                Math.floor(
                    (new Date(payment.date_paiement).getTime() -
                        new Date(invoice.dateEcheance).getTime()) /
                        (1000 * 60 * 60 * 24)
                )
            );
            totalDelay += delay;
            delayCount++;
        }
    });

    const averagePaymentDelay =
        delayCount > 0 ? Math.round(totalDelay / delayCount) : 0;

    // DSO (Days Sales Outstanding) - simplified calculation
    const last30DaysInvoices = invoices.filter((i) => {
        const date = new Date(i.dateEmission);
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return date >= thirtyDaysAgo;
    });

    const dso =
        last30DaysInvoices.length > 0
            ? Math.round((outstanding / (outstanding + overdue || 1)) * 30)
            : 0;

    return {
        outstanding,
        overdue,
        averagePaymentDelay,
        dso,
    };
}

// ============================================================================
// Helper Functions - Client Metrics
// ============================================================================

function calculateClientMetrics(
    clients: any[],
    now: Date,
    thirtyDaysAgo: Date
): ClientMetrics {
    const total = clients.length;

    // New clients this month
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
    );

    const newThisMonth = clients.filter(
        (c) => new Date(c.createdAt) >= firstDayThisMonth
    ).length;

    const newLastMonth = clients.filter(
        (c) =>
            new Date(c.createdAt) >= firstDayLastMonth &&
            new Date(c.createdAt) < firstDayThisMonth
    ).length;

    const change =
        newLastMonth > 0
            ? ((newThisMonth - newLastMonth) / newLastMonth) * 100
            : 0;
    const newComparison: PeriodComparison = {
        current: newThisMonth,
        previous: newLastMonth,
        change: Math.round(change * 10) / 10,
        trend: change > 5 ? "up" : change < -5 ? "down" : "stable",
    };

    // Active clients (with recent activity)
    const active = clients.filter(
        (c) => new Date(c.updatedAt) >= thirtyDaysAgo
    ).length;

    // Inactive clients (no activity in 30 days)
    const inactive = total - active;

    // Churn risk (clients with no purchases in 60 days who previously purchased)
    const sixtyDaysAgo = new Date(now);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const churnRisk = clients.filter((c) => {
        const hasOldPurchases = c.documents && c.documents.length > 0;
        const lastPurchase =
            c.documents && c.documents.length > 0
                ? new Date(
                      Math.max(
                          ...c.documents.map((d: any) =>
                              new Date(d.dateEmission).getTime()
                          )
                      )
                  )
                : null;
        return hasOldPurchases && lastPurchase && lastPurchase < sixtyDaysAgo;
    }).length;

    // Average lifetime value
    const totalRevenue = clients.reduce((sum, c) => {
        const clientRevenue =
            c.documents?.reduce(
                (cSum: number, d: any) => cSum + Number(d.total_ttc),
                0
            ) || 0;
        return sum + clientRevenue;
    }, 0);

    const averageLifetimeValue = total > 0 ? totalRevenue / total : 0;

    return {
        total,
        new: newThisMonth,
        newComparison,
        active,
        inactive,
        churnRisk,
        averageLifetimeValue,
    };
}

// ============================================================================
// Helper Functions - Sales Metrics
// ============================================================================

function calculateSalesMetrics(
    documents: any[],
    now: Date,
    firstDayThisMonth: Date,
    firstDayLastMonth: Date
): SalesMetrics {
    const quotes = documents.filter((d) => d.type === "DEVIS");
    const invoices = documents.filter((d) => d.type === "FACTURE");

    // Quotes this month
    const quotesCreated = quotes.filter(
        (q) => new Date(q.createdAt) >= firstDayThisMonth
    ).length;

    // Invoices created from quotes this month
    const quotesConverted = invoices.filter(
        (i) => new Date(i.createdAt) >= firstDayThisMonth
    ).length;

    // Conversion rate this month
    const conversionRate =
        quotesCreated > 0 ? (quotesConverted / quotesCreated) * 100 : 0;

    // Last month conversion
    const quotesLastMonth = quotes.filter(
        (q) =>
            new Date(q.createdAt) >= firstDayLastMonth &&
            new Date(q.createdAt) < firstDayThisMonth
    ).length;

    const convertedLastMonth = invoices.filter(
        (i) =>
            new Date(i.createdAt) >= firstDayLastMonth &&
            new Date(i.createdAt) < firstDayThisMonth
    ).length;

    const conversionLastMonth =
        quotesLastMonth > 0 ? (convertedLastMonth / quotesLastMonth) * 100 : 0;

    const conversionChange =
        conversionLastMonth > 0
            ? ((conversionRate - conversionLastMonth) / conversionLastMonth) *
              100
            : 0;

    const conversionRateComparison: PeriodComparison = {
        current: conversionRate,
        previous: conversionLastMonth,
        change: Math.round(conversionChange * 10) / 10,
        trend:
            conversionChange > 2
                ? "up"
                : conversionChange < -2
                  ? "down"
                  : "stable",
    };

    // Invoices status
    const invoicesPaid = invoices.filter((i) => i.statut === "PAYE").length;
    const invoicesPending = invoices.filter(
        (i) => i.statut !== "PAYE" && i.statut !== "ANNULE"
    ).length;

    // Average ticket
    const averageTicket =
        invoicesPaid > 0
            ? invoices
                  .filter((i) => i.statut === "PAYE")
                  .reduce((sum, i) => sum + Number(i.total_ttc), 0) /
              invoicesPaid
            : 0;

    return {
        quotesCreated,
        quotesConverted,
        conversionRate: Math.round(conversionRate * 10) / 10,
        conversionRateComparison,
        invoicesPaid,
        invoicesPending,
        averageTicket,
    };
}

// ============================================================================
// Helper Functions - Stock Metrics
// ============================================================================

function calculateStockMetrics(
    articles: any[],
    mouvements: any[],
    periodDays: number
): StockMetrics {
    const totalArticles = articles.length;

    // Out of stock
    const outOfStock = articles.filter((a) => a.stock_actuel <= 0).length;

    // Low stock (below minimum)
    const lowStock = articles.filter(
        (a) => a.stock_actuel > 0 && a.stock_actuel <= a.stock_min
    ).length;

    // Stock value (using valeurEstimee if available, otherwise calculate TTC from HT)
    const stockValue = articles.reduce((sum, a) => {
        const prix = a.valeurEstimee
            ? Number(a.valeurEstimee)
            : Number(a.prix_ht) * (1 + Number(a.tva_taux) / 100);
        return sum + a.stock_actuel * prix;
    }, 0);

    // Turnover rate (movements / period)
    const totalMovements = mouvements.filter((m) => m.type === "SORTIE").length;
    const turnoverRate =
        periodDays > 0 ? (totalMovements / periodDays) * 30 : 0;

    return {
        totalArticles,
        outOfStock,
        lowStock,
        stockValue,
        turnoverRate: Math.round(turnoverRate * 10) / 10,
    };
}

// ============================================================================
// Helper Functions - Top Performers
// ============================================================================

function calculateTopPerformers(
    clients: any[],
    documents: any[],
    articles: any[]
): TopPerformers {
    // Top 5 clients by revenue
    const clientRevenues = clients.map((client) => {
        const revenue =
            client.documents?.reduce(
                (sum: number, d: any) => sum + Number(d.total_ttc),
                0
            ) || 0;

        const invoiceCount = client.documents?.length || 0;
        const lastPurchase =
            client.documents && client.documents.length > 0
                ? new Date(
                      Math.max(
                          ...client.documents.map((d: any) =>
                              new Date(d.dateEmission).getTime()
                          )
                      )
                  )
                : new Date();

        return {
            id: client.id,
            nom: `${client.nom} ${client.prenom || ""}`.trim(),
            revenue,
            invoiceCount,
            lastPurchase,
        };
    });

    const topClients = clientRevenues
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    // Top 5 products by revenue
    const productRevenues = new Map<
        string,
        { revenue: number; quantity: number; article: any }
    >();

    documents.forEach((doc) => {
        if (doc.type === "FACTURE" && doc.statut === "PAYE") {
            doc.lignes?.forEach((ligne: any) => {
                if (ligne.article) {
                    const articleId = ligne.article.id;
                    const existing = productRevenues.get(articleId) || {
                        revenue: 0,
                        quantity: 0,
                        article: ligne.article,
                    };

                    productRevenues.set(articleId, {
                        revenue: existing.revenue + Number(ligne.montant_ttc),
                        quantity: existing.quantity + Number(ligne.quantite),
                        article: ligne.article,
                    });
                }
            });
        }
    });

    const topProducts = Array.from(productRevenues.entries())
        .map(([id, data]) => ({
            id,
            reference: data.article.reference,
            nom: data.article.nom,
            revenue: data.revenue,
            quantitySold: data.quantity,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    return {
        clients: topClients,
        products: topProducts,
    };
}

// ============================================================================
// Helper Functions - Document Pipeline
// ============================================================================

function calculateDocumentPipeline(documents: any[]): DocumentPipeline {
    const quotes = documents.filter((d) => d.type === "DEVIS");
    const invoices = documents.filter((d) => d.type === "FACTURE");

    const now = new Date();

    return {
        quotes: {
            draft: quotes.filter((q) => q.statut === "BROUILLON").length,
            sent: quotes.filter((q) => q.statut === "ENVOYE").length,
            accepted: quotes.filter((q) => q.statut === "ACCEPTE").length,
            rejected: quotes.filter((q) => q.statut === "REFUSE").length,
            total: quotes.length,
            totalAmount: quotes.reduce(
                (sum, q) => sum + Number(q.total_ttc),
                0
            ),
        },
        invoices: {
            draft: invoices.filter((i) => i.statut === "BROUILLON").length,
            sent: invoices.filter((i) => i.statut === "ENVOYE").length,
            paid: invoices.filter((i) => i.statut === "PAYE").length,
            overdue: invoices.filter(
                (i) =>
                    i.statut !== "PAYE" &&
                    i.statut !== "ANNULE" &&
                    i.dateEcheance &&
                    new Date(i.dateEcheance) < now
            ).length,
            total: invoices.length,
            totalAmount: invoices.reduce(
                (sum, i) => sum + Number(i.total_ttc),
                0
            ),
        },
    };
}

// ============================================================================
// Helper Functions - Business Health Score
// ============================================================================

function calculateBusinessHealth(
    revenue: RevenueMetrics,
    payments: PaymentMetrics,
    clients: ClientMetrics,
    sales: SalesMetrics,
    stock: StockMetrics
): BusinessHealth {
    // Revenue factor (0-100)
    const revenueFactor = Math.min(
        100,
        revenue.comparison.trend === "up" ? 80 + revenue.comparison.change : 50
    );

    // Cashflow factor (based on DSO and outstanding)
    const cashflowFactor = Math.max(0, 100 - payments.dso);

    // Client growth factor
    const clientGrowthFactor = Math.min(
        100,
        clients.newComparison.trend === "up"
            ? 70 + clients.newComparison.change
            : 50
    );

    // Conversion factor
    const conversionFactor = Math.min(100, sales.conversionRate);

    // Stock factor (penalize out of stock)
    const stockFactor =
        stock.totalArticles > 0
            ? Math.max(0, 100 - (stock.outOfStock / stock.totalArticles) * 100)
            : 100;

    // Weighted average score
    const score = Math.round(
        revenueFactor * 0.3 +
            cashflowFactor * 0.25 +
            clientGrowthFactor * 0.2 +
            conversionFactor * 0.15 +
            stockFactor * 0.1
    );

    const level: BusinessHealth["level"] =
        score >= 80
            ? "excellent"
            : score >= 60
              ? "good"
              : score >= 40
                ? "poor"
                : "critical";

    return {
        score,
        level,
        factors: {
            revenue: Math.round(revenueFactor),
            cashflow: Math.round(cashflowFactor),
            clientGrowth: Math.round(clientGrowthFactor),
            conversion: Math.round(conversionFactor),
            stock: Math.round(stockFactor),
        },
    };
}

// ============================================================================
// Helper Functions - Insights Generation
// ============================================================================

function generateInsights(
    documents: any[],
    clients: any[],
    articles: any[],
    health: BusinessHealth,
    sales: SalesMetrics,
    stock: StockMetrics
): Insight[] {
    const insights: Insight[] = [];
    let insightId = 1;

    // Stock alerts
    if (stock.outOfStock > 0) {
        insights.push({
            id: `insight-${insightId++}`,
            type: "alert",
            priority: "high",
            title: "Articles en rupture de stock",
            description: `${stock.outOfStock} article${stock.outOfStock > 1 ? "s sont" : " est"} en rupture de stock`,
            action: {
                label: "Voir les articles",
                href: "/articles?filter=outOfStock",
            },
            metric: {
                value: stock.outOfStock.toString(),
            },
        });
    }

    if (stock.lowStock > 0) {
        insights.push({
            id: `insight-${insightId++}`,
            type: "warning",
            priority: "medium",
            title: "Stock faible",
            description: `${stock.lowStock} article${stock.lowStock > 1 ? "s ont" : " a"} un stock faible`,
            action: {
                label: "Réapprovisionner",
                href: "/articles?filter=lowStock",
            },
        });
    }

    // Overdue invoices
    const invoices = documents.filter((d) => d.type === "FACTURE");
    const now = new Date();
    const overdueInvoices = invoices.filter(
        (i) =>
            i.statut !== "PAYE" &&
            i.statut !== "ANNULE" &&
            i.dateEcheance &&
            new Date(i.dateEcheance) < now
    );

    if (overdueInvoices.length > 0) {
        const overdueAmount = overdueInvoices.reduce(
            (sum, i) => sum + Number(i.total_ttc),
            0
        );
        insights.push({
            id: `insight-${insightId++}`,
            type: "alert",
            priority: "high",
            title: "Factures en retard",
            description: `${overdueInvoices.length} facture${overdueInvoices.length > 1 ? "s" : ""} en retard de paiement`,
            action: {
                label: "Voir les factures",
                href: "/documents?filter=overdue",
            },
            metric: {
                value: `${overdueAmount.toFixed(2)}€`,
            },
        });
    }

    // Inactive clients
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const inactiveClients = clients.filter((c) => {
        return (
            c.documents &&
            c.documents.length > 0 &&
            new Date(c.updatedAt) < thirtyDaysAgo
        );
    });

    if (inactiveClients.length > 0 && inactiveClients.length <= 10) {
        insights.push({
            id: `insight-${insightId++}`,
            type: "opportunity",
            priority: "medium",
            title: "Clients à relancer",
            description: `${inactiveClients.length} client${inactiveClients.length > 1 ? "s n'ont" : " n'a"} pas été actif${inactiveClients.length > 1 ? "s" : ""} récemment`,
            action: {
                label: "Voir les clients",
                href: "/clients?filter=inactive",
            },
        });
    }

    // Low conversion rate
    if (sales.conversionRate < 30 && sales.quotesCreated > 5) {
        insights.push({
            id: `insight-${insightId++}`,
            type: "warning",
            priority: "medium",
            title: "Taux de conversion faible",
            description: `Seulement ${sales.conversionRate.toFixed(1)}% de vos devis sont convertis`,
            action: {
                label: "Analyser les devis",
                href: "/documents?type=quote",
            },
            metric: {
                value: `${sales.conversionRate.toFixed(1)}%`,
            },
        });
    }

    // Health score warnings
    if (health.level === "poor" || health.level === "critical") {
        insights.push({
            id: `insight-${insightId++}`,
            type: "alert",
            priority: "high",
            title: "Santé du business à surveiller",
            description: `Votre score de santé est ${health.level === "critical" ? "critique" : "faible"} (${health.score}/100)`,
            metric: {
                value: `${health.score}/100`,
            },
        });
    }

    // Positive insights
    if (sales.conversionRate > 70 && sales.quotesCreated > 5) {
        insights.push({
            id: `insight-${insightId++}`,
            type: "info",
            priority: "low",
            title: "Excellent taux de conversion",
            description: `Vous convertissez ${sales.conversionRate.toFixed(1)}% de vos devis !`,
            metric: {
                value: `${sales.conversionRate.toFixed(1)}%`,
            },
        });
    }

    return insights.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
}

// ============================================================================
// Helper Functions - Activity Timeline
// ============================================================================

function generateActivityTimeline(
    documents: any[],
    clients: any[],
    mouvements: any[]
): ActivityEvent[] {
    const activities: ActivityEvent[] = [];

    // Recent documents (last 10)
    documents
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
        .slice(0, 10)
        .forEach((doc) => {
            activities.push({
                id: `doc-${doc.id}`,
                type: "document",
                action:
                    doc.type === "DEVIS"
                        ? "Nouveau devis créé"
                        : doc.type === "FACTURE"
                          ? "Nouvelle facture créée"
                          : "Nouveau document créé",
                description: `${doc.numero} - ${doc.client?.nom || "Client inconnu"}`,
                timestamp: new Date(doc.createdAt),
                metadata: {
                    clientName: doc.client
                        ? `${doc.client.nom} ${doc.client.prenom || ""}`.trim()
                        : undefined,
                    amount: Number(doc.total_ttc),
                    documentNumber: doc.numero,
                },
            });
        });

    // Recent clients (last 5)
    clients
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
        .slice(0, 5)
        .forEach((client) => {
            activities.push({
                id: `client-${client.id}`,
                type: "client",
                action: "Nouveau client ajouté",
                description: `${client.nom} ${client.prenom || ""}`.trim(),
                timestamp: new Date(client.createdAt),
                metadata: {
                    clientName: `${client.nom} ${client.prenom || ""}`.trim(),
                },
            });
        });

    // Recent stock movements (last 5 significant ones)
    mouvements
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
        .slice(0, 5)
        .forEach((mouvement, idx) => {
            activities.push({
                id: `stock-${idx}`,
                type: "stock",
                action:
                    mouvement.type === "ENTREE"
                        ? "Entrée de stock"
                        : "Sortie de stock",
                description: `${mouvement.quantite} unité${mouvement.quantite > 1 ? "s" : ""}`,
                timestamp: new Date(mouvement.createdAt),
            });
        });

    // Sort all activities by timestamp
    return activities
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 15);
}

// ============================================================================
// Helper Functions - Goals
// ============================================================================

function calculateGoals(
    revenue: RevenueMetrics,
    sales: SalesMetrics,
    clients: ClientMetrics
): Goal[] {
    const goals: Goal[] = [];

    // Revenue goal (example: 50k per month)
    const revenueTarget = 50000;
    const revenueProgress = Math.min(
        100,
        (revenue.thisMonth / revenueTarget) * 100
    );
    goals.push({
        id: "goal-revenue",
        label: "Chiffre d'affaires mensuel",
        target: revenueTarget,
        current: revenue.thisMonth,
        unit: "currency",
        period: "month",
        progress: Math.round(revenueProgress),
        onTrack: revenueProgress >= 80,
    });

    // New clients goal (example: 10 per month)
    const clientTarget = 10;
    const clientProgress = Math.min(100, (clients.new / clientTarget) * 100);
    goals.push({
        id: "goal-clients",
        label: "Nouveaux clients",
        target: clientTarget,
        current: clients.new,
        unit: "number",
        period: "month",
        progress: Math.round(clientProgress),
        onTrack: clientProgress >= 80,
    });

    // Conversion rate goal (example: 60%)
    const conversionTarget = 60;
    const conversionProgress = Math.min(
        100,
        (sales.conversionRate / conversionTarget) * 100
    );
    goals.push({
        id: "goal-conversion",
        label: "Taux de conversion",
        target: conversionTarget,
        current: Math.round(sales.conversionRate),
        unit: "percentage",
        period: "month",
        progress: Math.round(conversionProgress),
        onTrack: conversionProgress >= 80,
    });

    return goals;
}
