/**
 * Types pour la gestion de flotte (camionnettes/véhicules)
 */

export interface Camionnette {
    id: string;
    nom?: string | null;
    immatriculation: string;
    marque?: string | null;
    modele?: string | null;
    annee?: number | null;
    actif: boolean;
    dernierePosition?: {
        latitude: number;
        longitude: number;
        timestamp: string;
    } | null;
    dernierEntretien?: string | null;
    prochainEntretien?: string | null;
    kilometres: number;
    plombierPrincipal?: {
        name: string | null;
    } | null;
    plombierPrincipalId?: string | null;
    _count?: {
        stock: number;
        entretiens?: number;
    };
    createdAt: string;
    updatedAt: string;
}

export interface CamionnetteCreateInput {
    immatriculation: string;
    nom?: string;
    marque?: string;
    modele?: string;
    annee?: number;
    plombierPrincipalId?: string;
    kilometres?: number;
}

export interface CamionnetteUpdateInput {
    nom?: string;
    immatriculation?: string;
    marque?: string;
    modele?: string;
    annee?: number;
    plombierPrincipalId?: string | null;
    actif?: boolean;
    kilometres?: number;
    prochainEntretien?: string;
}

export interface FlotteStats {
    total: number;
    actifs: number;
    inactifs: number;
    entretiensProches: number;
}

// Types pour les entretiens de véhicules
export type TypeEntretienVehicule =
    | "VIDANGE"
    | "REVISION"
    | "PNEUS"
    | "FREINS"
    | "CONTROLE_TECHNIQUE"
    | "REPARATION"
    | "AUTRE";

export const TYPE_ENTRETIEN_LABELS: Record<TypeEntretienVehicule, string> = {
    VIDANGE: "Vidange",
    REVISION: "Révision",
    PNEUS: "Pneus",
    FREINS: "Freins",
    CONTROLE_TECHNIQUE: "Contrôle technique",
    REPARATION: "Réparation",
    AUTRE: "Autre",
};

export interface EntretienVehicule {
    id: string;
    camionnetteId: string;
    camionnette?: {
        id: string;
        immatriculation: string;
        marque?: string | null;
        modele?: string | null;
    };
    type: TypeEntretienVehicule;
    description?: string | null;
    kilometrage?: number | null;
    cout?: number | null;
    dateEntretien: string;
    dateProchain?: string | null;
    prestataire?: string | null;
    numeroFacture?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface EntretienVehiculeCreateInput {
    camionnetteId: string;
    type: TypeEntretienVehicule;
    description?: string;
    kilometrage?: number;
    cout?: number;
    dateEntretien: string;
    dateProchain?: string;
    prestataire?: string;
    numeroFacture?: string;
    notes?: string;
}

export interface EntretienVehiculeUpdateInput {
    type?: TypeEntretienVehicule;
    description?: string;
    kilometrage?: number;
    cout?: number;
    dateEntretien?: string;
    dateProchain?: string;
    prestataire?: string;
    numeroFacture?: string;
    notes?: string;
}
