import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { SerieDocument } from "@/lib/types/settings";
import { createResourceHooks } from "@/lib/hooks/create-resource-hooks";

// Create base hooks using factory
const serieHooks = createResourceHooks<SerieDocument>({
    resourceName: "series",
    endpoint: "/api/settings/series",
});

// Export query keys
export const seriesKeys = serieHooks.keys;

// Custom hook for useSeries (API returns {series: SerieDocument[]})
export function useSeries() {
    return useQuery({
        queryKey: seriesKeys.all,
        queryFn: async () => {
            const result = await api.get<{ series: SerieDocument[] }>("/api/settings/series");
            return result.series || [];
        },
    });
}

// Export base hooks from factory
export const useCreateSerie = () => serieHooks.useCreate<Partial<SerieDocument>>();
export const useUpdateSerie = () => serieHooks.useUpdate<Partial<SerieDocument>>();
export const useDeleteSerie = serieHooks.useDelete;

// Hook personnalisé pour activer/désactiver une série
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
