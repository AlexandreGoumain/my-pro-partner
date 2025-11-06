export const DOCUMENT_SORT_OPTIONS = [
    "Date récente",
    "Date ancienne",
    "Numéro croissant",
    "Numéro décroissant",
    "Montant croissant",
    "Montant décroissant",
    "Client A-Z",
    "Client Z-A",
] as const;

export type DocumentSortOption = typeof DOCUMENT_SORT_OPTIONS[number];
