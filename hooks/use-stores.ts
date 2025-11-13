import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import type { StoreWithRelations, StoresStats } from "@/lib/types/store";

// Re-export type for consistency
export type Store = StoreWithRelations;

// Query Keys
export const storeKeys = {
    all: ["stores"] as const,
    detail: (id: string) => ["stores", id] as const,
    stats: ["stores", "stats"] as const,
};

// Hook to fetch all stores
export function useStores() {
    return useQuery({
        queryKey: storeKeys.all,
        queryFn: async (): Promise<Store[]> => {
            const result = await api.get<{ stores: Store[] }>("/api/stores");
            return result.stores || [];
        },
    });
}

// Hook to fetch a single store by ID
export function useStore(id: string) {
    return useQuery({
        queryKey: storeKeys.detail(id),
        queryFn: async () => api.get<Store>(`/api/stores/${id}`),
        enabled: !!id,
    });
}

// Hook to fetch stores statistics
export function useStoresStats() {
    return useQuery({
        queryKey: storeKeys.stats,
        queryFn: async () => api.get<StoresStats>("/api/stores/stats"),
    });
}

// Hook to create a store
export function useCreateStore() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<Store>) =>
            api.post<Store>("/api/stores", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: storeKeys.all });
            queryClient.invalidateQueries({ queryKey: storeKeys.stats });
        },
    });
}

// Hook to update a store
export function useUpdateStore() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<Store>;
        }) => api.put<Store>(`/api/stores/${id}`, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: storeKeys.all });
            queryClient.invalidateQueries({
                queryKey: storeKeys.detail(variables.id),
            });
            queryClient.invalidateQueries({ queryKey: storeKeys.stats });
        },
    });
}

// Hook to delete a store
export function useDeleteStore() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => api.delete(`/api/stores/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: storeKeys.all });
            queryClient.invalidateQueries({ queryKey: storeKeys.stats });
        },
    });
}
