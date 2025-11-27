import { api } from "@/lib/api/fetch-client";
import type { PaginatedResponse } from "@/lib/utils/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Menu item categories for restaurants
export const MENU_CATEGORIES = [
    "Entrées",
    "Plats",
    "Desserts",
    "Boissons",
    "Formules",
    "Accompagnements",
    "Autre",
] as const;

export type MenuCategory = (typeof MENU_CATEGORIES)[number];

// Allergens list
export const ALLERGENS = [
    "Gluten",
    "Crustacés",
    "Oeufs",
    "Poissons",
    "Arachides",
    "Soja",
    "Lait",
    "Fruits à coque",
    "Céleri",
    "Moutarde",
    "Sésame",
    "Sulfites",
    "Lupin",
    "Mollusques",
] as const;

export type Allergen = (typeof ALLERGENS)[number];

// Menu item interface
export interface MenuItem {
    id: string;
    nom: string;
    description?: string | null;
    prix: number;
    categorie: MenuCategory;
    allergenes?: Allergen[];
    tempsPreparation?: number; // in minutes
    disponible: boolean;
    imageUrl?: string | null;
    ordre?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// Create input
export interface MenuItemCreateInput {
    nom: string;
    description?: string;
    prix: number;
    categorie: MenuCategory;
    allergenes?: Allergen[];
    tempsPreparation?: number;
    disponible?: boolean;
    imageUrl?: string;
    ordre?: number;
}

// Update input
export interface MenuItemUpdateInput extends Partial<MenuItemCreateInput> {}

// Stats interface
export interface MenuStats {
    total: number;
    disponibles: number;
    indisponibles: number;
    parCategorie: { categorie: MenuCategory; count: number }[];
    prixMoyen: number;
}

// Pagination params
export interface MenuPaginationParams {
    page?: number;
    limit?: number;
    search?: string;
    categorie?: MenuCategory;
    disponible?: boolean;
}

// Query keys
export const menuKeys = {
    all: ["menu"] as const,
    lists: () => [...menuKeys.all, "list"] as const,
    list: (params?: MenuPaginationParams) =>
        [...menuKeys.lists(), params] as const,
    details: () => [...menuKeys.all, "detail"] as const,
    detail: (id: string) => [...menuKeys.details(), id] as const,
    stats: () => [...menuKeys.all, "stats"] as const,
};

// Fetch all menu items
export function useMenu(params?: MenuPaginationParams) {
    return useQuery({
        queryKey: menuKeys.list(params),
        queryFn: async () => {
            const searchParams = new URLSearchParams();
            if (params?.page) searchParams.set("page", params.page.toString());
            if (params?.limit)
                searchParams.set("limit", params.limit.toString());
            if (params?.search) searchParams.set("search", params.search);
            if (params?.categorie)
                searchParams.set("categorie", params.categorie);
            if (params?.disponible !== undefined)
                searchParams.set("disponible", params.disponible.toString());

            const query = searchParams.toString();
            return api.get<PaginatedResponse<MenuItem>>(
                `/api/menu${query ? `?${query}` : ""}`
            );
        },
    });
}

// Fetch single menu item
export function useMenuItem(id: string) {
    return useQuery({
        queryKey: menuKeys.detail(id),
        queryFn: () => api.get<MenuItem>(`/api/menu/${id}`),
        enabled: !!id,
    });
}

// Fetch menu stats
export function useMenuStats() {
    return useQuery({
        queryKey: menuKeys.stats(),
        queryFn: () => api.get<MenuStats>("/api/menu/stats"),
    });
}

// Create menu item
export function useCreateMenuItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: MenuItemCreateInput) =>
            api.post<MenuItem>("/api/menu", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: menuKeys.all });
        },
    });
}

// Update menu item
export function useUpdateMenuItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: MenuItemUpdateInput }) =>
            api.put<MenuItem>(`/api/menu/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: menuKeys.all });
        },
    });
}

// Delete menu item
export function useDeleteMenuItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => api.delete(`/api/menu/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: menuKeys.all });
        },
    });
}

// Toggle availability
export function useToggleMenuItemAvailability() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, disponible }: { id: string; disponible: boolean }) =>
            api.put<MenuItem>(`/api/menu/${id}`, { disponible }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: menuKeys.all });
        },
    });
}
