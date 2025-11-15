import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import type {
    Table,
    TableCreateInput,
    TableUpdateInput,
    TablesStats,
    TablesPaginationParams,
} from "@/lib/types/table.types";
import type { PaginatedResponse } from "@/lib/utils/pagination";

// Re-export types and enums for convenience
export type { Table, TableCreateInput, TableUpdateInput, TablesStats };
export type { TableZone } from "@/lib/types/table.types";
export { TableStatus } from "@/lib/types/table.types";

// Query Keys
export const tableKeys = {
    all: ["tables"] as const,
    list: (params: TablesPaginationParams) => ["tables", "list", params] as const,
    detail: (id: string) => ["tables", id] as const,
    stats: ["tables", "stats"] as const,
};

// Hook to fetch all tables
export function useTables(limit?: number) {
    return useQuery({
        queryKey: limit ? [...tableKeys.all, limit] : tableKeys.all,
        queryFn: async (): Promise<Table[]> => {
            const queryString = limit ? `?limit=${limit}` : "";
            const result = await api.get<Table[] | { data: Table[] }>(`/api/tables${queryString}`);
            return Array.isArray(result) ? result : result.data || [];
        },
        enabled: limit !== undefined,
    });
}

// Hook to fetch tables with server-side pagination
export function useTablesPaginated(params?: TablesPaginationParams) {
    const { page = 1, limit = 20, search = "", zone, statut } = params || {};

    return useQuery({
        queryKey: tableKeys.list({ page, limit, search, zone, statut }),
        queryFn: async (): Promise<PaginatedResponse<Table>> => {
            const searchParams = new URLSearchParams();
            searchParams.set("page", page.toString());
            searchParams.set("limit", limit.toString());
            if (search) {
                searchParams.set("search", search);
            }
            if (zone) {
                searchParams.set("zone", zone);
            }
            if (statut) {
                searchParams.set("statut", statut);
            }

            return api.get<PaginatedResponse<Table>>(`/api/tables?${searchParams.toString()}`);
        },
        enabled: !!params,
    });
}

// Hook to fetch a table by ID
export function useTable(id: string) {
    return useQuery({
        queryKey: tableKeys.detail(id),
        queryFn: async () => api.get<Table>(`/api/tables/${id}`),
        enabled: !!id,
    });
}

// Hook to fetch table statistics
export function useTablesStats() {
    return useQuery({
        queryKey: tableKeys.stats,
        queryFn: async () => api.get<TablesStats>("/api/tables/stats"),
    });
}

// Hook to create a table
export function useCreateTable() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: TableCreateInput) =>
            api.post<Table>("/api/tables", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tableKeys.all });
            queryClient.invalidateQueries({ queryKey: ["tables", "list"] });
            queryClient.invalidateQueries({ queryKey: tableKeys.stats });
        },
    });
}

// Hook to update a table
export function useUpdateTable() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: TableUpdateInput;
        }) => api.put<Table>(`/api/tables/${id}`, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: tableKeys.all });
            queryClient.invalidateQueries({
                queryKey: tableKeys.detail(variables.id),
            });
            queryClient.invalidateQueries({ queryKey: ["tables", "list"] });
            queryClient.invalidateQueries({ queryKey: tableKeys.stats });
        },
    });
}

// Hook to delete a table
export function useDeleteTable() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => api.delete(`/api/tables/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tableKeys.all });
            queryClient.invalidateQueries({ queryKey: ["tables", "list"] });
            queryClient.invalidateQueries({ queryKey: tableKeys.stats });
        },
    });
}
