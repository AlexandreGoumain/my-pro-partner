// Types
export interface Reparation {
    id: string;
    numero: string;
    reference: string | null;
    clientId: string;
    technicienId: string | null;
    storeId: string | null;
    registerId: string | null;
    documentId: string | null;
    typeAppareil: string;
    marque: string | null;
    modele: string | null;
    numeroSerie: string | null;
    motAuthentification: string | null;
    panne: string;
    etatVisuel: string | null;
    accessoires: string | null;
    diagnostic: string | null;
    solutionAppliquee: string | null;
    statut: ReparationStatut;
    priorite: ReparationPriorite;
    dateDepot: Date;
    dateEstimeeRetour: Date | null;
    datePriseEnCharge: Date | null;
    dateRetour: Date | null;
    notesInternes: string | null;
    notesTechnicien: string | null;
    coutMainOeuvre: number;
    coutPieces: number;
    entrepriseId: string;
    createdAt: Date;
    updatedAt: Date;
    client: {
        id: string;
        nom: string;
        prenom: string | null;
        email: string | null;
        telephone: string | null;
    };
    technicien: {
        id: string;
        name: string | null;
        email: string | null;
        prenom: string | null;
    } | null;
    store: {
        id: string;
        nom: string;
    } | null;
    lignesPieces?: ReparationPiece[];
    historique?: ReparationHistorique[];
    _count?: {
        interventions: number;
        historique: number;
    };
}

export interface ReparationPiece {
    id: string;
    reparationId: string;
    articleId: string | null;
    ressourceAtelierId: string | null;
    designation: string;
    quantite: number;
    prixUnitaireHT: number;
    tauxTVA: number;
    article?: {
        id: string;
        nom: string;
        reference: string;
    } | null;
    ressourceAtelier?: {
        id: string;
        nom: string;
    } | null;
}

export interface ReparationHistorique {
    id: string;
    reparationId: string;
    action: string;
    description: string;
    metadata: unknown;
    createdBy: string;
    createdAt: Date;
}

export type ReparationStatut =
    | "DEPOSE"
    | "EN_ATTENTE_DIAGNOSTIC"
    | "EN_DIAGNOSTIC"
    | "DEVIS_ENVOYE"
    | "DEVIS_ACCEPTE"
    | "DEVIS_REFUSE"
    | "EN_ATTENTE_PIECES"
    | "EN_REPARATION"
    | "REPAREE"
    | "PRETE"
    | "RENDUE"
    | "IRREPARABLE"
    | "ABANDONNEE";

export type ReparationPriorite = "BASSE" | "NORMALE" | "HAUTE" | "URGENTE";

export interface ReparationsListResponse {
    items: Reparation[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ReparationCreateData {
    clientId: string;
    typeAppareil: string;
    marque?: string;
    modele?: string;
    numeroSerie?: string;
    motAuthentification?: string;
    panne: string;
    etatVisuel?: string;
    accessoires?: string;
    priorite: ReparationPriorite;
    storeId?: string;
    registerId?: string;
    notesInternes?: string;
    reference?: string;
}

export interface ReparationUpdateData {
    typeAppareil?: string;
    marque?: string;
    modele?: string;
    numeroSerie?: string;
    motAuthentification?: string;
    panne?: string;
    etatVisuel?: string;
    accessoires?: string;
    priorite?: ReparationPriorite;
    dateEstimeeRetour?: Date;
    notesInternes?: string;
    notesTechnicien?: string;
}

export interface ReparationFilters {
    page?: number;
    limit?: number;
    search?: string;
    statut?: ReparationStatut;
    priorite?: ReparationPriorite;
    clientId?: string;
    technicienId?: string;
    storeId?: string;
}

// Query keys
export const reparationKeys = {
    all: ["reparations"] as const,
    lists: () => [...reparationKeys.all, "list"] as const,
    list: (params?: ReparationFilters) =>
        [...reparationKeys.lists(), params] as const,
    details: () => [...reparationKeys.all, "detail"] as const,
    detail: (id: string) => [...reparationKeys.details(), id] as const,
    stats: () => [...reparationKeys.all, "stats"] as const,
};

// Common invalidation keys for mutations
export const baseInvalidateKeys = [
    reparationKeys.all,
    reparationKeys.lists(),
    reparationKeys.stats(),
];
