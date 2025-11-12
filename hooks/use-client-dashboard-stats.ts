import { clientApiFetch } from "@/lib/api/client-api";
import { DashboardStats } from "@/lib/types/dashboard";
import { useQuery } from "@tanstack/react-query";

interface UseDashboardStatsReturn {
    stats: DashboardStats | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
}

/**
 * Fetches dashboard stats from the API
 */
async function fetchDashboardStats(): Promise<DashboardStats> {
    return clientApiFetch<DashboardStats>("/api/client/dashboard/stats");
}

/**
 * Hook to fetch and manage client dashboard statistics
 * Uses React Query for caching, refetching, and state management
 */
export function useClientDashboardStats(): UseDashboardStatsReturn {
    const {
        data: stats = null,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["client", "dashboard", "stats"],
        queryFn: fetchDashboardStats,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    });

    return {
        stats,
        isLoading,
        error: error as Error | null,
        refetch,
    };
}
