import { useMemo } from "react";
import { type Article } from "@/app/(dashboard)/dashboard/articles/_components/data-table/columns";

export interface UseArticleFiltersParams {
    articles: Article[];
    searchTerm: string;
    selectedCategoryIds: string[];
    allCategoryIds: string[];
    sortBy: string;
    typeFilter: "TOUS" | "PRODUIT" | "SERVICE";
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
            const articleWithType = article as Article & {
                type?: string;
                categorieId?: string;
            };

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
                (articleWithType.categorieId &&
                    allCategoryIds.includes(articleWithType.categorieId));

            const matchesType =
                typeFilter === "TOUS" ||
                (typeFilter === "PRODUIT" &&
                    (!articleWithType.type ||
                        articleWithType.type === "PRODUIT")) ||
                (typeFilter === "SERVICE" &&
                    articleWithType.type === "SERVICE");

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
