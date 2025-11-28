import { api } from "@/lib/api/fetch-client";
import type { Client as PrismaClient } from "@/lib/generated/prisma";
import { createResourceHooks } from "@/lib/hooks/create-resource-hooks";
import { useMutationWithInvalidation } from "@/lib/hooks/mutation-helpers";
import type { ClientCreateInput, ClientUpdateInput } from "@/lib/validation";

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
    return useMutationWithInvalidation<
        { message: string; count: number; total: number; skipped: number },
        Record<string, unknown>[]
    >({
        mutationFn: (clients) => api.post("/api/clients/import", { clients }),
        invalidateKeys: [clientKeys.all, clientKeys.stats],
        messages: {
            success: "Import terminé",
            successDescription: "Les clients ont été importés avec succès.",
        },
    });
}
