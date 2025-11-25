import type {
    Intervention,
    InterventionCreateInput,
    InterventionStats,
    PrioriteIntervention,
    StatutIntervention,
    TypeIntervention,
} from "@/lib/types/intervention";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Planning types
export interface PlombierPlanning {
    id: string;
    name: string;
    interventionsCount: number;
    interventions: Intervention[];
}

// Calendar view types
export type CalendarView = "day" | "week" | "month";

// Query keys
export const interventionKeys = {
    all: ["interventions"] as const,
    list: (filters?: InterventionFilters) =>
        [...interventionKeys.all, "list", filters] as const,
    detail: (id: string) => [...interventionKeys.all, "detail", id] as const,
    stats: () => [...interventionKeys.all, "stats"] as const,
    planning: (date: string, plombierId?: string) =>
        [...interventionKeys.all, "planning", date, plombierId] as const,
    planningRange: (startDate: string, endDate: string, plombierId?: string) =>
        [...interventionKeys.all, "planning-range", startDate, endDate, plombierId] as const,
};

// Filter types
export interface InterventionFilters {
    statut?: StatutIntervention | "ALL";
    priorite?: PrioriteIntervention | "ALL";
    type?: TypeIntervention | "ALL";
    search?: string;
}

// API functions
async function fetchInterventions(
    filters?: InterventionFilters
): Promise<Intervention[]> {
    const params = new URLSearchParams();

    if (filters?.statut && filters.statut !== "ALL") {
        params.append("statut", filters.statut);
    }
    if (filters?.priorite && filters.priorite !== "ALL") {
        params.append("priorite", filters.priorite);
    }
    if (filters?.type && filters.type !== "ALL") {
        params.append("type", filters.type);
    }
    if (filters?.search) {
        params.append("search", filters.search);
    }

    const response = await fetch(`/api/interventions?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch interventions");
    }

    const data = await response.json();
    return data.interventions || [];
}

async function fetchInterventionStats(): Promise<InterventionStats> {
    const response = await fetch("/api/interventions/stats");
    if (!response.ok) {
        throw new Error("Failed to fetch intervention stats");
    }
    return response.json();
}

async function createIntervention(
    input: InterventionCreateInput
): Promise<Intervention> {
    const response = await fetch("/api/interventions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create intervention");
    }

    const data = await response.json();
    return data.intervention;
}

// Hooks
export function useInterventions(filters?: InterventionFilters) {
    return useQuery({
        queryKey: interventionKeys.list(filters),
        queryFn: () => fetchInterventions(filters),
    });
}

export function useInterventionStats() {
    return useQuery({
        queryKey: interventionKeys.stats(),
        queryFn: fetchInterventionStats,
    });
}

export function useCreateIntervention() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createIntervention,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: interventionKeys.all,
            });
        },
    });
}

// Planning API
async function fetchPlanning(
    date: string,
    plombierId?: string
): Promise<PlombierPlanning[]> {
    const params = new URLSearchParams({ date });
    if (plombierId && plombierId !== "ALL") {
        params.append("plombierId", plombierId);
    }

    const response = await fetch(`/api/planning?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch planning");
    }
    const data = await response.json();
    return data.plombiers || [];
}

async function fetchPlanningRange(
    startDate: string,
    endDate: string,
    plombierId?: string
): Promise<PlombierPlanning[]> {
    const params = new URLSearchParams({ startDate, endDate });
    if (plombierId && plombierId !== "ALL") {
        params.append("plombierId", plombierId);
    }

    const response = await fetch(`/api/planning?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch planning");
    }
    const data = await response.json();
    return data.plombiers || [];
}

async function updateIntervention(
    id: string,
    input: Partial<InterventionCreateInput> & { datePrevisionnelle?: string; plombierId?: string | null }
): Promise<Intervention> {
    const response = await fetch(`/api/interventions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update intervention");
    }

    const data = await response.json();
    return data.intervention;
}

export function usePlanning(date: string, plombierId?: string) {
    return useQuery({
        queryKey: interventionKeys.planning(date, plombierId),
        queryFn: () => fetchPlanning(date, plombierId),
    });
}

export function usePlanningRange(startDate: string, endDate: string, plombierId?: string) {
    return useQuery({
        queryKey: interventionKeys.planningRange(startDate, endDate, plombierId),
        queryFn: () => fetchPlanningRange(startDate, endDate, plombierId),
    });
}

export function useUpdateIntervention() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<InterventionCreateInput> & { datePrevisionnelle?: string; plombierId?: string | null } }) =>
            updateIntervention(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: interventionKeys.all,
            });
        },
    });
}
