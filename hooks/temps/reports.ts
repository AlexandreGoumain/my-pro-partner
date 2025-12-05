import type { ConsultingStats } from "@/lib/types/mission";
import { useQuery } from "@tanstack/react-query";
import { tempsKeys, type TempsReportData } from "./types";

// API functions
async function fetchTempsStats(period: number = 30): Promise<ConsultingStats> {
    const response = await fetch(`/api/temps/stats?period=${period}`);
    if (!response.ok) {
        throw new Error("Failed to fetch time stats");
    }

    const data = await response.json();
    return data.stats;
}

async function fetchTempsReports(
    period: number = 30,
    groupBy: string = "day"
): Promise<TempsReportData> {
    const response = await fetch(
        `/api/temps/reports?period=${period}&groupBy=${groupBy}`
    );
    if (!response.ok) {
        throw new Error("Failed to fetch time reports");
    }

    return response.json();
}

// Hooks
export function useTempsStats(
    period: number = 30,
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: tempsKeys.stats(period),
        queryFn: () => fetchTempsStats(period),
        enabled: options?.enabled ?? true,
    });
}

export function useTempsReports(
    period: number = 30,
    groupBy: string = "day",
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: tempsKeys.reports(period, groupBy),
        queryFn: () => fetchTempsReports(period, groupBy),
        enabled: options?.enabled ?? true,
    });
}
