import { api } from "@/lib/api/fetch-client";
import type { Categorie } from "@/lib/types/category";
import type {
    CategorieCreateInput,
    CategorieUpdateInput,
} from "@/lib/validation";
import { createResourceHooks } from "@/lib/hooks/create-resource-hooks";

// Re-export type for convenience
export type { Categorie } from "@/lib/types/category";

// Create base hooks using factory
const categorieHooks = createResourceHooks<Categorie>({
    resourceName: "categories",
    endpoint: "/api/categories",
});

// Export query keys
export const categorieKeys = categorieHooks.keys;

// Export base hooks from factory
export const useCategories = categorieHooks.useList;
export const useCategorie = categorieHooks.useDetail;
export const useCreateCategorie = () => categorieHooks.useCreate<CategorieCreateInput>();
export const useUpdateCategorie = () => categorieHooks.useUpdate<CategorieUpdateInput>();
export const useDeleteCategorie = categorieHooks.useDelete;
