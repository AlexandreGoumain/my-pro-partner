import { api } from "@/lib/api/fetch-client";
import { createResourceHooks } from "@/lib/hooks/create-resource-hooks";
import type {
    DisponibiliteCreateInput,
    DisponibiliteEmploye,
    Employe,
    EmployeCreateInput,
    EmployeUpdateInput,
    EmployesPaginationParams,
} from "@/lib/types/employe.types";
import type { PaginatedResponse } from "@/lib/utils/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Re-export types for convenience
export { JOURS_SEMAINE } from "@/lib/types/employe.types";
export type {
    DisponibiliteCreateInput,
    DisponibiliteEmploye,
    Employe,
    EmployeCreateInput,
    EmployeUpdateInput,
};

// Create base hooks using factory
const employeHooks = createResourceHooks<Employe>({
    resourceName: "employes",
    endpoint: "/api/employes",
});

// Extend query keys with custom pagination keys
export const employeKeys = {
    ...employeHooks.keys,
    list: (params: EmployesPaginationParams) =>
        ["employes", "list", params] as const,
    disponibilites: (id: string) => ["employes", id, "disponibilites"] as const,
};

// Export base hooks from factory
export const useEmployes = employeHooks.useList;
export const useEmploye = employeHooks.useDetail;
export const useCreateEmploye = () =>
    employeHooks.useCreate<EmployeCreateInput>();
export const useUpdateEmploye = () =>
    employeHooks.useUpdate<EmployeUpdateInput>();
export const useDeleteEmploye = employeHooks.useDelete;

// Custom hook: Server-side pagination with filters
export function useEmployesPaginated(params?: EmployesPaginationParams) {
    const { page = 1, limit = 20, search = "", actif } = params || {};

    return useQuery({
        queryKey: employeKeys.list({ page, limit, search, actif }),
        queryFn: async (): Promise<PaginatedResponse<Employe>> => {
            const searchParams = new URLSearchParams();
            searchParams.set("page", page.toString());
            searchParams.set("limit", limit.toString());
            if (search) searchParams.set("search", search);
            if (actif !== undefined)
                searchParams.set("actif", actif.toString());

            return api.get<PaginatedResponse<Employe>>(
                `/api/employes?${searchParams.toString()}`
            );
        },
        enabled: !!params,
    });
}

// Hook to get only active employees (for selectors)
export function useActiveEmployes() {
    return useQuery({
        queryKey: ["employes", "active"],
        queryFn: async (): Promise<Employe[]> => {
            const result = await api.get<PaginatedResponse<Employe>>(
                "/api/employes?actif=true&limit=100"
            );
            return result.data || [];
        },
    });
}

// Hook to get employee's disponibilites
export function useEmployeDisponibilites(employeId: string) {
    return useQuery({
        queryKey: employeKeys.disponibilites(employeId),
        queryFn: async (): Promise<DisponibiliteEmploye[]> => {
            return api.get<DisponibiliteEmploye[]>(
                `/api/employes/${employeId}/disponibilites`
            );
        },
        enabled: !!employeId,
    });
}

// Hook to update employee's disponibilites
export function useUpdateEmployeDisponibilites() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            employeId,
            disponibilites,
        }: {
            employeId: string;
            disponibilites: DisponibiliteCreateInput[];
        }) => {
            return api.put<DisponibiliteEmploye[]>(
                `/api/employes/${employeId}/disponibilites`,
                { disponibilites }
            );
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: employeKeys.disponibilites(variables.employeId),
            });
            queryClient.invalidateQueries({
                queryKey: employeKeys.detail(variables.employeId),
            });
        },
    });
}
