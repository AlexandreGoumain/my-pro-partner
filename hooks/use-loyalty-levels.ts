import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import type { NiveauFideliteCreateInput, NiveauFideliteUpdateInput } from "@/lib/validation";

// Loyalty level type definition
export interface NiveauFidelite {
    id: string;
    nom: string;
    description?: string | null;
    ordre: number;
    seuilPoints: number;
    remise: number;
    couleur: string;
    icone?: string | null;
    avantages?: string | null;
    actif: boolean;
    entrepriseId: string;
    createdAt: Date;
    updatedAt: Date;
}

// Query Keys
export const loyaltyLevelKeys = {
    all: ["loyaltyLevels"] as const,
    detail: (id: string) => ["loyaltyLevels", id] as const,
};

// Hook pour récupérer tous les niveaux de fidélité
export function useLoyaltyLevels() {
    return useQuery({
        queryKey: loyaltyLevelKeys.all,
        queryFn: async (): Promise<NiveauFidelite[]> => {
            const result = await api.get<NiveauFidelite[] | { data: NiveauFidelite[] }>("/api/loyalty-levels");
            return Array.isArray(result) ? result : result.data || [];
        },
    });
}

// Hook pour récupérer un niveau de fidélité par ID
export function useLoyaltyLevel(id: string) {
    return useQuery({
        queryKey: loyaltyLevelKeys.detail(id),
        queryFn: async () => api.get<NiveauFidelite>(`/api/loyalty-levels/${id}`),
        enabled: !!id,
    });
}

// Hook pour créer un niveau de fidélité
export function useCreateLoyaltyLevel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: NiveauFideliteCreateInput) =>
            api.post<NiveauFidelite>("/api/loyalty-levels", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: loyaltyLevelKeys.all });
        },
    });
}

// Hook pour mettre à jour un niveau de fidélité
export function useUpdateLoyaltyLevel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: NiveauFideliteUpdateInput;
        }) => api.put<NiveauFidelite>(`/api/loyalty-levels/${id}`, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: loyaltyLevelKeys.all });
            queryClient.invalidateQueries({
                queryKey: loyaltyLevelKeys.detail(variables.id),
            });
        },
    });
}

// Hook pour supprimer un niveau de fidélité
export function useDeleteLoyaltyLevel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => api.delete(`/api/loyalty-levels/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: loyaltyLevelKeys.all });
        },
    });
}
