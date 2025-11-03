"use client";

import { Card } from "@/components/ui/card";
import { LoadingCard } from "@/components/ui/loading-card";
import { PageHeader } from "@/components/ui/page-header";
import {
    Clock,
    Euro,
    FileText,
    Receipt,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import { useMemo } from "react";
import { useAnalytics } from "@/hooks/use-analytics";

export default function AnalyticsPage() {
    const { data: analytics, isLoading, error } = useAnalytics();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(value);
    };

    const trend = useMemo(() => {
        if (!analytics || analytics.revenueLastMonth === 0) return 0;
        return (
            ((analytics.revenueThisMonth - analytics.revenueLastMonth) /
                analytics.revenueLastMonth) *
            100
        );
    }, [analytics]);

    const isTrendPositive = useMemo(() => trend >= 0, [trend]);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Analytics"
                    description="Suivez vos performances de vente"
                />
                <LoadingCard />
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
                <Card className="p-6 border-black/8 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[14px] text-black/60">
                            Chiffre d&apos;affaires total
                        </span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
                            <Euro
                                className="h-5 w-5 text-black/60"
                                strokeWidth={2}
                            />
                        </div>
                    </div>
                    <div className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {formatCurrency(analytics.totalRevenue)}
                    </div>
                </Card>

                <Card className="p-6 border-black/8 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[14px] text-black/60">
                            CA ce mois
                        </span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
                            {isTrendPositive ? (
                                <TrendingUp
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            ) : (
                                <TrendingDown
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            )}
                        </div>
                    </div>
                    <div className="text-[28px] font-bold tracking-[-0.02em] text-black mb-1">
                        {formatCurrency(analytics.revenueThisMonth)}
                    </div>
                    <div className="text-[13px] font-medium text-black/60">
                        {isTrendPositive ? "+" : ""}
                        {trend.toFixed(1)}% vs mois dernier
                    </div>
                </Card>

                <Card className="p-6 border-black/8 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[14px] text-black/60">Devis</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
                            <FileText
                                className="h-5 w-5 text-black/60"
                                strokeWidth={2}
                            />
                        </div>
                    </div>
                    <div className="text-[28px] font-bold tracking-[-0.02em] text-black mb-1">
                        {analytics.totalQuotes}
                    </div>
                    <div className="text-[13px] text-black/60">
                        Valeur moyenne:{" "}
                        {formatCurrency(analytics.averageQuoteValue)}
                    </div>
                </Card>

                <Card className="p-6 border-black/8 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[14px] text-black/60">
                            Factures
                        </span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
                            <Receipt
                                className="h-5 w-5 text-black/60"
                                strokeWidth={2}
                            />
                        </div>
                    </div>
                    <div className="text-[28px] font-bold tracking-[-0.02em] text-black mb-1">
                        {analytics.totalInvoices}
                    </div>
                    <div className="text-[13px] text-black/60">
                        Valeur moyenne:{" "}
                        {formatCurrency(analytics.averageInvoiceValue)}
                    </div>
                </Card>
            </div>

            {/* Detailed stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-black/8 shadow-sm">
                    <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-black mb-4">
                        État des factures
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[14px] text-black/60">
                                Payées
                            </span>
                            <span className="text-[14px] font-medium text-black">
                                {analytics.paidInvoices}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[14px] text-black/60">
                                En attente
                            </span>
                            <span className="text-[14px] font-medium text-black">
                                {analytics.unpaidInvoices}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[14px] text-black/60">
                                En retard
                            </span>
                            <span className="text-[14px] font-medium text-black">
                                {analytics.overdueInvoices}
                            </span>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-black/8 shadow-sm">
                    <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-black mb-4">
                        Taux de conversion
                    </h3>
                    <div className="flex items-center justify-center h-24">
                        <div className="text-center">
                            <div className="text-[36px] font-bold tracking-[-0.02em] text-black">
                                {analytics.conversionRate.toFixed(1)}%
                            </div>
                            <div className="text-[13px] text-black/60 mt-1">
                                Devis → Factures
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-black/8 shadow-sm">
                    <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-black mb-4">
                        Factures en retard
                    </h3>
                    {analytics.overdueInvoices > 0 ? (
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
                                <Clock
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <div>
                                <div className="text-[20px] font-bold text-black">
                                    {analytics.overdueInvoices}
                                </div>
                                <div className="text-[13px] text-black/60 mt-1">
                                    facture
                                    {analytics.overdueInvoices > 1 ? "s" : ""}{" "}
                                    nécessite
                                    {analytics.overdueInvoices > 1 ? "nt" : ""}{" "}
                                    un suivi
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-24">
                            <div className="text-center">
                                <div className="text-[16px] font-medium text-black/70">
                                    ✓ Aucune facture en retard
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
