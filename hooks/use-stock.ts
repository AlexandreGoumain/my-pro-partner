import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

// Type pour la réponse de l'API articles avec catégorie
interface ArticleFromAPI {
  id: string;
  reference: string;
  nom: string;
  stock_actuel: number;
  stock_min: number;
  prix_ht: string | number;
  gestion_stock: boolean;
  categorie?: {
    id: string;
    nom: string;
  } | null;
}

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
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des mouvements");
      }

      const result = await response.json();
      const data = result.data || result;
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
    queryFn: async () => {
      const response = await fetch(`/api/stock/mouvements/${id}`);

      if (!response.ok) {
        throw new Error("Erreur lors du chargement du mouvement");
      }

      return response.json();
    },
    enabled: !!id,
  });
}

// Hook pour créer un mouvement de stock
export function useCreateStockMouvement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MouvementStockCreateInput) => {
      const response = await fetch("/api/stock/mouvements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de la création du mouvement");
      }

      return response.json();
    },
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
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/stock/mouvements/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Erreur lors de l'annulation du mouvement"
        );
      }

      return response.json();
    },
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
    }) => {
      const response = await fetch(`/api/articles/${articleId}/stock`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Erreur lors de l'ajustement du stock"
        );
      }

      return response.json();
    },
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
    queryFn: async (): Promise<ArticleAvecAlerte[]> => {
      const response = await fetch("/api/articles");

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des articles");
      }

      const result = await response.json();
      const articles = result.data || result;

      // Filtrer les articles en alerte (stock <= stock_min) et qui ont la gestion de stock activée
      return articles
        .filter(
          (article: ArticleFromAPI) =>
            article.gestion_stock &&
            article.stock_actuel <= article.stock_min
        )
        .map((article: ArticleFromAPI) => ({
          id: article.id,
          reference: article.reference,
          nom: article.nom,
          stock_actuel: article.stock_actuel,
          stock_min: article.stock_min,
          prix_ht: Number(article.prix_ht),
          categorie: article.categorie
            ? {
                id: article.categorie.id,
                nom: article.categorie.nom,
              }
            : null,
        }));
    },
  });
}
