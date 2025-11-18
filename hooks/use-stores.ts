import { api } from "@/lib/api/fetch-client";
import type { StoreWithRelations, StoresStats } from "@/lib/types/store";
import { createResourceHooks } from "@/lib/hooks/create-resource-hooks";
import { useQuery } from "@tanstack/react-query";

// Re-export type for consistency
export type Store = StoreWithRelations;

// Create base hooks using factory
const storeHooks = createResourceHooks<Store>({
    resourceName: "stores",
    endpoint: "/api/stores",
});

// Export query keys
export const storeKeys = {
    ...storeHooks.keys,
};

// Custom hook for useStores (API returns {stores: Store[]})
export function useStores() {
    return useQuery({
        queryKey: storeKeys.all,
        queryFn: async (): Promise<Store[]> => {
            const result = await api.get<{ stores: Store[] }>("/api/stores");
            return result.stores || [];
        },
    });
}

// Export base hooks from factory
export const useStore = storeHooks.useDetail;
export const useStoresStats = () => storeHooks.useStats<StoresStats>();
export const useCreateStore = () => storeHooks.useCreate<Partial<Store>>();
export const useUpdateStore = () => storeHooks.useUpdate<Partial<Store>>();
export const useDeleteStore = storeHooks.useDelete;
