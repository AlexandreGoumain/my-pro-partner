import { type Article, type ArticleTypeFilter } from "@/lib/types/article";
import { useMemo } from "react";

export interface UseArticleFiltersParams {
    articles: Article[];
    searchTerm: string;
    selectedCategoryIds: string[];
    allCategoryIds: string[];
    sortBy: string;
    typeFilter: ArticleTypeFilter;
}

export function useArticleFilters({
    articles,
    searchTerm,
    selectedCategoryIds,
    allCategoryIds,
    sortBy,
    typeFilter,
}: UseArticleFiltersParams): Article[] {
    return useMemo(() => {
        // Filtrage
        const filtered = articles.filter((article) => {
            const matchesSearch =
                article.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.reference
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                article.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesCategory =
                selectedCategoryIds.length === 0 ||
                (article.categorieId &&
                    allCategoryIds.includes(article.categorieId));

            const matchesType =
                typeFilter === "TOUS" || article.type === typeFilter;

            return matchesSearch && matchesCategory && matchesType;
        });

        // Tri
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "Nom A-Z":
                    return a.nom.localeCompare(b.nom);
                case "Nom Z-A":
                    return b.nom.localeCompare(a.nom);
                case "Prix croissant":
                    return a.prix - b.prix;
                case "Prix décroissant":
                    return b.prix - a.prix;
                case "Stock":
                    return a.stock - b.stock;
                default:
                    return 0;
            }
        });

        return sorted;
    }, [
        articles,
        searchTerm,
        selectedCategoryIds,
        allCategoryIds,
        sortBy,
        typeFilter,
    ]);
}
