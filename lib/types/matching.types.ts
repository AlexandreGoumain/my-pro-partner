export interface RechercheAcquereur {
    id: string;
    typeBien: string[];
    budgetMin?: number;
    budgetMax?: number;
    surfaceMin?: number;
    surfaceMax?: number;
    nbPiecesMin?: number;
    villesRecherchees: string[];
    criteres?: Record<string, boolean>;
    actif: boolean;
    client: {
        id: string;
        nom: string;
        prenom: string;
        email?: string;
        telephone?: string;
    };
    matchCount?: number;
}

export interface BienMatch {
    id: string;
    reference: string;
    titre: string;
    typeBien: string;
    ville: string;
    prix: number;
    surface: number;
    nbPieces?: number;
    score: number;
    photos?: string[];
}

export interface MatchingFilters {
    ville: string;
    budgetMax: string;
    search: string;
}

export const TYPE_BIEN_LABELS: Record<string, string> = {
    APPARTEMENT: "Appartement",
    MAISON: "Maison",
    TERRAIN: "Terrain",
    LOCAL_COMMERCIAL: "Local commercial",
    IMMEUBLE: "Immeuble",
    PARKING: "Parking",
};
