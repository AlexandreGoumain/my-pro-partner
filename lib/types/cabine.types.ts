/**
 * Types for Cabine (treatment rooms for spas/beauty salons)
 */

export const CABINE_TYPES = [
    { value: "massage", label: "Massage" },
    { value: "soin_visage", label: "Soin du visage" },
    { value: "soin_corps", label: "Soin du corps" },
    { value: "epilation", label: "Épilation" },
    { value: "manucure", label: "Manucure / Pédicure" },
    { value: "hammam", label: "Hammam / Sauna" },
    { value: "uv", label: "Cabine UV" },
    { value: "polyvalente", label: "Polyvalente" },
] as const;

export type CabineType = (typeof CABINE_TYPES)[number]["value"];

export interface Cabine {
    id: string;
    nom: string;
    description: string | null;
    type: string | null;
    capacite: number;
    equipements: string | null;
    couleur: string | null;
    actif: boolean;
    ordre: number;
    entrepriseId: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    _count?: {
        rendezVous: number;
    };
}

export interface CabineCreateInput {
    nom: string;
    description?: string;
    type?: string;
    capacite?: number;
    equipements?: string;
    couleur?: string;
    actif?: boolean;
    ordre?: number;
}

export interface CabineUpdateInput {
    nom?: string;
    description?: string;
    type?: string;
    capacite?: number;
    equipements?: string;
    couleur?: string;
    actif?: boolean;
    ordre?: number;
}

export interface CabinePaginationParams {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    actif?: boolean;
}
