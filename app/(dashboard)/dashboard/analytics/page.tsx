"use client";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { TrendingUp, TrendingDown, FileText, Receipt, Euro, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Analytics {
    totalRevenue: number;
    totalQuotes: number;
    totalInvoices: number;
    paidInvoices: number;
    unpaidInvoices: number;
    overdueInvoices: number;
    revenueThisMonth: number;
    revenueLastMonth: number;
    averageQuoteValue: number;
    averageInvoiceValue: number;
    conversionRate: number;
}

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/analytics/sales");
            if (!response.ok) throw new Error("Erreur lors du chargement des statistiques");

            const data = await response.json();
            setAnalytics(data.analytics);
        } catch (error) {
            console.error("Error fetching analytics:", error);
            toast.error("Impossible de charger les statistiques");
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(value);
    };

    const calculateTrend = () => {
        if (!analytics || analytics.revenueLastMonth === 0) return 0;
        return ((analytics.revenueThisMonth - analytics.revenueLastMonth) / analytics.revenueLastMonth) * 100;
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Analytics"
                    description="Suivez vos performances de vente"
                />
                <Card className="p-12 border-black/8 shadow-sm">
                    <div className="flex items-center justify-center">
                        <div className="text-[14px] text-black/40">Chargement...</div>
                    </div>
                </Card>
            </div>
        );
    }

    if (!analytics) {
        return null;
    }

    const trend = calculateTrend();
    const isTrendPositive = trend >= 0;

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
                        <span className="text-[14px] text-black/60">Chiffre d'affaires total</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                            <Euro className="h-5 w-5 text-green-600" strokeWidth={2} />
                        </div>
                    </div>
                    <div className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {formatCurrency(analytics.totalRevenue)}
                    </div>
                </Card>

                <Card className="p-6 border-black/8 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[14px] text-black/60">CA ce mois</span>
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isTrendPositive ? "bg-green-500/10" : "bg-red-500/10"}`}>
                            {isTrendPositive ? (
                                <TrendingUp className="h-5 w-5 text-green-600" strokeWidth={2} />
                            ) : (
                                <TrendingDown className="h-5 w-5 text-red-600" strokeWidth={2} />
                            )}
                        </div>
                    </div>
                    <div className="text-[28px] font-bold tracking-[-0.02em] text-black mb-1">
                        {formatCurrency(analytics.revenueThisMonth)}
                    </div>
                    <div className={`text-[13px] font-medium ${isTrendPositive ? "text-green-600" : "text-red-600"}`}>
                        {isTrendPositive ? "+" : ""}{trend.toFixed(1)}% vs mois dernier
                    </div>
                </Card>

                <Card className="p-6 border-black/8 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[14px] text-black/60">Devis</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                            <FileText className="h-5 w-5 text-purple-600" strokeWidth={2} />
                        </div>
                    </div>
                    <div className="text-[28px] font-bold tracking-[-0.02em] text-black mb-1">
                        {analytics.totalQuotes}
                    </div>
                    <div className="text-[13px] text-black/60">
                        Valeur moyenne: {formatCurrency(analytics.averageQuoteValue)}
                    </div>
                </Card>

                <Card className="p-6 border-black/8 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[14px] text-black/60">Factures</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                            <Receipt className="h-5 w-5 text-blue-600" strokeWidth={2} />
                        </div>
                    </div>
                    <div className="text-[28px] font-bold tracking-[-0.02em] text-black mb-1">
                        {analytics.totalInvoices}
                    </div>
                    <div className="text-[13px] text-black/60">
                        Valeur moyenne: {formatCurrency(analytics.averageInvoiceValue)}
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
                            <span className="text-[14px] text-black/60">Payées</span>
                            <span className="text-[14px] font-medium text-green-600">
                                {analytics.paidInvoices}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[14px] text-black/60">En attente</span>
                            <span className="text-[14px] font-medium text-orange-600">
                                {analytics.unpaidInvoices}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[14px] text-black/60">En retard</span>
                            <span className="text-[14px] font-medium text-red-600">
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
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                                <Clock className="h-5 w-5 text-red-600" strokeWidth={2} />
                            </div>
                            <div>
                                <div className="text-[20px] font-bold text-red-600">
                                    {analytics.overdueInvoices}
                                </div>
                                <div className="text-[13px] text-black/60 mt-1">
                                    facture{analytics.overdueInvoices > 1 ? "s" : ""} nécessite{analytics.overdueInvoices > 1 ? "nt" : ""} un suivi
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-24">
                            <div className="text-center">
                                <div className="text-[16px] font-medium text-green-600">
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
