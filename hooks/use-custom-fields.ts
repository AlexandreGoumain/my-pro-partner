import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ChampPersonnalise,
    ChampPersonnaliseCreateInput,
    ChampPersonnaliseUpdateInput,
} from "@/lib/types/custom-fields";

// Hook pour récupérer les champs personnalisés d'une catégorie
export function useCategoryCustomFields(categorieId: string | null | undefined) {
    return useQuery<ChampPersonnalise[]>({
        queryKey: ["custom-fields", categorieId],
        queryFn: async () => {
            if (!categorieId) return [];
            const response = await fetch(
                `/api/categories/${categorieId}/champs`
            );
            if (!response.ok) {
                throw new Error("Erreur lors du chargement des champs");
            }
            return response.json();
        },
        enabled: !!categorieId,
    });
}

// Hook pour créer un champ personnalisé
export function useCreateCustomField(categorieId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ChampPersonnaliseCreateInput) => {
            const response = await fetch(
                `/api/categories/${categorieId}/champs`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Erreur lors de la création");
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["custom-fields", categorieId],
            });
        },
    });
}

// Hook pour modifier un champ personnalisé
export function useUpdateCustomField(categorieId: string, champId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ChampPersonnaliseUpdateInput) => {
            const response = await fetch(
                `/api/categories/${categorieId}/champs/${champId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(
                    error.message || "Erreur lors de la modification"
                );
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["custom-fields", categorieId],
            });
        },
    });
}

// Hook pour supprimer un champ personnalisé
export function useDeleteCustomField(categorieId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (champId: string) => {
            const response = await fetch(
                `/api/categories/${categorieId}/champs/${champId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(
                    error.message || "Erreur lors de la suppression"
                );
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["custom-fields", categorieId],
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
                fetch(
                    `/api/categories/${categorieId}/champs/${update.id}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ordre: update.ordre }),
                    }
                )
            );

            const responses = await Promise.all(promises);
            const failed = responses.filter((r) => !r.ok);

            if (failed.length > 0) {
                throw new Error("Erreur lors de la réorganisation");
            }

            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["custom-fields", categorieId],
            });
        },
    });
}
