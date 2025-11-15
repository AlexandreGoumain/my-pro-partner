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

// Types pour les filtres
export interface StockFilters {
    articleId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
}

// Query Keys
export const stockKeys = {
    all: ["stock", "mouvements"] as const,
    lists: () => ["stock", "mouvements", "list"] as const,
    list: (filters: StockFilters) =>
        ["stock", "mouvements", "list", filters] as const,
    detail: (id: string) => ["stock", "mouvements", id] as const,
    alerts: () => ["stock", "alerts"] as const,
};

// Hook pour récupérer tous les mouvements de stock
export function useStockMouvements(filters?: StockFilters) {
    const queryParams = new URLSearchParams();
    if (filters?.articleId) queryParams.set("articleId", filters.articleId);
    if (filters?.type) queryParams.set("type", filters.type);
    if (filters?.startDate) queryParams.set("startDate", filters.startDate);
    if (filters?.endDate) queryParams.set("endDate", filters.endDate);

    const queryString = queryParams.toString();
    const url = `${ENDPOINTS.STOCK_MOVEMENTS}${queryString ? `?${queryString}` : ""}`;

    return useQuery({
        queryKey: filters ? stockKeys.list(filters) : stockKeys.lists(),
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

// Hook pour récupérer un mouvement par ID
export function useStockMouvement(id: string) {
    return useQuery({
        queryKey: stockKeys.detail(id),
        queryFn: async () =>
            api.get<MouvementStockWithRelations>(
                `${ENDPOINTS.STOCK_MOVEMENTS}/${id}`
            ),
        enabled: !!id,
    });
}

// Hook pour créer un mouvement de stock
export function useCreateStockMouvement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: MouvementStockCreateInput) =>
            api.post<MouvementStockWithRelations>(
                ENDPOINTS.STOCK_MOVEMENTS,
                data
            ),
        onSuccess: () => {
            // Invalider les caches des mouvements et des articles
            queryClient.invalidateQueries({ queryKey: stockKeys.all });
            queryClient.invalidateQueries({ queryKey: articleKeys.all });
        },
    });
}

// Hook pour annuler un mouvement de stock
export function useDeleteStockMouvement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) =>
            api.delete(`${ENDPOINTS.STOCK_MOVEMENTS}/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: stockKeys.all });
            queryClient.invalidateQueries({ queryKey: articleKeys.all });
        },
    });
}

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
// ✅ Optimized: Uses dedicated ENDPOINTS.ARTICLE_ALERTS endpoint
export function useStockAlerts() {
    return useQuery({
        queryKey: stockKeys.alerts(),
        queryFn: async (): Promise<ArticleAvecAlerte[]> =>
            api.get<ArticleAvecAlerte[]>(ENDPOINTS.ARTICLE_ALERTS),
    });
}
