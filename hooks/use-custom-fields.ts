/**
 * Custom fields hooks
 *
 * Optimized version using:
 * - useMutationWithInvalidation for mutations
 */

import { api } from "@/lib/api/fetch-client";
import { useMutationWithInvalidation } from "@/lib/hooks/mutation-helpers";
import {
    ChampPersonnalise,
    ChampPersonnaliseCreateInput,
    ChampPersonnaliseUpdateInput,
} from "@/lib/types/custom-fields";
import { useQuery } from "@tanstack/react-query";

// Query Keys
export const customFieldsKeys = {
    all: ["custom-fields"] as const,
    byCategory: (categorieId: string) =>
        ["custom-fields", categorieId] as const,
};

// ============================================================================
// QUERY HOOKS
// ============================================================================

export function useCategoryCustomFields(
    categorieId: string | null | undefined
) {
    return useQuery<ChampPersonnalise[]>({
        queryKey: categorieId
            ? customFieldsKeys.byCategory(categorieId)
            : customFieldsKeys.all,
        queryFn: async () => {
            if (!categorieId) return [];
            return api.get<ChampPersonnalise[]>(
                `/api/categories/${categorieId}/champs`
            );
        },
        enabled: !!categorieId,
    });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

export function useCreateCustomField(categorieId: string) {
    return useMutationWithInvalidation<
        ChampPersonnalise,
        ChampPersonnaliseCreateInput
    >({
        mutationFn: (data) =>
            api.post(`/api/categories/${categorieId}/champs`, data),
        invalidateKeys: [customFieldsKeys.byCategory(categorieId)],
        messages: {
            success: "Champ créé",
            successDescription: "Le champ personnalisé a été créé.",
        },
    });
}

export function useUpdateCustomField(categorieId: string, champId: string) {
    return useMutationWithInvalidation<
        ChampPersonnalise,
        ChampPersonnaliseUpdateInput
    >({
        mutationFn: (data) =>
            api.put(`/api/categories/${categorieId}/champs/${champId}`, data),
        invalidateKeys: [customFieldsKeys.byCategory(categorieId)],
        messages: {
            success: "Champ modifié",
            successDescription: "Le champ personnalisé a été mis à jour.",
        },
    });
}

export function useDeleteCustomField(categorieId: string) {
    return useMutationWithInvalidation<void, string>({
        mutationFn: (champId) =>
            api.delete(`/api/categories/${categorieId}/champs/${champId}`),
        invalidateKeys: [customFieldsKeys.byCategory(categorieId)],
        messages: {
            success: "Champ supprimé",
            successDescription: "Le champ personnalisé a été supprimé.",
        },
    });
}

export function useReorderCustomFields(categorieId: string) {
    return useMutationWithInvalidation<
        boolean,
        Array<{ id: string; ordre: number }>
    >({
        mutationFn: async (updates) => {
            const promises = updates.map((update) =>
                api.put(`/api/categories/${categorieId}/champs/${update.id}`, {
                    ordre: update.ordre,
                })
            );
            await Promise.all(promises);
            return true;
        },
        invalidateKeys: [customFieldsKeys.byCategory(categorieId)],
        messages: {
            success: "Ordre modifié",
            successDescription: "L'ordre des champs a été mis à jour.",
        },
    });
}
