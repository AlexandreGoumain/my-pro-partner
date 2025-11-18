import { api } from "@/lib/api/fetch-client";
import type {
    Table,
    TableCreateInput,
    TableUpdateInput,
    TablesStats,
    TablesPaginationParams,
} from "@/lib/types/table.types";
import type { PaginatedResponse } from "@/lib/utils/pagination";
import { createResourceHooks } from "@/lib/hooks/create-resource-hooks";
import { useQuery } from "@tanstack/react-query";

// Re-export types and enums for convenience
export type { Table, TableCreateInput, TableUpdateInput, TablesStats };
export type { TableZone } from "@/lib/types/table.types";
export { TableStatus } from "@/lib/types/table.types";

// Create base hooks using factory
const tableHooks = createResourceHooks<Table>({
    resourceName: "tables",
    endpoint: "/api/tables",
});

// Extend query keys with custom pagination keys
export const tableKeys = {
    ...tableHooks.keys,
    list: (params: TablesPaginationParams) => ["tables", "list", params] as const,
};

// Export base hooks from factory
export const useTables = tableHooks.useList;
export const useTable = tableHooks.useDetail;
export const useTablesStats = () => tableHooks.useStats<TablesStats>();
export const useCreateTable = () => tableHooks.useCreate<TableCreateInput>();
export const useUpdateTable = () => tableHooks.useUpdate<TableUpdateInput>();
export const useDeleteTable = tableHooks.useDelete;

// Custom hook: Server-side pagination with filters (zone, statut)
export function useTablesPaginated(params?: TablesPaginationParams) {
    const { page = 1, limit = 20, search = "", zone, statut } = params || {};

    return useQuery({
        queryKey: tableKeys.list({ page, limit, search, zone, statut }),
        queryFn: async (): Promise<PaginatedResponse<Table>> => {
            const searchParams = new URLSearchParams();
            searchParams.set("page", page.toString());
            searchParams.set("limit", limit.toString());
            if (search) searchParams.set("search", search);
            if (zone) searchParams.set("zone", zone);
            if (statut) searchParams.set("statut", statut);

            return api.get<PaginatedResponse<Table>>(`/api/tables?${searchParams.toString()}`);
        },
        enabled: !!params,
    });
}
