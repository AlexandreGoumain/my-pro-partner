import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { SerieDocument } from "@/lib/types/settings";

// Query Keys
export const seriesKeys = {
    all: ["series"] as const,
};

// Hook pour récupérer toutes les séries
export function useSeries() {
    return useQuery({
        queryKey: seriesKeys.all,
        queryFn: async () => {
            const result = await api.get<{ series: SerieDocument[] }>("/api/settings/series");
            return result.series || [];
        },
    });
}

// Hook pour créer une série
export function useCreateSerie() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<SerieDocument>) =>
            api.post<SerieDocument>("/api/settings/series", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: seriesKeys.all });
        },
    });
}

// Hook pour mettre à jour une série
export function useUpdateSerie() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<SerieDocument> }) =>
            api.put<SerieDocument>(`/api/settings/series/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: seriesKeys.all });
        },
    });
}

// Hook pour supprimer une série
export function useDeleteSerie() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) =>
            api.delete(`/api/settings/series/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: seriesKeys.all });
        },
    });
}

// Hook pour activer/désactiver une série
export function useToggleSerie() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, active }: { id: string; active: boolean }) =>
            api.put<SerieDocument>(`/api/settings/series/${id}`, { active }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: seriesKeys.all });
        },
    });
}
