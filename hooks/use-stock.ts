import { ENDPOINTS } from "@/lib/api/endpoints";
import { api } from "@/lib/api/fetch-client";
import type {
    ArticleAvecAlerte,
    MouvementStockDisplay,
    MouvementStockWithRelations,
} from "@/lib/types/stock";
import { mapMouvementToDisplay } from "@/lib/types/stock";
import type {
    MouvementStockCreateInput,
    StockAdjustmentInput,
} from "@/lib/validation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { articleKeys } from "./use-articles";
import { createResourceHooks } from "@/lib/hooks/create-resource-hooks";

// Types pour les filtres
export interface StockFilters {
    articleId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
}

// Create base hooks using factory
const stockHooks = createResourceHooks<MouvementStockWithRelations, MouvementStockDisplay>({
    resourceName: "stock",
    endpoint: ENDPOINTS.STOCK_MOVEMENTS,
    mapToDisplay: mapMouvementToDisplay,
});

// Extend query keys with custom keys
export const stockKeys = {
    ...stockHooks.keys,
    all: ["stock", "mouvements"] as const,
    lists: () => ["stock", "mouvements", "list"] as const,
    list: (filters: StockFilters) => ["stock", "mouvements", "list", filters] as const,
    detail: (id: string) => ["stock", "mouvements", id] as const,
    alerts: () => ["stock", "alerts"] as const,
};

// Custom hook: Fetch with filters
export function useStockMouvements(filters?: StockFilters) {
    const queryParams = new URLSearchParams();
    if (filters?.articleId) queryParams.set("articleId", filters.articleId);
    if (filters?.type) queryParams.set("type", filters.type);
    if (filters?.startDate) queryParams.set("startDate", filters.startDate);
    if (filters?.endDate) queryParams.set("endDate", filters.endDate);

    const queryString = queryParams.toString();
    const url = `${ENDPOINTS.STOCK_MOVEMENTS}${queryString ? `?${queryString}` : ""}`;

    // Create normalized filters for query key (remove undefined values)
    const normalizedFilters: StockFilters = filters
        ? Object.fromEntries(
              Object.entries(filters).filter(([_, v]) => v !== undefined)
          ) as StockFilters
        : {};

    return useQuery({
        queryKey: filters ? stockKeys.list(normalizedFilters) : stockKeys.lists(),
        queryFn: async (): Promise<MouvementStockDisplay[]> => {
            const result = await api.get<
                | MouvementStockWithRelations[]
                | { data: MouvementStockWithRelations[] }
            >(url);
            const data = Array.isArray(result) ? result : result.data || [];
            return data.map((m: MouvementStockWithRelations) =>
                mapMouvementToDisplay(m)
            );
        },
    });
}

// Export base hooks from factory
export const useStockMouvement = stockHooks.useDetail;
export const useCreateStockMouvement = () => stockHooks.useCreate<MouvementStockCreateInput>();
export const useDeleteStockMouvement = stockHooks.useDelete;

// Custom hooks specific to stock

// Hook pour ajuster rapidement le stock d'un article
export function useAdjustStock() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            articleId,
            data,
        }: {
            articleId: string;
            data: StockAdjustmentInput;
        }) => api.put(ENDPOINTS.ARTICLE_STOCK(articleId), data),
        onSuccess: (_, variables) => {
            // Invalider les caches
            queryClient.invalidateQueries({ queryKey: stockKeys.all });
            queryClient.invalidateQueries({ queryKey: articleKeys.all });
            queryClient.invalidateQueries({
                queryKey: articleKeys.detail(variables.articleId),
            });
        },
    });
}

// Hook pour récupérer les articles avec alertes de stock
export function useStockAlerts() {
    return useQuery({
        queryKey: stockKeys.alerts(),
        queryFn: async (): Promise<ArticleAvecAlerte[]> =>
            api.get<ArticleAvecAlerte[]>(ENDPOINTS.ARTICLE_ALERTS),
    });
}
