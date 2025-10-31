import { api } from "@/lib/api/fetch-client";
import type { Categorie } from "@/lib/types/category";
import type {
    CategorieCreateInput,
    CategorieUpdateInput,
} from "@/lib/validation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Re-export type for convenience
export type { Categorie } from "@/lib/types/category";

// Query Keys
export const categorieKeys = {
    all: ["categories"] as const,
    detail: (id: string) => ["categories", id] as const,
};

// Hook pour récupérer toutes les catégories
export function useCategories() {
    return useQuery({
        queryKey: categorieKeys.all,
        queryFn: async (): Promise<Categorie[]> => api.get<Categorie[]>("/api/categories"),
    });
}

// Hook pour récupérer une catégorie par ID
export function useCategorie(id: string) {
    return useQuery({
        queryKey: categorieKeys.detail(id),
        queryFn: async (): Promise<Categorie> => api.get<Categorie>(`/api/categories/${id}`),
        enabled: !!id,
    });
}

// Hook pour créer une catégorie
export function useCreateCategorie() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CategorieCreateInput) =>
            api.post<Categorie>("/api/categories", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categorieKeys.all });
        },
    });
}

// Hook pour mettre à jour une catégorie
export function useUpdateCategorie() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: CategorieUpdateInput;
        }) => api.put<Categorie>(`/api/categories/${id}`, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: categorieKeys.all });
            queryClient.invalidateQueries({
                queryKey: categorieKeys.detail(variables.id),
            });
        },
    });
}

// Hook pour supprimer une catégorie
export function useDeleteCategorie() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => api.delete(`/api/categories/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categorieKeys.all });
        },
    });
}
