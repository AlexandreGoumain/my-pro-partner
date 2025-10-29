import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CategorieCreateInput,
  CategorieUpdateInput,
} from "@/lib/validation";

// Types pour les catégories
export interface Categorie {
  id: string;
  nom: string;
  description: string | null;
  ordre: number;
  parentId: string | null;
  parent: Categorie | null;
  enfants: Categorie[];
  articles: { id: string }[];
  createdAt: Date;
}

// Query Keys
export const categorieKeys = {
  all: ["categories"] as const,
  detail: (id: string) => ["categories", id] as const,
};

// Hook pour récupérer toutes les catégories
export function useCategories() {
  return useQuery({
    queryKey: categorieKeys.all,
    queryFn: async (): Promise<Categorie[]> => {
      const response = await fetch("/api/categories");

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des catégories");
      }

      return response.json();
    },
  });
}

// Hook pour récupérer une catégorie par ID
export function useCategorie(id: string) {
  return useQuery({
    queryKey: categorieKeys.detail(id),
    queryFn: async (): Promise<Categorie> => {
      const response = await fetch(`/api/categories/${id}`);

      if (!response.ok) {
        throw new Error("Erreur lors du chargement de la catégorie");
      }

      return response.json();
    },
    enabled: !!id,
  });
}

// Hook pour créer une catégorie
export function useCreateCategorie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CategorieCreateInput) => {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de la création");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categorieKeys.all });
    },
  });
}

// Hook pour mettre à jour une catégorie
export function useUpdateCategorie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CategorieUpdateInput;
    }) => {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de la mise à jour");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categorieKeys.all });
      queryClient.invalidateQueries({
        queryKey: categorieKeys.detail(variables.id),
      });
    },
  });
}

// Hook pour supprimer une catégorie
export function useDeleteCategorie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de la suppression");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categorieKeys.all });
    },
  });
}
