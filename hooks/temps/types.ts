import type {
    ConsultingStats,
    EntreeTemps,
    EntreeTempsFilters,
} from "@/lib/types/mission";

// Query keys
export const tempsKeys = {
    all: ["temps"] as const,
    list: (filters?: EntreeTempsFilters) =>
        [...tempsKeys.all, "list", filters] as const,
    detail: (id: string) => [...tempsKeys.all, "detail", id] as const,
    stats: (period?: number) => [...tempsKeys.all, "stats", period] as const,
    timer: () => [...tempsKeys.all, "timer"] as const,
    reports: (period?: number, groupBy?: string) =>
        [...tempsKeys.all, "reports", period, groupBy] as const,
};

// Types for reports
export interface TempsReportData {
    period: {
        start: string;
        end: string;
        days: number;
    };
    totals: {
        tracked: number;
        billable: number;
        amount: number;
        entries: number;
    };
    averages: {
        dailyTracked: number;
        dailyBillable: number;
    };
    timeSeries: Array<{
        date: string;
        tracked: number;
        billable: number;
        amount: number;
    }>;
    byMission: Array<{
        id: string;
        nom: string;
        numero: string;
        tracked: number;
        billable: number;
        amount: number;
    }>;
    byClient: Array<{
        id: string;
        nom: string;
        tracked: number;
        billable: number;
        amount: number;
        missions: number;
    }>;
    byCollaborator: Array<{
        id: string;
        name: string;
        tracked: number;
        billable: number;
        amount: number;
    }>;
}

// Re-export types for convenience
export type { ConsultingStats, EntreeTemps, EntreeTempsFilters };
