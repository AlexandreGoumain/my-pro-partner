"use client";

import { AnalyticsKPICard } from "@/components/analytics/analytics-kpi-card";
import { PeriodFilter } from "@/components/analytics/period-filter";
import { RevenueBreakdown } from "@/components/analytics/revenue-breakdown";
import { TopArticlesList } from "@/components/analytics/top-articles-list";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingCard } from "@/components/ui/loading-card";
import { PageHeader } from "@/components/ui/page-header";
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

    if (isLoading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Analyse de rentabilité"
                    description="Revenus par type de produit et catégorie"
                />
                <LoadingCard />
            </div>
        );
    }

    if (error) {
        return (
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
        );
    }

    if (!data) {
        return null;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Analyse de rentabilité"
                description="Analyse détaillée des revenus par type et catégorie"
            />

            <PeriodFilter value={period} onValueChange={setPeriod} />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <AnalyticsKPICard
                    title={`CA ${getPeriodLabel()}`}
                    value={formatAmount(data.summary.totalRevenue)}
                    subtitle={`${data.summary.totalInvoices} facture${data.summary.totalInvoices > 1 ? "s" : ""} payée${data.summary.totalInvoices > 1 ? "s" : ""}`}
                    icon={Euro}
                />
                <AnalyticsKPICard
                    title="Tendance"
                    value={`${isTrendPositive ? "+" : ""}${data.trends.growth.toFixed(1)}%`}
                    subtitle="vs période précédente"
                    icon={isTrendPositive ? TrendingUp : TrendingDown}
                />
                <AnalyticsKPICard
                    title="CA Produits"
                    value={formatAmount(data.byType.PRODUIT.revenue)}
                    subtitle={`${data.byType.PRODUIT.percentage.toFixed(1)}% du total`}
                    icon={Package}
                />
                <AnalyticsKPICard
                    title="CA Services"
                    value={formatAmount(data.byType.SERVICE.revenue)}
                    subtitle={`${data.byType.SERVICE.percentage.toFixed(1)}% du total`}
                    icon={FileText}
                />
            </div>

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
                    <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-black">
                        Meilleurs produits/services par catégorie
                    </h2>
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
    );
}
