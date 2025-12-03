/**
 * Core CRUD operations for Reparations
 */

import { api } from "@/lib/api/fetch-client";
import { useMutationWithInvalidation } from "@/lib/hooks/mutation-helpers";
import { buildUrl } from "@/lib/utils/query-params";
import { useQuery } from "@tanstack/react-query";
import {
    baseInvalidateKeys,
    reparationKeys,
    type Reparation,
    type ReparationCreateData,
    type ReparationFilters,
    type ReparationsListResponse,
    type ReparationUpdateData,
} from "./types";

// ============================================================================
// QUERY HOOKS
// ============================================================================

export function useReparations(params?: ReparationFilters) {
    return useQuery({
        queryKey: reparationKeys.list(params),
        queryFn: () =>
            api.get<ReparationsListResponse>(
                buildUrl("/api/reparations", params)
            ),
    });
}

export function useReparation(id: string | null) {
    return useQuery({
        queryKey: reparationKeys.detail(id || ""),
        queryFn: () => api.get<Reparation>(`/api/reparations/${id}`),
        enabled: !!id,
    });
}

export function useReparationStats() {
    return useQuery({
        queryKey: reparationKeys.stats(),
        queryFn: () =>
            api.get<{
                total: number;
                enCours: number;
                enAttentePieces: number;
                pretes: number;
                urgentes: number;
            }>("/api/reparations/stats"),
    });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

export function useCreateReparation() {
    return useMutationWithInvalidation<Reparation, ReparationCreateData>({
        mutationFn: (data) => api.post("/api/reparations", data),
        invalidateKeys: baseInvalidateKeys,
        messages: {
            success: "Réparation créée",
            successDescription:
                "La fiche de réparation a été créée avec succès.",
        },
    });
}

export function useUpdateReparation() {
    return useMutationWithInvalidation<
        Reparation,
        { id: string; data: ReparationUpdateData }
    >({
        mutationFn: ({ id, data }) => api.put(`/api/reparations/${id}`, data),
        invalidateKeys: baseInvalidateKeys,
        messages: {
            success: "Réparation mise à jour",
            successDescription: "Les modifications ont été enregistrées.",
        },
    });
}

export function useDeleteReparation() {
    return useMutationWithInvalidation<void, string>({
        mutationFn: (id) => api.delete(`/api/reparations/${id}`),
        invalidateKeys: baseInvalidateKeys,
        messages: {
            success: "Réparation supprimée",
            successDescription: "La réparation a été supprimée avec succès.",
        },
    });
}
