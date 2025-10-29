import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mapArticleToDisplay } from "@/lib/types/article";
import type { Article } from "@/app/(dashboard)/dashboard/articles/columns";
import type { ArticleCreateInput, ArticleUpdateInput } from "@/lib/validation";

// Query Keys
export const articleKeys = {
    all: ["articles"] as const,
    detail: (id: string) => ["articles", id] as const,
};

// Hook pour récupérer tous les articles
export function useArticles() {
    return useQuery({
        queryKey: articleKeys.all,
        queryFn: async (): Promise<Article[]> => {
            const response = await fetch("/api/articles");

            if (!response.ok) {
                throw new Error("Erreur lors du chargement des articles");
            }

            const result = await response.json();
            const data = result.data || result;
            return data.map(mapArticleToDisplay);
        },
    });
}

// Hook pour récupérer un article par ID
export function useArticle(id: string) {
    return useQuery({
        queryKey: articleKeys.detail(id),
        queryFn: async () => {
            const response = await fetch(`/api/articles/${id}`);

            if (!response.ok) {
                throw new Error("Erreur lors du chargement de l'article");
            }

            return response.json();
        },
        enabled: !!id, // Ne lance la requête que si l'ID existe
    });
}

// Hook pour créer un article
export function useCreateArticle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ArticleCreateInput) => {
            const response = await fetch("/api/articles", {
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
            // Invalide le cache des articles pour forcer un rechargement
            queryClient.invalidateQueries({ queryKey: articleKeys.all });
        },
    });
}

// Hook pour mettre à jour un article
export function useUpdateArticle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: ArticleUpdateInput;
        }) => {
            const response = await fetch(`/api/articles/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(
                    error.message || "Erreur lors de la mise à jour"
                );
            }

            return response.json();
        },
        onSuccess: (_, variables) => {
            // Invalide le cache des articles et de l'article spécifique
            queryClient.invalidateQueries({ queryKey: articleKeys.all });
            queryClient.invalidateQueries({
                queryKey: articleKeys.detail(variables.id),
            });
        },
    });
}

// Hook pour dupliquer un article
export function useDuplicateArticle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (article: Article) => {
            const response = await fetch("/api/articles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    reference: `${article.reference}-COPIE`,
                    nom: `${article.nom} (Copie)`,
                    description: article.description,
                    prix_ht: article.prix,
                    tva_taux: article.tva,
                    stock_actuel: 0,
                    stock_min: article.seuilAlerte,
                    gestion_stock: true,
                    actif: true,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Erreur lors de la duplication");
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: articleKeys.all });
        },
    });
}

// Hook pour supprimer un article
export function useDeleteArticle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/articles/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(
                    error.message || "Erreur lors de la suppression"
                );
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: articleKeys.all });
        },
    });
}
