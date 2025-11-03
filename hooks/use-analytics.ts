import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";

export interface Analytics {
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

// Query Keys
export const analyticsKeys = {
    all: ["analytics"] as const,
    sales: ["analytics", "sales"] as const,
};

// Hook pour récupérer les analytics de vente
export function useAnalytics() {
    return useQuery({
        queryKey: analyticsKeys.sales,
        queryFn: async () => {
            const result = await api.get<{ analytics: Analytics }>("/api/analytics/sales");
            return result.analytics;
        },
    });
}
