import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils/payment-utils";
import type {
    ProfitabilityResponse,
    RevenueBreakdownItem,
    AnalyticsPeriod,
} from "@/lib/types/analytics";

interface UseProfitabilityAnalyticsReturn {
    period: string;
    setPeriod: (period: string) => void;
    data: ProfitabilityResponse | undefined;
    isLoading: boolean;
    error: Error | null;
    formatAmount: (value: number) => string;
    getPeriodLabel: () => string;
    isTrendPositive: boolean;
    typeItems: RevenueBreakdownItem[];
    categoryItems: RevenueBreakdownItem[];
}

/**
 * Custom hook for managing profitability analytics page
 * Handles data fetching, period selection, and data formatting
 *
 * @returns Profitability data and handlers
 */
export function useProfitabilityAnalytics(): UseProfitabilityAnalyticsReturn {
    const [period, setPeriod] = useState<AnalyticsPeriod>("all");

    const { data, isLoading, error } = useQuery<ProfitabilityResponse>({
        queryKey: ["profitability", period],
        queryFn: async () => {
            const params = new URLSearchParams({ period });
            const response = await fetch(`/api/analytics/profitability?${params}`);

            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des données");
            }

            return response.json();
        },
    });

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

    const isTrendPositive = useMemo(() => {
        return (data?.trends.growth ?? 0) >= 0;
    }, [data?.trends.growth]);

    const typeItems = useMemo<RevenueBreakdownItem[]>(() => {
        if (!data) return [];

        const items: RevenueBreakdownItem[] = [
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
            items.push({
                label: "Non catégorisé",
                revenue: data.byType.UNKNOWN.revenue,
                count: data.byType.UNKNOWN.count,
                percentage: data.byType.UNKNOWN.percentage,
                color: "#CCCCCC",
            });
        }

        return items;
    }, [data]);

    const categoryItems = useMemo<RevenueBreakdownItem[]>(() => {
        if (!data) return [];

        return data.byCategory.map((cat, index) => ({
            label: cat.nom,
            revenue: cat.revenue,
            count: cat.count,
            percentage: cat.percentage,
            color: `hsl(0, 0%, ${20 + index * 10}%)`,
        }));
    }, [data]);

    return {
        period,
        setPeriod,
        data,
        isLoading,
        error: error as Error | null,
        formatAmount: formatCurrency,
        getPeriodLabel,
        isTrendPositive,
        typeItems,
        categoryItems,
    };
}
