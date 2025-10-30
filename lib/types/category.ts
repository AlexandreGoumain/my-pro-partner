/**
 * Category-related types and utilities
 * Centralizes all category type definitions to avoid duplication
 */

/**
 * Type de base pour une catégorie (tel que retourné par Prisma)
 */
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

/**
 * Type étendu avec le comptage d'articles (pour les vues)
 */
export interface CategorieWithCount extends Omit<Categorie, "articles"> {
    _count?: {
        articles: number;
    };
    articles?: { id: string }[];
}

/**
 * Type pour l'affichage simplifié des catégories
 */
export interface CategorieDisplay {
    id: string;
    nom: string;
    description?: string | null;
    parentId?: string | null;
    enfants?: CategorieDisplay[];
    articleCount?: number;
}

/**
 * Utilitaire pour construire une structure hiérarchique à partir d'une liste plate
 */
export function buildCategoryTree<
    T extends { id: string; parentId: string | null; enfants?: any[] }
>(flatList: T[]): T[] {
    const map = new Map<string, T>();
    const roots: T[] = [];

    // Créer une copie de chaque élément avec un tableau enfants vide
    flatList.forEach((item) => {
        map.set(item.id, { ...item, enfants: [] });
    });

    // Construire l'arbre
    map.forEach((item) => {
        if (item.parentId) {
            const parent = map.get(item.parentId);
            if (parent) {
                if (!parent.enfants) parent.enfants = [];
                parent.enfants.push(item);
            }
        } else {
            roots.push(item);
        }
    });

    return roots;
}

/**
 * Obtenir tous les IDs d'enfants récursivement
 */
export function getAllChildrenIds<T extends { id: string; enfants?: T[] }>(
    categoryId: string,
    allCategories: T[]
): string[] {
    const category = allCategories.find((c) => c.id === categoryId);
    if (!category || !category.enfants || category.enfants.length === 0) {
        return [];
    }

    const childIds: string[] = [];
    category.enfants.forEach((child) => {
        childIds.push(child.id);
        childIds.push(...getAllChildrenIds(child.id, allCategories));
    });

    return childIds;
}

/**
 * Obtenir tous les IDs de catégories incluant les enfants pour une liste de catégories sélectionnées
 */
export function expandCategoryIds<T extends { id: string; enfants?: T[] }>(
    selectedIds: string[],
    allCategories: T[]
): string[] {
    if (selectedIds.length === 0) return [];

    const allIds = new Set<string>(selectedIds);
    selectedIds.forEach((id) => {
        getAllChildrenIds(id, allCategories).forEach((childId) =>
            allIds.add(childId)
        );
    });

    return Array.from(allIds);
}
