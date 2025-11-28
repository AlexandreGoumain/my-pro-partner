/**
 * Hook for managing "Affaires" (legal cases) - Juridique module
 *
 * Optimized version using:
 * - buildQueryParams utility for URL construction
 * - useMutationWithInvalidation for mutations with toast
 * - api client for standardized fetch
 */

import { api } from "@/lib/api/fetch-client";
import { useMutationWithInvalidation } from "@/lib/hooks/mutation-helpers";
import type {
    Affaire,
    AffaireCreateInput,
    AffaireFilters,
    AffaireStats,
    AffaireUpdateInput,
    AffaireWithDetails,
} from "@/lib/types/juridique";
import { buildUrl } from "@/lib/utils/query-params";
import { useQuery } from "@tanstack/react-query";

// Query keys
export const affaireKeys = {
    all: ["affaires"] as const,
    list: (filters?: AffaireFilters) =>
        [...affaireKeys.all, "list", filters] as const,
    detail: (id: string) => [...affaireKeys.all, "detail", id] as const,
    stats: () => [...affaireKeys.all, "stats"] as const,
};

/**
 * Hook to fetch affaires with filters
 */
export function useAffaires(
    filters?: AffaireFilters,
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: affaireKeys.list(filters),
        queryFn: async (): Promise<Affaire[]> => {
            const url = buildUrl("/api/affaires", filters);
            const data = await api.get<{ affaires: Affaire[] }>(url);
            return data.affaires || [];
        },
        enabled: options?.enabled ?? true,
    });
}

/**
 * Hook to fetch a single affaire by ID
 */
export function useAffaire(id: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: affaireKeys.detail(id),
        queryFn: async (): Promise<AffaireWithDetails> => {
            const data = await api.get<{ affaire: AffaireWithDetails }>(
                `/api/affaires/${id}`
            );
            return data.affaire;
        },
        enabled: options?.enabled ?? !!id,
    });
}

/**
 * Hook to fetch affaire statistics
 */
export function useAffaireStats(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: affaireKeys.stats(),
        queryFn: () => api.get<AffaireStats>("/api/affaires/stats"),
        enabled: options?.enabled ?? true,
    });
}

/**
 * Hook to create a new affaire
 */
export function useCreateAffaire() {
    return useMutationWithInvalidation<
        { affaire: Affaire },
        AffaireCreateInput
    >({
        mutationFn: (data) => api.post("/api/affaires", data),
        invalidateKeys: [
            affaireKeys.all,
            ["affaires", "list"],
            affaireKeys.stats(),
        ],
        messages: {
            success: "Affaire créée",
            successDescription: "L'affaire a été créée avec succès",
        },
    });
}

/**
 * Hook to update an affaire
 */
export function useUpdateAffaire() {
    return useMutationWithInvalidation<
        { affaire: Affaire },
        { id: string; data: AffaireUpdateInput }
    >({
        mutationFn: ({ id, data }) => api.put(`/api/affaires/${id}`, data),
        invalidateKeys: [
            affaireKeys.all,
            ["affaires", "list"],
            affaireKeys.stats(),
        ],
        messages: {
            success: "Affaire mise à jour",
            successDescription: "L'affaire a été mise à jour avec succès",
        },
    });
}

/**
 * Hook to delete an affaire
 */
export function useDeleteAffaire() {
    return useMutationWithInvalidation<void, string>({
        mutationFn: (id) => api.delete(`/api/affaires/${id}`),
        invalidateKeys: [
            affaireKeys.all,
            ["affaires", "list"],
            affaireKeys.stats(),
        ],
        messages: {
            success: "Affaire supprimée",
            successDescription: "L'affaire a été supprimée avec succès",
        },
    });
}

// Re-export types for convenience
export type { Affaire, AffaireFilters, AffaireStats, AffaireWithDetails };
