import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { Analytics } from "@/lib/types/analytics";

// Query Keys
export const analyticsKeys = {
    all: ["analytics"] as const,
    sales: ["analytics", "sales"] as const,
};

/**
 * Hook to fetch sales analytics
 */
export function useAnalytics() {
    return useQuery({
        queryKey: analyticsKeys.sales,
        queryFn: async () => {
            const result = await api.get<{ analytics: Analytics }>(ENDPOINTS.ANALYTICS_SALES);
            return result.analytics;
        },
    });
}
