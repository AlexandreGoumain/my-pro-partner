import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import {
    ChampPersonnalise,
    ChampPersonnaliseCreateInput,
    ChampPersonnaliseUpdateInput,
} from "@/lib/types/custom-fields";

// Query Keys - Standardized pattern
export const customFieldsKeys = {
    all: ["custom-fields"] as const,
    byCategory: (categorieId: string) => ["custom-fields", categorieId] as const,
};

// Hook pour récupérer les champs personnalisés d'une catégorie
export function useCategoryCustomFields(categorieId: string | null | undefined) {
    return useQuery<ChampPersonnalise[]>({
        queryKey: categorieId ? customFieldsKeys.byCategory(categorieId) : customFieldsKeys.all,
        queryFn: async () => {
            if (!categorieId) return [];
            return api.get<ChampPersonnalise[]>(`/api/categories/${categorieId}/champs`);
        },
        enabled: !!categorieId,
    });
}

// Hook pour créer un champ personnalisé
export function useCreateCustomField(categorieId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ChampPersonnaliseCreateInput) =>
            api.post<ChampPersonnalise>(`/api/categories/${categorieId}/champs`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: customFieldsKeys.byCategory(categorieId),
            });
        },
    });
}

// Hook pour modifier un champ personnalisé
export function useUpdateCustomField(categorieId: string, champId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ChampPersonnaliseUpdateInput) =>
            api.put<ChampPersonnalise>(`/api/categories/${categorieId}/champs/${champId}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: customFieldsKeys.byCategory(categorieId),
            });
        },
    });
}

// Hook pour supprimer un champ personnalisé
export function useDeleteCustomField(categorieId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (champId: string) =>
            api.delete(`/api/categories/${categorieId}/champs/${champId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: customFieldsKeys.byCategory(categorieId),
            });
        },
    });
}

// Hook pour réorganiser les champs (batch update)
export function useReorderCustomFields(categorieId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            updates: Array<{ id: string; ordre: number }>
        ) => {
            const promises = updates.map((update) =>
                api.put(`/api/categories/${categorieId}/champs/${update.id}`, { ordre: update.ordre })
            );

            await Promise.all(promises);
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: customFieldsKeys.byCategory(categorieId),
            });
        },
    });
}
