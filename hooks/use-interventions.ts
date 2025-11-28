/**
 * Interventions hooks
 *
 * Optimized version using:
 * - api client for standardized fetch
 * - buildUrl utility for URL construction
 * - useMutationWithInvalidation for mutations
 */

import { api } from "@/lib/api/fetch-client";
import { useMutationWithInvalidation } from "@/lib/hooks/mutation-helpers";
import type {
    Intervention,
    InterventionCreateInput,
    InterventionStats,
    PrioriteIntervention,
    StatutIntervention,
    TypeIntervention,
} from "@/lib/types/intervention";
import { buildUrl } from "@/lib/utils/query-params";
import { useQuery } from "@tanstack/react-query";

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
        [
            ...interventionKeys.all,
            "planning-range",
            startDate,
            endDate,
            plombierId,
        ] as const,
};

// Filter types
export interface InterventionFilters {
    statut?: StatutIntervention | "ALL";
    priorite?: PrioriteIntervention | "ALL";
    type?: TypeIntervention | "ALL";
    search?: string;
}

// Common invalidation keys
const baseInvalidateKeys = [interventionKeys.all];

// ============================================================================
// QUERY HOOKS
// ============================================================================

export function useInterventions(filters?: InterventionFilters) {
    // Filter out "ALL" values before building URL
    const cleanFilters = filters
        ? Object.fromEntries(
              Object.entries(filters).filter(
                  ([, v]) => v !== undefined && v !== "ALL"
              )
          )
        : undefined;

    return useQuery({
        queryKey: interventionKeys.list(filters),
        queryFn: async () => {
            const result = await api.get<{ interventions: Intervention[] }>(
                buildUrl("/api/interventions", cleanFilters)
            );
            return result.interventions || [];
        },
    });
}

export function useIntervention(id: string | null) {
    return useQuery({
        queryKey: interventionKeys.detail(id || ""),
        queryFn: async () => {
            const result = await api.get<{ intervention: Intervention }>(
                `/api/interventions/${id}`
            );
            return result.intervention;
        },
        enabled: !!id,
    });
}

export function useInterventionStats() {
    return useQuery({
        queryKey: interventionKeys.stats(),
        queryFn: () => api.get<InterventionStats>("/api/interventions/stats"),
    });
}

export function usePlanning(date: string, plombierId?: string) {
    const filters =
        plombierId && plombierId !== "ALL" ? { date, plombierId } : { date };

    return useQuery({
        queryKey: interventionKeys.planning(date, plombierId),
        queryFn: async () => {
            const result = await api.get<{ plombiers: PlombierPlanning[] }>(
                buildUrl("/api/planning", filters)
            );
            return result.plombiers || [];
        },
    });
}

export function usePlanningRange(
    startDate: string,
    endDate: string,
    plombierId?: string
) {
    const filters =
        plombierId && plombierId !== "ALL"
            ? { startDate, endDate, plombierId }
            : { startDate, endDate };

    return useQuery({
        queryKey: interventionKeys.planningRange(
            startDate,
            endDate,
            plombierId
        ),
        queryFn: async () => {
            const result = await api.get<{ plombiers: PlombierPlanning[] }>(
                buildUrl("/api/planning", filters)
            );
            return result.plombiers || [];
        },
    });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

export function useCreateIntervention() {
    return useMutationWithInvalidation<
        { intervention: Intervention },
        InterventionCreateInput
    >({
        mutationFn: (data) => api.post("/api/interventions", data),
        invalidateKeys: baseInvalidateKeys,
        messages: {
            success: "Intervention créée",
            successDescription: "L'intervention a été créée avec succès.",
        },
    });
}

export function useUpdateIntervention() {
    return useMutationWithInvalidation<
        { intervention: Intervention },
        {
            id: string;
            data: Partial<InterventionCreateInput> & {
                datePrevisionnelle?: string;
                plombierId?: string | null;
            };
        }
    >({
        mutationFn: ({ id, data }) => api.put(`/api/interventions/${id}`, data),
        invalidateKeys: baseInvalidateKeys,
        messages: {
            success: "Intervention mise à jour",
            successDescription: "Les modifications ont été enregistrées.",
        },
    });
}

export function useDeleteIntervention() {
    return useMutationWithInvalidation<void, string>({
        mutationFn: (id) => api.delete(`/api/interventions/${id}`),
        invalidateKeys: baseInvalidateKeys,
        messages: {
            success: "Intervention supprimée",
            successDescription: "L'intervention a été supprimée.",
        },
    });
}
