"use client";

import { AnalyticsKPICard } from "@/components/analytics/analytics-kpi-card";
import { ConversionRateCard } from "@/components/analytics/conversion-rate-card";
import { InvoiceStatusCard } from "@/components/analytics/invoice-status-card";
import { OverdueInvoicesCard } from "@/components/analytics/overdue-invoices-card";
import { LoadingCard } from "@/components/ui/loading-card";
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

    if (isLoading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Analytics"
                    description="Suivez vos performances de vente"
                />
                <LoadingCard
                    showSpinner
                    message="Chargement des analytics..."
                />
            </div>
        );
    }

    if (!analytics) {
        return null;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Analytics & Statistiques"
                description="Vue d'ensemble de vos performances de vente"
            />

            {/* Revenue cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <AnalyticsKPICard
                    title="Chiffre d'affaires total"
                    value={formatCurrency(analytics.totalRevenue)}
                    icon={Euro}
                />

                <AnalyticsKPICard
                    title="CA ce mois"
                    value={formatCurrency(analytics.revenueThisMonth)}
                    subtitle={`${formatTrendPercentage(trend)} vs mois dernier`}
                    icon={trend.isPositive ? TrendingUp : TrendingDown}
                />

                <AnalyticsKPICard
                    title="Devis"
                    value={analytics.totalQuotes}
                    subtitle={`Valeur moyenne: ${formatCurrency(analytics.averageQuoteValue)}`}
                    icon={FileText}
                />

                <AnalyticsKPICard
                    title="Factures"
                    value={analytics.totalInvoices}
                    subtitle={`Valeur moyenne: ${formatCurrency(analytics.averageInvoiceValue)}`}
                    icon={Receipt}
                />
            </div>

            {/* Detailed stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InvoiceStatusCard
                    paidInvoices={analytics.paidInvoices}
                    unpaidInvoices={analytics.unpaidInvoices}
                    overdueInvoices={analytics.overdueInvoices}
                />

                <ConversionRateCard conversionRate={analytics.conversionRate} />

                <OverdueInvoicesCard
                    overdueInvoices={analytics.overdueInvoices}
                />
            </div>
        </div>
    );
}
