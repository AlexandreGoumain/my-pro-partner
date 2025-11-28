import { api } from "@/lib/api/fetch-client";
import { createResourceHooks } from "@/lib/hooks/create-resource-hooks";
import { useMutationWithInvalidation } from "@/lib/hooks/mutation-helpers";
import {
    mapArticleToDisplay,
    type Article,
    type ArticleWithRelations,
} from "@/lib/types/article";
import { buildUrl } from "@/lib/utils/query-params";
import type { ArticleCreateInput, ArticleUpdateInput } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";

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
    return useMutationWithInvalidation<ArticleWithRelations, Article>({
        mutationFn: (article) =>
            api.post("/api/articles", {
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
        invalidateKeys: [articleKeys.all],
        messages: {
            success: "Article dupliqué",
            successDescription: "L'article a été dupliqué avec succès.",
        },
    });
}

// Hook pour récupérer la prochaine référence disponible
export function useNextArticleReference(type: "PRODUIT" | "SERVICE" | null) {
    return useQuery({
        queryKey: articleKeys.nextReference(type || "PRODUIT"),
        queryFn: () =>
            api.get<{ reference: string; type: string }>(
                buildUrl("/api/articles/next-reference", { type })
            ),
        enabled: !!type,
    });
}
