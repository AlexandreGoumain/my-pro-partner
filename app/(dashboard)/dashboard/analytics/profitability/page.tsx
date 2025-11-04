"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingCard } from "@/components/ui/loading-card";
import { AnalyticsKPICard } from "@/components/analytics/analytics-kpi-card";
import { RevenueBreakdown } from "@/components/analytics/revenue-breakdown";
import { TopArticlesList } from "@/components/analytics/top-articles-list";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
    Euro,
    FileText,
    TrendingUp,
    TrendingDown,
    Package,
} from "lucide-react";

interface ProfitabilityResponse {
    byType: {
        PRODUIT: {
            revenue: number;
            count: number;
            quantity: number;
            percentage: number;
        };
        SERVICE: {
            revenue: number;
            count: number;
            quantity: number;
            percentage: number;
        };
        UNKNOWN: {
            revenue: number;
            count: number;
            quantity: number;
            percentage: number;
        };
    };
    byCategory: Array<{
        categorieId: string;
        nom: string;
        revenue: number;
        count: number;
        percentage: number;
        topArticles: Array<{
            nom: string;
            reference: string;
            revenue: number;
            quantity: number;
        }>;
    }>;
    summary: {
        totalRevenue: number;
        totalInvoices: number;
        period: string;
        dateFrom?: string;
        dateTo: string;
    };
    trends: {
        currentPeriod: number;
        previousPeriod: number;
        growth: number;
    };
}

export default function ProfitabilityPage() {
    const [period, setPeriod] = useState("all");

    const { data, isLoading, error } = useQuery<ProfitabilityResponse>({
        queryKey: ["profitability", period],
        queryFn: async () => {
            const params = new URLSearchParams({ period });

            const response = await fetch(
                `/api/analytics/profitability?${params}`
            );

            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des données");
            }

            return response.json();
        },
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(value);
    };

    const getPeriodLabel = () => {
        switch (period) {
            case "month":
                return "ce mois-ci";
            case "quarter":
                return "ce trimestre";
            case "year":
                return "cette année";
            default:
                return "toute la période";
        }
    };

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
                <div className="p-6 border border-black/8 rounded-lg bg-black/2">
                    <p className="text-[14px] text-black/60">
                        Une erreur est survenue lors du chargement des données.
                    </p>
                </div>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    const isTrendPositive = data.trends.growth >= 0;

    // Prepare data for revenue breakdowns
    const typeItems = [
        {
            label: "Produits",
            revenue: data.byType.PRODUIT.revenue,
            count: data.byType.PRODUIT.count,
            percentage: data.byType.PRODUIT.percentage,
            color: "#000000",
        },
        {
            label: "Services",
            revenue: data.byType.SERVICE.revenue,
            count: data.byType.SERVICE.count,
            percentage: data.byType.SERVICE.percentage,
            color: "#666666",
        },
    ];

    if (data.byType.UNKNOWN.revenue > 0) {
        typeItems.push({
            label: "Non catégorisé",
            revenue: data.byType.UNKNOWN.revenue,
            count: data.byType.UNKNOWN.count,
            percentage: data.byType.UNKNOWN.percentage,
            color: "#CCCCCC",
        });
    }

    const categoryItems = data.byCategory.map((cat, index) => ({
        label: cat.nom,
        revenue: cat.revenue,
        count: cat.count,
        percentage: cat.percentage,
        color: `hsl(0, 0%, ${20 + index * 10}%)`,
    }));

    return (
        <div className="space-y-6">
            <PageHeader
                title="Analyse de rentabilité"
                description="Analyse détaillée des revenus par type et catégorie"
            />

            {/* Filter */}
            <div className="flex items-center justify-between p-4 border border-black/8 rounded-lg bg-white">
                <div className="flex items-center gap-2">
                    <span className="text-[14px] text-black/60 font-medium">
                        Période:
                    </span>
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[180px] h-9 border-black/10">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="month">Ce mois</SelectItem>
                            <SelectItem value="quarter">
                                Ce trimestre
                            </SelectItem>
                            <SelectItem value="year">Cette année</SelectItem>
                            <SelectItem value="all">Toute la période</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <AnalyticsKPICard
                    title={`CA ${getPeriodLabel()}`}
                    value={formatCurrency(data.summary.totalRevenue)}
                    subtitle={`${data.summary.totalInvoices} facture${data.summary.totalInvoices > 1 ? "s" : ""} payée${data.summary.totalInvoices > 1 ? "s" : ""}`}
                    icon={Euro}
                />
                <AnalyticsKPICard
                    title="Tendance"
                    value={`${isTrendPositive ? "+" : ""}${data.trends.growth.toFixed(1)}%`}
                    subtitle={`vs période précédente`}
                    icon={isTrendPositive ? TrendingUp : TrendingDown}
                />
                <AnalyticsKPICard
                    title="CA Produits"
                    value={formatCurrency(data.byType.PRODUIT.revenue)}
                    subtitle={`${data.byType.PRODUIT.percentage.toFixed(1)}% du total`}
                    icon={Package}
                />
                <AnalyticsKPICard
                    title="CA Services"
                    value={formatCurrency(data.byType.SERVICE.revenue)}
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
                <Card className="p-12 border-black/8">
                    <div className="text-center">
                        <div className="text-[16px] font-medium text-black/70 mb-2">
                            Aucune donnée de vente
                        </div>
                        <p className="text-[14px] text-black/40">
                            Aucune facture payée pour la période sélectionnée
                        </p>
                    </div>
                </Card>
            )}
        </div>
    );
}
