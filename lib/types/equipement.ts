/**
 * Types pour le parc équipements clients (Chauffage/Plomberie)
 */

import { TypeEquipement } from "./intervention";

// Type d'énergie
export const TYPE_ENERGIE = [
    "GAZ_NATUREL",
    "GAZ_PROPANE",
    "FIOUL",
    "ELECTRICITE",
    "BOIS_BUCHES",
    "BOIS_GRANULES",
    "POMPE_CHALEUR",
    "SOLAIRE",
    "GEOTHERMIE",
] as const;

export type TypeEnergie = (typeof TYPE_ENERGIE)[number];

// Statut équipement
export const STATUT_EQUIPEMENT = [
    "EN_SERVICE",
    "EN_PANNE",
    "A_REMPLACER",
    "HORS_SERVICE",
    "EN_ATTENTE_PIECE",
] as const;

export type StatutEquipement = (typeof STATUT_EQUIPEMENT)[number];

// Labels
export const TYPE_ENERGIE_LABELS: Record<TypeEnergie, string> = {
    GAZ_NATUREL: "Gaz naturel",
    GAZ_PROPANE: "Gaz propane (GPL)",
    FIOUL: "Fioul",
    ELECTRICITE: "Électricité",
    BOIS_BUCHES: "Bois bûches",
    BOIS_GRANULES: "Bois granulés (pellets)",
    POMPE_CHALEUR: "Pompe à chaleur",
    SOLAIRE: "Solaire thermique",
    GEOTHERMIE: "Géothermie",
};

export const STATUT_EQUIPEMENT_LABELS: Record<StatutEquipement, string> = {
    EN_SERVICE: "En service",
    EN_PANNE: "En panne",
    A_REMPLACER: "À remplacer",
    HORS_SERVICE: "Hors service",
    EN_ATTENTE_PIECE: "En attente de pièce",
};

export const STATUT_EQUIPEMENT_COLORS: Record<StatutEquipement, string> = {
    EN_SERVICE: "bg-emerald-100 text-emerald-800",
    EN_PANNE: "bg-red-100 text-red-800",
    A_REMPLACER: "bg-orange-100 text-orange-800",
    HORS_SERVICE: "bg-black/10 text-black/60",
    EN_ATTENTE_PIECE: "bg-yellow-100 text-yellow-800",
};

// Équipements nécessitant un contrôle annuel obligatoire
export const EQUIPEMENTS_CONTROLE_OBLIGATOIRE: TypeEquipement[] = [
    "CHAUDIERE_GAZ",
    "CHAUDIERE_FIOUL",
    "CHAUDIERE_BOIS",
];

// Interface EquipementClient
export interface EquipementClient {
    id: string;
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
    type: TypeEquipement;
    marque: string;
    modele?: string | null;
    numeroSerie?: string | null;
    puissanceKw?: number | null;
    typeEnergie?: TypeEnergie | null;
    dateInstallation?: string | null;
    dateMiseEnService?: string | null;
    installePar?: string | null;
    garantieJusquau?: string | null;
    emplacement?: string | null;
    adresse?: string | null;
    codePostal?: string | null;
    ville?: string | null;
    accessibilite?: string | null;
    statut: StatutEquipement;
    dernierEntretien?: string | null;
    prochainEntretien?: string | null;
    controleObligatoire: boolean;
    frequenceControleAnnuel: number;
    dernierControleAnnuel?: string | null;
    prochainControleAnnuel?: string | null;
    certificatValide: boolean;
    rendementPourcent?: number | null;
    emissionsCO?: number | null;
    dateReleve?: string | null;
    notes?: string | null;
    documentsUrls?: string[] | null;
    createdAt: string;
    updatedAt: string;
}

export interface EquipementCreateInput {
    clientId: string;
    type: TypeEquipement;
    marque: string;
    modele?: string;
    numeroSerie?: string;
    puissanceKw?: number;
    typeEnergie?: TypeEnergie;
    dateInstallation?: string;
    dateMiseEnService?: string;
    installePar?: string;
    garantieJusquau?: string;
    emplacement?: string;
    adresse?: string;
    codePostal?: string;
    ville?: string;
    accessibilite?: string;
    controleObligatoire?: boolean;
    frequenceControleAnnuel?: number;
    notes?: string;
}

export interface EquipementUpdateInput extends Partial<EquipementCreateInput> {
    statut?: StatutEquipement;
    dernierEntretien?: string;
    prochainEntretien?: string;
    dernierControleAnnuel?: string;
    prochainControleAnnuel?: string;
    certificatValide?: boolean;
    rendementPourcent?: number;
    emissionsCO?: number;
}

export interface EquipementStats {
    total: number;
    enService: number;
    enPanne: number;
    aRemplacer: number;
    controlesAVenir: number; // Dans les 30 prochains jours
    controlesEnRetard: number;
    certificatsExpires: number;
}

// Interface CertificatEntretien
export interface CertificatEntretien {
    id: string;
    numero: string;
    equipementId: string;
    equipement?: EquipementClient;
    dateIntervention: string;
    dateValidite: string;
    technicienId?: string | null;
    nomTechnicien: string;
    // Equipment snapshot
    typeEquipement: string;
    marque: string;
    modele?: string | null;
    numeroSerie?: string | null;
    puissanceKw?: number | null;
    typeEnergie?: string | null;
    anneeInstallation?: number | null;
    // Measurements
    temperatureFumees?: number | null;
    temperatureAmbiante?: number | null;
    tauxCO?: number | null;
    tauxCO2?: number | null;
    rendementCombustion?: number | null;
    tirage?: number | null;
    pressionGaz?: number | null;
    debitGaz?: number | null;
    // Checklist
    verificationBruleur: boolean;
    verificationVeilleuse: boolean;
    nettoyageCorpChauffe: boolean;
    verificationEtancheite: boolean;
    verificationEvacuation: boolean;
    verificationVentilation: boolean;
    verificationSecurites: boolean;
    verificationRegulation: boolean;
    nettoyageConduitFumee: boolean;
    controleCircuitEau: boolean;
    controleVaseExpansion: boolean;
    controleCirculateur: boolean;
    purgeRadiateurs: boolean;
    // Observations
    anomaliesConstatees?: string | null;
    recommandations?: string | null;
    travauxPreconises?: string | null;
    observationsGenerales?: string | null;
    // Compliance
    conformeReglementation: boolean;
    motifNonConformite?: string | null;
    dangerImmediat: boolean;
    // Signature
    signatureClient?: string | null;
    dateSignature?: string | null;
    nomSignataire?: string | null;
    // PDF
    pdfUrl?: string | null;
    envoiClient: boolean;
    dateEnvoiClient?: string | null;
    createdAt: string;
}

export interface CertificatCreateInput {
    equipementId: string;
    dateIntervention: string;
    technicienId?: string;
    nomTechnicien: string;
    // Measurements
    temperatureFumees?: number;
    temperatureAmbiante?: number;
    tauxCO?: number;
    tauxCO2?: number;
    rendementCombustion?: number;
    tirage?: number;
    pressionGaz?: number;
    debitGaz?: number;
    // Checklist
    verificationBruleur?: boolean;
    verificationVeilleuse?: boolean;
    nettoyageCorpChauffe?: boolean;
    verificationEtancheite?: boolean;
    verificationEvacuation?: boolean;
    verificationVentilation?: boolean;
    verificationSecurites?: boolean;
    verificationRegulation?: boolean;
    nettoyageConduitFumee?: boolean;
    controleCircuitEau?: boolean;
    controleVaseExpansion?: boolean;
    controleCirculateur?: boolean;
    purgeRadiateurs?: boolean;
    // Observations
    anomaliesConstatees?: string;
    recommandations?: string;
    travauxPreconises?: string;
    observationsGenerales?: string;
    // Compliance
    conformeReglementation?: boolean;
    motifNonConformite?: string;
    dangerImmediat?: boolean;
    // Signature
    signatureClient?: string;
    nomSignataire?: string;
}

// Entretiens à planifier (vue dashboard)
export interface EntretienAPlanifier {
    id: string;
    equipementId: string;
    type: "CONTROLE_ANNUEL" | "ENTRETIEN" | "GARANTIE_EXPIRE";
    dateEcheance: string;
    joursRestants: number;
    enRetard: boolean;
    client: {
        id: string;
        nom: string;
        prenom?: string | null;
        telephone?: string | null;
        adresse?: string | null;
        ville?: string | null;
    };
    equipement: {
        type: TypeEquipement;
        marque: string;
        modele?: string | null;
    };
}
