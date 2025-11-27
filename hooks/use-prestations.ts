import { api } from "@/lib/api/fetch-client";
import { createResourceHooks } from "@/lib/hooks/create-resource-hooks";
import type {
    Prestation,
    PrestationCreateInput,
    PrestationUpdateInput,
    PrestationsPaginationParams,
} from "@/lib/types/prestation.types";
import type { PaginatedResponse } from "@/lib/utils/pagination";
import { useQuery } from "@tanstack/react-query";

// Re-export types for convenience
export { PRESTATION_CATEGORIES } from "@/lib/types/prestation.types";
export type { PrestationCategorie } from "@/lib/types/prestation.types";
export type { Prestation, PrestationCreateInput, PrestationUpdateInput };

// Create base hooks using factory
const prestationHooks = createResourceHooks<Prestation>({
    resourceName: "prestations",
    endpoint: "/api/prestations",
});

// Extend query keys with custom pagination keys
export const prestationKeys = {
    ...prestationHooks.keys,
    list: (params: PrestationsPaginationParams) =>
        ["prestations", "list", params] as const,
};

// Export base hooks from factory
export const usePrestations = prestationHooks.useList;
export const usePrestation = prestationHooks.useDetail;
export const useCreatePrestation = () =>
    prestationHooks.useCreate<PrestationCreateInput>();
export const useUpdatePrestation = () =>
    prestationHooks.useUpdate<PrestationUpdateInput>();
export const useDeletePrestation = prestationHooks.useDelete;

// Custom hook: Server-side pagination with filters
export function usePrestationsPaginated(params?: PrestationsPaginationParams) {
    const {
        page = 1,
        limit = 20,
        search = "",
        categorie,
        actif,
    } = params || {};

    return useQuery({
        queryKey: prestationKeys.list({
            page,
            limit,
            search,
            categorie,
            actif,
        }),
        queryFn: async (): Promise<PaginatedResponse<Prestation>> => {
            const searchParams = new URLSearchParams();
            searchParams.set("page", page.toString());
            searchParams.set("limit", limit.toString());
            if (search) searchParams.set("search", search);
            if (categorie) searchParams.set("categorie", categorie);
            if (actif !== undefined)
                searchParams.set("actif", actif.toString());

            return api.get<PaginatedResponse<Prestation>>(
                `/api/prestations?${searchParams.toString()}`
            );
        },
        enabled: !!params,
    });
}

// Hook to get only active prestations (for selectors)
export function useActivePrestations() {
    return useQuery({
        queryKey: ["prestations", "active"],
        queryFn: async (): Promise<Prestation[]> => {
            const result = await api.get<PaginatedResponse<Prestation>>(
                "/api/prestations?actif=true&limit=100"
            );
            return result.data || [];
        },
    });
}
