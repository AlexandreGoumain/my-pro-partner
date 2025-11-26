/**
 * Types pour les contrats d'entretien
 */

export type TypeContratEntretien =
    // Chauffage
    | "CHAUDIERE_GAZ"
    | "CHAUDIERE_FIOUL"
    | "POMPE_A_CHALEUR"
    | "CLIMATISATION"
    | "PLANCHER_CHAUFFANT"
    // Plomberie
    | "ADOUCISSEUR"
    | "PLOMBERIE_GENERAL"
    // Commun
    | "MULTI_EQUIPEMENTS"
    | "PERSONNALISE";

export type StatutContrat =
    | "ACTIF"
    | "EXPIRE"
    | "RESILIE"
    | "EN_ATTENTE"
    | "SUSPENDU";

export type PeriodiciteContrat =
    | "MENSUEL"
    | "TRIMESTRIEL"
    | "SEMESTRIEL"
    | "ANNUEL";

export const TYPE_CONTRAT_LABELS: Record<TypeContratEntretien, string> = {
    // Chauffage
    CHAUDIERE_GAZ: "Chaudière gaz",
    CHAUDIERE_FIOUL: "Chaudière fioul",
    POMPE_A_CHALEUR: "Pompe à chaleur",
    CLIMATISATION: "Climatisation",
    PLANCHER_CHAUFFANT: "Plancher chauffant",
    // Plomberie
    ADOUCISSEUR: "Adoucisseur",
    PLOMBERIE_GENERAL: "Plomberie générale",
    // Commun
    MULTI_EQUIPEMENTS: "Multi-équipements",
    PERSONNALISE: "Personnalisé",
};

// Groupes de contrats par métier
export const CONTRATS_PAR_METIER = {
    CHAUFFAGE: [
        "CHAUDIERE_GAZ",
        "CHAUDIERE_FIOUL",
        "POMPE_A_CHALEUR",
        "CLIMATISATION",
        "PLANCHER_CHAUFFANT",
        "MULTI_EQUIPEMENTS",
        "PERSONNALISE",
    ],
    PLOMBERIE: [
        "ADOUCISSEUR",
        "PLOMBERIE_GENERAL",
        "MULTI_EQUIPEMENTS",
        "PERSONNALISE",
    ],
} as const;

export const STATUT_CONTRAT_LABELS: Record<StatutContrat, string> = {
    ACTIF: "Actif",
    EXPIRE: "Expiré",
    RESILIE: "Résilié",
    EN_ATTENTE: "En attente",
    SUSPENDU: "Suspendu",
};

export const PERIODICITE_LABELS: Record<PeriodiciteContrat, string> = {
    MENSUEL: "Mensuel",
    TRIMESTRIEL: "Trimestriel",
    SEMESTRIEL: "Semestriel",
    ANNUEL: "Annuel",
};

export interface Equipement {
    type: string;
    marque?: string;
    modele?: string;
    numeroSerie?: string;
    dateInstallation?: string;
}

export interface ContratEntretien {
    id: string;
    numero: string;
    reference?: string | null;
    clientId: string;
    client?: {
        id: string;
        nom: string;
        prenom?: string | null;
        telephone?: string | null;
        email?: string | null;
        adresse?: string | null;
        codePostal?: string | null;
        ville?: string | null;
    };
    typeContrat: TypeContratEntretien;
    nom: string;
    description?: string | null;
    equipements: Equipement[];
    adresse: string;
    codePostal: string;
    ville: string;
    dateDebut: string;
    dateFin: string;
    dureeAnnees: number;
    statut: StatutContrat;
    montantHT: number;
    montantTTC: number;
    periodicite: PeriodiciteContrat;
    prochainPaiement?: string | null;
    facturationAuto: boolean;
    jourFacturation?: number | null;
    nombreRevisionsAn: number;
    interventionsIncluses: number;
    interventionsUtilisees: number;
    tarifHoraire?: number | null;
    remisePieces: number;
    rappelAvantJours: number;
    derniereRevision?: string | null;
    prochaineRevision?: string | null;
    notes?: string | null;
    clausesParticulieres?: string | null;
    renouvellementAuto: boolean;
    dateResiliation?: string | null;
    motifResiliation?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ContratCreateInput {
    clientId: string;
    typeContrat: TypeContratEntretien;
    nom: string;
    description?: string;
    equipements: Equipement[];
    adresse: string;
    codePostal: string;
    ville: string;
    dateDebut: string;
    dateFin: string;
    dureeAnnees?: number;
    montantHT: number;
    montantTTC: number;
    periodicite?: PeriodiciteContrat;
    nombreRevisionsAn?: number;
    interventionsIncluses?: number;
    tarifHoraire?: number;
    remisePieces?: number;
    rappelAvantJours?: number;
    renouvellementAuto?: boolean;
    notes?: string;
}

export interface ContratUpdateInput {
    typeContrat?: TypeContratEntretien;
    nom?: string;
    description?: string;
    equipements?: Equipement[];
    adresse?: string;
    codePostal?: string;
    ville?: string;
    dateDebut?: string;
    dateFin?: string;
    dureeAnnees?: number;
    statut?: StatutContrat;
    montantHT?: number;
    montantTTC?: number;
    periodicite?: PeriodiciteContrat;
    nombreRevisionsAn?: number;
    interventionsIncluses?: number;
    tarifHoraire?: number;
    remisePieces?: number;
    rappelAvantJours?: number;
    renouvellementAuto?: boolean;
    notes?: string;
    clausesParticulieres?: string;
}

export interface ContratStats {
    total: number;
    actifs: number;
    revisionsDuMois: number;
    revenusRecurrents: number;
}
