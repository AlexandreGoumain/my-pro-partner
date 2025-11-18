import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import type { ClientCreateInput, ClientUpdateInput } from "@/lib/validation";
import type { Client as PrismaClient } from "@/lib/generated/prisma";
import { createResourceHooks } from "@/lib/hooks/create-resource-hooks";

// Re-export Prisma Client type for consistency
export type Client = PrismaClient;

// Monthly data for evolution chart
export interface MonthlyData {
    month: string;
    count: number;
}

// City data for geographic distribution
export interface CityData {
    city: string;
    count: number;
}

// Data quality metrics
export interface DataQuality {
    withEmail: number;
    withPhone: number;
    withBoth: number;
    withLocation: number;
}

// Client statistics type definition
export interface ClientsStats {
    total: number;
    inactive: number;
    active: number;
    complete: number;
    completionRate: number;
    currentMonth: number;
    lastMonth: number;
    growth: number;
    monthlyEvolution: MonthlyData[];
    topCities: CityData[];
    dataQuality: DataQuality;
}

// Create base hooks using factory
const clientHooks = createResourceHooks<Client>({
    resourceName: "clients",
    endpoint: "/api/clients",
});

// Export query keys
export const clientKeys = clientHooks.keys;

// Export base hooks from factory
export const useClients = clientHooks.useList;
export const useClientsPaginated = clientHooks.useListPaginated;
export const useClient = clientHooks.useDetail;
export const useClientsStats = () => clientHooks.useStats<ClientsStats>();
export const useCreateClient = () => clientHooks.useCreate<ClientCreateInput>();
export const useUpdateClient = () => clientHooks.useUpdate<ClientUpdateInput>();
export const useDeleteClient = clientHooks.useDelete;

// Hook pour importer des clients en masse
export function useImportClients() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (clients: Record<string, unknown>[]) =>
            api.post<{ message: string; count: number; total: number; skipped: number }>("/api/clients/import", {
                clients,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: clientKeys.all });
            queryClient.invalidateQueries({ queryKey: ["clients", "list"] });
            queryClient.invalidateQueries({ queryKey: clientKeys.stats });
        },
    });
}
