/**
 * Types for Prestation (services offered by hair salons, etc.)
 */

export interface Prestation {
    id: string;
    nom: string;
    description: string | null;
    duree: number; // Duration in minutes
    prix: number;
    categorie: string | null;
    actif: boolean;
    ordre: number;
    entrepriseId: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface PrestationCreateInput {
    nom: string;
    description?: string;
    duree: number;
    prix: number;
    categorie?: string;
    actif?: boolean;
    ordre?: number;
}

export interface PrestationUpdateInput {
    nom?: string;
    description?: string;
    duree?: number;
    prix?: number;
    categorie?: string;
    actif?: boolean;
    ordre?: number;
}

export interface PrestationsPaginationParams {
    page?: number;
    limit?: number;
    search?: string;
    categorie?: string;
    actif?: boolean;
}

export const PRESTATION_CATEGORIES = [
    "Coupe",
    "Couleur",
    "Mèches",
    "Soin",
    "Coiffage",
    "Barbe",
    "Autre",
] as const;

export type PrestationCategorie = (typeof PRESTATION_CATEGORIES)[number];
