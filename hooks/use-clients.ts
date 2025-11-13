import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import type { ClientCreateInput, ClientUpdateInput } from "@/lib/validation";
import type { PaginatedResponse } from "@/lib/utils/pagination";
import type { Client as PrismaClient } from "@/lib/generated/prisma";

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

// Pagination params
export interface ClientsPaginationParams {
    page?: number;
    limit?: number;
    search?: string;
}

// Query Keys
export const clientKeys = {
    all: ["clients"] as const,
    list: (params: ClientsPaginationParams) => ["clients", "list", params] as const,
    detail: (id: string) => ["clients", id] as const,
    stats: ["clients", "stats"] as const,
};

// Hook pour récupérer tous les clients (avec pagination par défaut)
export function useClients(limit?: number) {
    return useQuery({
        queryKey: limit ? [...clientKeys.all, limit] : clientKeys.all,
        queryFn: async (): Promise<Client[]> => {
            const queryString = limit ? `?limit=${limit}` : "";
            const result = await api.get<Client[] | { data: Client[] }>(`/api/clients${queryString}`);
            return Array.isArray(result) ? result : result.data || [];
        },
        enabled: limit !== undefined, // Only fetch when limit is specified
    });
}

// Hook pour récupérer les clients avec pagination server-side
export function useClientsPaginated(params?: ClientsPaginationParams) {
    const { page = 1, limit = 20, search = "" } = params || {};

    return useQuery({
        queryKey: clientKeys.list({ page, limit, search }),
        queryFn: async (): Promise<PaginatedResponse<Client>> => {
            const searchParams = new URLSearchParams();
            searchParams.set("page", page.toString());
            searchParams.set("limit", limit.toString());
            if (search) {
                searchParams.set("search", search);
            }

            return api.get<PaginatedResponse<Client>>(`/api/clients?${searchParams.toString()}`);
        },
        enabled: !!params, // Only fetch when params are provided (i.e., when in list mode)
    });
}

// Hook pour récupérer un client par ID
export function useClient(id: string) {
    return useQuery({
        queryKey: clientKeys.detail(id),
        queryFn: async () => api.get<Client>(`/api/clients/${id}`),
        enabled: !!id, // Ne lance la requête que si l'ID existe
    });
}

// Hook pour récupérer les statistiques des clients
export function useClientsStats() {
    return useQuery({
        queryKey: clientKeys.stats,
        queryFn: async () => api.get<ClientsStats>("/api/clients/stats"),
    });
}

// Hook pour créer un client
export function useCreateClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ClientCreateInput) =>
            api.post<Client>("/api/clients", data),
        onSuccess: () => {
            // Invalide le cache des clients, des listes paginées et des stats
            queryClient.invalidateQueries({ queryKey: clientKeys.all });
            queryClient.invalidateQueries({ queryKey: ["clients", "list"] });
            queryClient.invalidateQueries({ queryKey: clientKeys.stats });
        },
    });
}

// Hook pour mettre à jour un client
export function useUpdateClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: ClientUpdateInput;
        }) => api.put<Client>(`/api/clients/${id}`, data),
        onSuccess: (_, variables) => {
            // Invalide le cache des clients, du client spécifique, des listes paginées et des stats
            queryClient.invalidateQueries({ queryKey: clientKeys.all });
            queryClient.invalidateQueries({
                queryKey: clientKeys.detail(variables.id),
            });
            queryClient.invalidateQueries({ queryKey: ["clients", "list"] });
            queryClient.invalidateQueries({ queryKey: clientKeys.stats });
        },
    });
}

// Hook pour supprimer un client
export function useDeleteClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => api.delete(`/api/clients/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: clientKeys.all });
            queryClient.invalidateQueries({ queryKey: ["clients", "list"] });
            queryClient.invalidateQueries({ queryKey: clientKeys.stats });
        },
    });
}

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
