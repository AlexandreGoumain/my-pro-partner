import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { useToast } from "./use-toast";

// Types
export interface RachatArticle {
  id: string;
  articleId: string;
  clientId: string | null;
  prixRachat: number;
  etat: string;
  provenance: string;
  numeroSerie: string | null;
  dureeGarantie: number | null;
  notes: string | null;
  dateRachat: Date;
  entrepriseId: string;
  createdAt: Date;
  updatedAt: Date;
  article: {
    id: string;
    nom: string;
    reference: string;
    description: string | null;
    type: string;
    prix_ht: number;
    tva_taux: number;
    stock_actuel: number;
    stock_min: number;
    gestion_stock: boolean;
    actif: boolean;
    categorie: {
      id: string;
      nom: string;
    } | null;
  };
  client: {
    id: string;
    nom: string;
    email: string | null;
    telephone: string | null;
  } | null;
}

export interface RachatsListResponse {
  items: RachatArticle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RachatCreateData {
  articleData: {
    nom: string;
    description?: string;
    type: "OCCASION";
    prix_ht: number;
    tva_taux: number;
    categorieId: string;
    stock_actuel: number;
    stock_min: number;
    gestion_stock: boolean;
    actif: boolean;
  };
  clientId?: string;
  prixRachat: number;
  etat: "COMME_NEUF" | "TRES_BON" | "BON" | "CORRECT" | "POUR_PIECES";
  provenance: "RACHAT_CLIENT" | "MARKETPLACE_OCCASION" | "REPRISE" | "DON" | "RETOUR_SAV" | "AUTRE";
  numeroSerie?: string;
  dureeGarantie?: number;
  notes?: string;
  dateRachat?: Date;
}

// Query keys
export const rachatKeys = {
  all: ["rachats"] as const,
  lists: () => [...rachatKeys.all, "list"] as const,
  list: (params?: Record<string, string | number>) =>
    [...rachatKeys.lists(), params] as const,
  details: () => [...rachatKeys.all, "detail"] as const,
  detail: (id: string) => [...rachatKeys.details(), id] as const,
};

// Hook to fetch all rachats with pagination
export function useRachats(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: rachatKeys.list(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.search) queryParams.append("search", params.search);

      return api.get<RachatsListResponse>(
        `/api/rachats?${queryParams.toString()}`
      );
    },
  });
}

// Hook to fetch a single rachat by ID
export function useRachat(id: string | null) {
  return useQuery({
    queryKey: rachatKeys.detail(id || ""),
    queryFn: async () => {
      if (!id) throw new Error("ID is required");
      return api.get<RachatArticle>(`/api/rachats/${id}`);
    },
    enabled: !!id,
  });
}

// Hook to create a new rachat
export function useCreateRachat() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: RachatCreateData) =>
      api.post<RachatArticle>("/api/rachats", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rachatKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast({
        title: "Rachat enregistré",
        description: "L'article d'occasion a été créé avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le rachat",
        variant: "destructive",
      });
    },
  });
}

// Hook to delete a rachat
export function useDeleteRachat() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => api.delete(`/api/rachats/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rachatKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast({
        title: "Rachat supprimé",
        description: "Le rachat a été supprimé avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le rachat",
        variant: "destructive",
      });
    },
  });
}
