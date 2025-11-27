"use client";

import { AnalyticsKPIGrid } from "@/components/analytics/analytics-kpi-grid";
import { ConversionRateCard } from "@/components/analytics/conversion-rate-card";
import { InvoiceStatusCard } from "@/components/analytics/invoice-status-card";
import { OverdueInvoicesCard } from "@/components/analytics/overdue-invoices-card";
import { ConditionalSkeleton } from "@/components/ui/conditional-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { useAnalytics } from "@/hooks/use-analytics";
import {
    calculateRevenueTrend,
    formatTrendPercentage,
} from "@/lib/utils/analytics";
import { formatCurrency } from "@/lib/utils/format";
import {
    Euro,
    FileText,
    Receipt,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import { useMemo } from "react";

export default function AnalyticsPage() {
    const { data: analytics, isLoading } = useAnalytics();

    const trend = useMemo(() => calculateRevenueTrend(analytics), [analytics]);

    return (
        <ConditionalSkeleton
            isLoading={isLoading}
            skeletonProps={{
                layout: "stats-grid",
                statsCount: 4,
                gridColumns: 3,
                itemCount: 3,
                statsHeight: "h-28",
                itemHeight: "h-48",
            }}
        >
            {!analytics ? null : (
                <div className="space-y-6">
                    <PageHeader
                        title="Analytics & Statistiques"
                        description="Vue d'ensemble de vos performances de vente"
                    />

                    {/* Revenue cards */}
                    <AnalyticsKPIGrid
                        kpis={[
                            {
                                title: "Chiffre d'affaires total",
                                value: formatCurrency(analytics.totalRevenue),
                                icon: Euro,
                            },
                            {
                                title: "CA ce mois",
                                value: formatCurrency(
                                    analytics.revenueThisMonth
                                ),
                                subtitle: `${formatTrendPercentage(trend)} vs mois dernier`,
                                icon: trend.isPositive
                                    ? TrendingUp
                                    : TrendingDown,
                            },
                            {
                                title: "Devis",
                                value: analytics.totalQuotes,
                                subtitle: `Valeur moyenne: ${formatCurrency(analytics.averageQuoteValue)}`,
                                icon: FileText,
                            },
                            {
                                title: "Factures",
                                value: analytics.totalInvoices,
                                subtitle: `Valeur moyenne: ${formatCurrency(analytics.averageInvoiceValue)}`,
                                icon: Receipt,
                            },
                        ]}
                    />

                    {/* Detailed stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InvoiceStatusCard
                            paidInvoices={analytics.paidInvoices}
                            unpaidInvoices={analytics.unpaidInvoices}
                            overdueInvoices={analytics.overdueInvoices}
                        />

                        <ConversionRateCard
                            conversionRate={analytics.conversionRate}
                        />

                        <OverdueInvoicesCard
                            overdueInvoices={analytics.overdueInvoices}
                        />
                    </div>
                </div>
            )}
        </ConditionalSkeleton>
    );
}
