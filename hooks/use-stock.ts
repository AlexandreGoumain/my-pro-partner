import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { mapMouvementToDisplay } from "@/lib/types/stock";
import type {
  MouvementStockDisplay,
  MouvementStockWithRelations,
  ArticleAvecAlerte,
} from "@/lib/types/stock";
import type {
  MouvementStockCreateInput,
  StockAdjustmentInput,
} from "@/lib/validation";
import { articleKeys } from "./use-articles";

// Query Keys
export const stockKeys = {
  all: ["stock", "mouvements"] as const,
  lists: () => ["stock", "mouvements", "list"] as const,
  list: (filters: Record<string, string>) =>
    ["stock", "mouvements", "list", filters] as const,
  detail: (id: string) => ["stock", "mouvements", id] as const,
  alerts: () => ["stock", "alerts"] as const,
};

// Types pour les filtres
export interface StockFilters {
  articleId?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

// Hook pour récupérer tous les mouvements de stock
export function useStockMouvements(filters?: StockFilters) {
  const queryParams = new URLSearchParams();
  if (filters?.articleId) queryParams.set("articleId", filters.articleId);
  if (filters?.type) queryParams.set("type", filters.type);
  if (filters?.startDate) queryParams.set("startDate", filters.startDate);
  if (filters?.endDate) queryParams.set("endDate", filters.endDate);

  const queryString = queryParams.toString();
  const url = `/api/stock/mouvements${queryString ? `?${queryString}` : ""}`;

  return useQuery({
    queryKey: filters ? stockKeys.list(filters) : stockKeys.lists(),
    queryFn: async (): Promise<MouvementStockDisplay[]> => {
      const result = await api.get<MouvementStockWithRelations[] | { data: MouvementStockWithRelations[] }>(url);
      const data = Array.isArray(result) ? result : result.data || [];
      return data.map((m: MouvementStockWithRelations) => mapMouvementToDisplay(m));
    },
  });
}

// Hook pour récupérer un mouvement par ID
export function useStockMouvement(id: string) {
  return useQuery({
    queryKey: stockKeys.detail(id),
    queryFn: async () => api.get<MouvementStockWithRelations>(`/api/stock/mouvements/${id}`),
    enabled: !!id,
  });
}

// Hook pour créer un mouvement de stock
export function useCreateStockMouvement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MouvementStockCreateInput) =>
      api.post<MouvementStockWithRelations>("/api/stock/mouvements", data),
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
    mutationFn: async (id: string) => api.delete(`/api/stock/mouvements/${id}`),
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
    }) => api.put(`/api/articles/${articleId}/stock`, data),
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
// ✅ Optimized: Uses dedicated /api/articles/alerts endpoint
export function useStockAlerts() {
  return useQuery({
    queryKey: stockKeys.alerts(),
    queryFn: async (): Promise<ArticleAvecAlerte[]> =>
      api.get<ArticleAvecAlerte[]>("/api/articles/alerts"),
  });
}
