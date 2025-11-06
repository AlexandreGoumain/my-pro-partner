import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { mapArticleToDisplay, type ArticleWithRelations } from "@/lib/types/article";
import type { Article } from "@/app/(dashboard)/dashboard/articles/_components/data-table/columns";
import type { ArticleCreateInput, ArticleUpdateInput } from "@/lib/validation";

// Query Keys
export const articleKeys = {
    all: ["articles"] as const,
    detail: (id: string) => ["articles", id] as const,
    nextReference: (type: "PRODUIT" | "SERVICE") => ["articles", "next-reference", type] as const,
};

// Hook pour récupérer tous les articles
export function useArticles() {
    return useQuery({
        queryKey: articleKeys.all,
        queryFn: async (): Promise<Article[]> => {
            const result = await api.get<ArticleWithRelations[] | { data: ArticleWithRelations[] }>("/api/articles");
            const data = Array.isArray(result) ? result : result.data || [];
            return data.map(mapArticleToDisplay);
        },
    });
}

// Hook pour récupérer un article par ID
export function useArticle(id: string) {
    return useQuery({
        queryKey: articleKeys.detail(id),
        queryFn: async () => api.get<ArticleWithRelations>(`/api/articles/${id}`),
        enabled: !!id, // Ne lance la requête que si l'ID existe
    });
}

// Hook pour créer un article
export function useCreateArticle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ArticleCreateInput) =>
            api.post<ArticleWithRelations>("/api/articles", data),
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
        }) => api.put<ArticleWithRelations>(`/api/articles/${id}`, data),
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
        mutationFn: async (article: Article) =>
            api.post<ArticleWithRelations>("/api/articles", {
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: articleKeys.all });
        },
    });
}

// Hook pour récupérer la prochaine référence disponible
export function useNextArticleReference(type: "PRODUIT" | "SERVICE" | null) {
    return useQuery({
        queryKey: articleKeys.nextReference(type || "PRODUIT"),
        queryFn: async () => api.get<{ reference: string; type: string }>(`/api/articles/next-reference?type=${type}`),
        enabled: !!type, // Ne lance la requête que si le type existe
    });
}

// Hook pour supprimer un article
export function useDeleteArticle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => api.delete(`/api/articles/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: articleKeys.all });
        },
    });
}
