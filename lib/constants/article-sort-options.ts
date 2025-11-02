export const ARTICLE_SORT_OPTIONS = [
    "Nom A-Z",
    "Nom Z-A",
    "Prix croissant",
    "Prix décroissant",
    "Stock",
] as const;

export type ArticleSortOption = typeof ARTICLE_SORT_OPTIONS[number];
