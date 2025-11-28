import type {
    ConsultingStats,
    EntreeTemps,
    EntreeTempsCreateInput,
    EntreeTempsFilters,
    EntreeTempsUpdateInput,
} from "@/lib/types/mission";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { missionKeys } from "./use-missions";

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

// API functions
async function fetchTemps(
    filters?: EntreeTempsFilters
): Promise<EntreeTemps[]> {
    const params = new URLSearchParams();

    if (filters?.missionId) {
        params.append("missionId", filters.missionId);
    }
    if (filters?.userId) {
        params.append("userId", filters.userId);
    }
    if (filters?.dateDebut) {
        params.append("dateDebut", filters.dateDebut);
    }
    if (filters?.dateFin) {
        params.append("dateFin", filters.dateFin);
    }
    if (filters?.facturable !== undefined) {
        params.append("facturable", String(filters.facturable));
    }
    if (filters?.facturee !== undefined) {
        params.append("facturee", String(filters.facturee));
    }

    const response = await fetch(`/api/temps?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch time entries");
    }

    const data = await response.json();
    return data.entrees || [];
}

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

async function createTemps(
    input: EntreeTempsCreateInput
): Promise<EntreeTemps> {
    const response = await fetch("/api/temps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create time entry");
    }

    const data = await response.json();
    return data.entree;
}

async function updateTemps(
    id: string,
    input: EntreeTempsUpdateInput
): Promise<EntreeTemps> {
    const response = await fetch(`/api/temps/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update time entry");
    }

    const data = await response.json();
    return data.entree;
}

async function deleteTemps(id: string): Promise<void> {
    const response = await fetch(`/api/temps/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete time entry");
    }
}

// Timer functions
async function fetchActiveTimer(): Promise<EntreeTemps | null> {
    const response = await fetch("/api/temps/timer");
    if (!response.ok) {
        throw new Error("Failed to fetch timer");
    }

    const data = await response.json();
    return data.timer;
}

async function startTimer(
    missionId: string,
    description?: string
): Promise<EntreeTemps> {
    const response = await fetch("/api/temps/timer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", missionId, description }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to start timer");
    }

    const data = await response.json();
    return data.timer;
}

async function stopTimer(description?: string): Promise<EntreeTemps> {
    const response = await fetch("/api/temps/timer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stop", description }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to stop timer");
    }

    const data = await response.json();
    return data.timer;
}

async function cancelTimer(): Promise<void> {
    const response = await fetch("/api/temps/timer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to cancel timer");
    }
}

// Hooks
export function useTemps(
    filters?: EntreeTempsFilters,
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: tempsKeys.list(filters),
        queryFn: () => fetchTemps(filters),
        enabled: options?.enabled ?? true,
    });
}

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

export function useActiveTimer(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: tempsKeys.timer(),
        queryFn: fetchActiveTimer,
        enabled: options?.enabled ?? true,
        refetchInterval: 60000, // Refresh every minute for running timer
    });
}

export function useCreateTemps() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTemps,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: tempsKeys.all });
            queryClient.invalidateQueries({ queryKey: missionKeys.all });
            if (data.missionId) {
                queryClient.invalidateQueries({
                    queryKey: missionKeys.detail(data.missionId),
                });
            }
        },
    });
}

export function useUpdateTemps() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: EntreeTempsUpdateInput;
        }) => updateTemps(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tempsKeys.all });
            queryClient.invalidateQueries({ queryKey: missionKeys.all });
        },
    });
}

export function useDeleteTemps() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTemps,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tempsKeys.all });
            queryClient.invalidateQueries({ queryKey: missionKeys.all });
        },
    });
}

export function useStartTimer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            missionId,
            description,
        }: {
            missionId: string;
            description?: string;
        }) => startTimer(missionId, description),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tempsKeys.timer() });
        },
    });
}

export function useStopTimer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (description?: string) => stopTimer(description),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tempsKeys.all });
            queryClient.invalidateQueries({ queryKey: tempsKeys.timer() });
            queryClient.invalidateQueries({ queryKey: missionKeys.all });
        },
    });
}

export function useCancelTimer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelTimer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tempsKeys.timer() });
        },
    });
}

// Re-export types for convenience
export type { ConsultingStats, EntreeTemps, EntreeTempsFilters };
