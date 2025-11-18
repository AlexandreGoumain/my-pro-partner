import { api } from "@/lib/api/fetch-client";
import type { NiveauFideliteCreateInput, NiveauFideliteUpdateInput } from "@/lib/validation";
import { createResourceHooks } from "@/lib/hooks/create-resource-hooks";

// Loyalty level type definition
export interface NiveauFidelite {
    id: string;
    nom: string;
    description?: string | null;
    ordre: number;
    seuilPoints: number;
    remise: number;
    couleur: string;
    icone?: string | null;
    avantages?: string | null;
    actif: boolean;
    entrepriseId: string;
    createdAt: Date;
    updatedAt: Date;
}

// Create base hooks using factory
const loyaltyLevelHooks = createResourceHooks<NiveauFidelite>({
    resourceName: "loyaltyLevels",
    endpoint: "/api/loyalty-levels",
});

// Export query keys
export const loyaltyLevelKeys = loyaltyLevelHooks.keys;

// Export base hooks from factory
export const useLoyaltyLevels = loyaltyLevelHooks.useList;
export const useLoyaltyLevel = loyaltyLevelHooks.useDetail;
export const useCreateLoyaltyLevel = () => loyaltyLevelHooks.useCreate<NiveauFideliteCreateInput>();
export const useUpdateLoyaltyLevel = () => loyaltyLevelHooks.useUpdate<NiveauFideliteUpdateInput>();
export const useDeleteLoyaltyLevel = loyaltyLevelHooks.useDelete;
