import { api } from "@/lib/api/fetch-client";
import { createResourceHooks } from "@/lib/hooks/create-resource-hooks";
import {
    mapArticleToDisplay,
    type Article,
    type ArticleWithRelations,
} from "@/lib/types/article";
import type { ArticleCreateInput, ArticleUpdateInput } from "@/lib/validation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Article statistics type definition
export interface ArticlesStats {
    total: number;
    produits: number;
    services: number;
    actifs: number;
    stockFaible: number;
}

// Create base hooks using factory
const articleHooks = createResourceHooks<ArticleWithRelations, Article>({
    resourceName: "articles",
    endpoint: "/api/articles",
    mapToDisplay: mapArticleToDisplay,
});

// Extend query keys with custom keys
export const articleKeys = {
    ...articleHooks.keys,
    nextReference: (type: "PRODUIT" | "SERVICE") =>
        ["articles", "next-reference", type] as const,
};

// Export base hooks from factory
export const useArticles = articleHooks.useList;
export const useArticlesPaginated = articleHooks.useListPaginated;
export const useArticle = articleHooks.useDetail;
export const useArticlesStats = () => articleHooks.useStats<ArticlesStats>();
export const useCreateArticle = () =>
    articleHooks.useCreate<ArticleCreateInput>();
export const useUpdateArticle = () =>
    articleHooks.useUpdate<ArticleUpdateInput>();
export const useDeleteArticle = articleHooks.useDelete;

// Custom hooks specific to articles

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
        queryFn: async () =>
            api.get<{ reference: string; type: string }>(
                `/api/articles/next-reference?type=${type}`
            ),
        enabled: !!type, // Ne lance la requête que si le type existe
    });
}
