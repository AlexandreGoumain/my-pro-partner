/**
 * Stock hooks
 *
 * Optimized version using:
 * - buildUrl utility for URL construction
 * - useMutationWithInvalidation for mutations
 */

import { ENDPOINTS } from "@/lib/api/endpoints";
import { api } from "@/lib/api/fetch-client";
import { createResourceHooks } from "@/lib/hooks/create-resource-hooks";
import { useMutationWithInvalidation } from "@/lib/hooks/mutation-helpers";
import type {
    ArticleAvecAlerte,
    MouvementStockDisplay,
    MouvementStockWithRelations,
} from "@/lib/types/stock";
import { mapMouvementToDisplay } from "@/lib/types/stock";
import { buildUrl } from "@/lib/utils/query-params";
import type {
    MouvementStockCreateInput,
    StockAdjustmentInput,
} from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { articleKeys } from "./use-articles";

// Types pour les filtres
export interface StockFilters {
    articleId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
}

// Create base hooks using factory
const stockHooks = createResourceHooks<
    MouvementStockWithRelations,
    MouvementStockDisplay
>({
    resourceName: "stock",
    endpoint: ENDPOINTS.STOCK_MOVEMENTS,
    mapToDisplay: mapMouvementToDisplay,
});

// Extend query keys with custom keys
export const stockKeys = {
    ...stockHooks.keys,
    all: ["stock", "mouvements"] as const,
    lists: () => ["stock", "mouvements", "list"] as const,
    list: (filters: StockFilters) =>
        ["stock", "mouvements", "list", filters] as const,
    detail: (id: string) => ["stock", "mouvements", id] as const,
    alerts: () => ["stock", "alerts"] as const,
};

// ============================================================================
// QUERY HOOKS
// ============================================================================

// Custom hook: Fetch with filters
export function useStockMouvements(filters?: StockFilters) {
    // Normalize filters for query key (remove undefined values)
    const normalizedFilters: StockFilters = filters
        ? (Object.fromEntries(
              Object.entries(filters).filter(([, v]) => v !== undefined)
          ) as StockFilters)
        : {};

    return useQuery({
        queryKey: filters
            ? stockKeys.list(normalizedFilters)
            : stockKeys.lists(),
        queryFn: async (): Promise<MouvementStockDisplay[]> => {
            const result = await api.get<
                | MouvementStockWithRelations[]
                | { data: MouvementStockWithRelations[] }
            >(buildUrl(ENDPOINTS.STOCK_MOVEMENTS, filters));
            const data = Array.isArray(result) ? result : result.data || [];
            return data.map((m: MouvementStockWithRelations) =>
                mapMouvementToDisplay(m)
            );
        },
    });
}

// Export base hooks from factory
export const useStockMouvement = stockHooks.useDetail;
export const useCreateStockMouvement = () =>
    stockHooks.useCreate<MouvementStockCreateInput>();
export const useDeleteStockMouvement = stockHooks.useDelete;

// Hook pour récupérer les articles avec alertes de stock
export function useStockAlerts() {
    return useQuery({
        queryKey: stockKeys.alerts(),
        queryFn: () => api.get<ArticleAvecAlerte[]>(ENDPOINTS.ARTICLE_ALERTS),
    });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

// Hook pour ajuster rapidement le stock d'un article
export function useAdjustStock() {
    return useMutationWithInvalidation<
        unknown,
        { articleId: string; data: StockAdjustmentInput }
    >({
        mutationFn: ({ articleId, data }) =>
            api.put(ENDPOINTS.ARTICLE_STOCK(articleId), data),
        invalidateKeys: [stockKeys.all, articleKeys.all],
        messages: {
            success: "Stock ajusté",
            successDescription: "Le stock a été mis à jour avec succès.",
        },
    });
}
