"use client";

import { AnalyticsKPIGrid } from "@/components/analytics/analytics-kpi-grid";
import { PeriodFilter } from "@/components/analytics/period-filter";
import { RevenueBreakdown } from "@/components/analytics/revenue-breakdown";
import { TopArticlesList } from "@/components/analytics/top-articles-list";
import { ConditionalSkeleton } from "@/components/ui/conditional-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { SectionTitle } from "@/components/ui/section-title";
import { useProfitabilityAnalytics } from "@/hooks/use-profitability-analytics";
import {
    Euro,
    FileText,
    Package,
    Receipt,
    TrendingDown,
    TrendingUp,
} from "lucide-react";

export default function ProfitabilityPage() {
    const {
        period,
        setPeriod,
        data,
        isLoading,
        error,
        formatAmount,
        getPeriodLabel,
        isTrendPositive,
        typeItems,
        categoryItems,
    } = useProfitabilityAnalytics();

    return (
        <ConditionalSkeleton
            isLoading={isLoading}
            skeletonProps={{
                layout: "stats-grid",
                statsCount: 4,
                gridColumns: 2,
                itemCount: 4,
                statsHeight: "h-28",
                itemHeight: "h-64",
            }}
        >
            {error ? (
                <div className="space-y-6">
                    <PageHeader
                        title="Analyse de rentabilité"
                        description="Revenus par type de produit et catégorie"
                    />
                    <EmptyState
                        icon={Receipt}
                        title="Erreur de chargement"
                        description="Une erreur est survenue lors du chargement des données."
                    />
                </div>
            ) : !data ? null : (
                <div className="space-y-6">
                    <PageHeader
                        title="Analyse de rentabilité"
                        description="Analyse détaillée des revenus par type et catégorie"
                        actions={
                            <PeriodFilter
                                value={period}
                                onValueChange={setPeriod}
                            />
                        }
                    />

                    {/* KPI Cards */}
                    <AnalyticsKPIGrid
                        kpis={[
                            {
                                title: `CA ${getPeriodLabel()}`,
                                value: formatAmount(data.summary.totalRevenue),
                                subtitle: `${data.summary.totalInvoices} facture${data.summary.totalInvoices > 1 ? "s" : ""} payée${data.summary.totalInvoices > 1 ? "s" : ""}`,
                                icon: Euro,
                            },
                            {
                                title: "Tendance",
                                value: `${isTrendPositive ? "+" : ""}${data.trends.growth.toFixed(1)}%`,
                                subtitle: "vs période précédente",
                                icon: isTrendPositive
                                    ? TrendingUp
                                    : TrendingDown,
                            },
                            {
                                title: "CA Produits",
                                value: formatAmount(
                                    data.byType.PRODUIT.revenue
                                ),
                                subtitle: `${data.byType.PRODUIT.percentage.toFixed(1)}% du total`,
                                icon: Package,
                            },
                            {
                                title: "CA Services",
                                value: formatAmount(
                                    data.byType.SERVICE.revenue
                                ),
                                subtitle: `${data.byType.SERVICE.percentage.toFixed(1)}% du total`,
                                icon: FileText,
                            },
                        ]}
                    />

                    {/* Revenue Breakdowns */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <RevenueBreakdown
                            title="Répartition par type"
                            items={typeItems}
                            totalRevenue={data.summary.totalRevenue}
                        />
                        {categoryItems.length > 0 && (
                            <RevenueBreakdown
                                title="Répartition par catégorie"
                                items={categoryItems.slice(0, 10)}
                                totalRevenue={data.summary.totalRevenue}
                            />
                        )}
                    </div>

                    {/* Top Products by Category */}
                    {data.byCategory.length > 0 && (
                        <div className="space-y-6">
                            <SectionTitle
                                title="Meilleurs produits/services par catégorie"
                                size="lg"
                            />
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {data.byCategory.slice(0, 6).map((category) => (
                                    <TopArticlesList
                                        key={category.categorieId}
                                        title={category.nom}
                                        articles={category.topArticles}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {data.summary.totalRevenue === 0 && (
                        <EmptyState
                            icon={Receipt}
                            title="Aucune donnée de vente"
                            description="Aucune facture payée pour la période sélectionnée"
                        />
                    )}
                </div>
            )}
        </ConditionalSkeleton>
    );
}
