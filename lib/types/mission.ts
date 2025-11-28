/**
 * Types pour les missions de consulting (SERVICE_INTELLECTUEL)
 */

// ============================================
// ENUMS
// ============================================

export const TYPE_FACTURATION = ["FORFAIT", "REGIE", "MIXTE"] as const;
export type TypeFacturation = (typeof TYPE_FACTURATION)[number];

export const STATUT_MISSION = [
    "PROPOSITION",
    "VALIDEE",
    "EN_COURS",
    "LIVREE",
    "FACTUREE",
    "CLOTUREE",
    "ANNULEE",
] as const;
export type StatutMission = (typeof STATUT_MISSION)[number];

// ============================================
// INTERFACES
// ============================================

export interface Mission {
    id: string;
    numero: string;
    nom: string;
    description?: string | null;

    // Client
    clientId: string;
    client: {
        id: string;
        nom: string;
        prenom?: string | null;
        email?: string | null;
        telephone?: string | null;
    };

    // Billing
    typeFact: TypeFacturation;
    montantForfait?: number | null;
    tauxHoraire?: number | null;
    budgetHeures?: number | null; // in minutes

    // Scheduling
    dateDebut?: string | null;
    dateFin?: string | null;
    dateEcheance?: string | null;

    // Status
    statut: StatutMission;

    // Calculated totals
    totalHeures: number; // in minutes
    totalFacturable: number; // in minutes
    totalMontant: number;

    // Links
    devisId?: string | null;

    // Metadata
    createdAt: string;
    updatedAt: string;
}

export interface MissionWithDetails extends Mission {
    entreesTemps?: EntreeTemps[];
    _count?: {
        entreesTemps: number;
    };
}

export interface MissionCreateInput {
    nom: string;
    description?: string;
    clientId: string;
    typeFact: TypeFacturation;
    montantForfait?: number;
    tauxHoraire?: number;
    budgetHeures?: number; // in minutes
    dateDebut?: string;
    dateFin?: string;
    dateEcheance?: string;
    devisId?: string;
}

export interface MissionUpdateInput {
    nom?: string;
    description?: string;
    clientId?: string;
    typeFact?: TypeFacturation;
    montantForfait?: number;
    tauxHoraire?: number;
    budgetHeures?: number;
    dateDebut?: string;
    dateFin?: string;
    dateEcheance?: string;
    statut?: StatutMission;
}

export interface MissionFilters {
    search?: string;
    statut?: StatutMission | StatutMission[];
    clientId?: string;
    typeFact?: TypeFacturation;
    dateDebut?: string;
    dateFin?: string;
}

export interface MissionStats {
    total: number;
    enCours: number;
    aFacturer: number; // LIVREE status
    totalMontant: number;
    heuresNonFacturees: number; // minutes
}

// ============================================
// ENTREE TEMPS (TIME ENTRY)
// ============================================

export interface EntreeTemps {
    id: string;
    missionId: string;
    mission?: {
        id: string;
        numero: string;
        nom: string;
        client: {
            id: string;
            nom: string;
        };
    };
    userId: string;
    user?: {
        id: string;
        name?: string | null;
        email: string;
    };

    date: string;
    duree: number; // in minutes
    description: string;

    facturable: boolean;
    tauxHoraire: number;
    montant: number;

    facturee: boolean;
    factureId?: string | null;

    timerStart?: string | null;
    timerEnd?: string | null;

    createdAt: string;
    updatedAt: string;
}

export interface EntreeTempsCreateInput {
    missionId: string;
    date: string;
    duree: number; // in minutes
    description: string;
    facturable?: boolean;
    tauxHoraire?: number; // optional, will use mission rate if not provided
}

export interface EntreeTempsUpdateInput {
    date?: string;
    duree?: number;
    description?: string;
    facturable?: boolean;
    tauxHoraire?: number;
}

export interface EntreeTempsFilters {
    missionId?: string;
    userId?: string;
    dateDebut?: string;
    dateFin?: string;
    facturable?: boolean;
    facturee?: boolean;
}

export interface TimerStartInput {
    missionId: string;
    description?: string;
}

export interface TimerStopInput {
    entreeTempsId: string;
    description?: string;
}

// ============================================
// TIMESHEET
// ============================================

export interface TimesheetDay {
    date: string;
    entries: EntreeTemps[];
    totalMinutes: number;
    totalFacturable: number;
}

export interface TimesheetWeek {
    weekStart: string;
    weekEnd: string;
    days: TimesheetDay[];
    totalMinutes: number;
    totalFacturable: number;
    objectifMinutes?: number;
}

// ============================================
// CONSULTING STATS / KPIs
// ============================================

export interface ConsultingStats {
    // Utilization
    heuresDisponibles: number; // minutes in period
    heuresTracked: number; // minutes
    heuresFacturables: number; // minutes
    tauxUtilisation: number; // percentage (0-100)

    // Revenue
    caFacture: number; // invoiced amount
    caPotentiel: number; // amount from uninvoiced time
    revenuParHeure: number;

    // Missions
    missionsEnCours: number;
    missionsAFacturer: number;
    pipelineValeur: number; // value of proposals

    // Time to invoice
    heuresNonFacturees: number; // minutes
    montantNonFacture: number;
}

export interface ConsultingDashboardData {
    stats: ConsultingStats;
    missionsRecentes: Mission[];
    entreesRecentes: EntreeTemps[];
    utilisationSemaine: {
        date: string;
        heures: number;
        facturable: number;
    }[];
}

// ============================================
// LABELS
// ============================================

export const TYPE_FACTURATION_LABELS: Record<TypeFacturation, string> = {
    FORFAIT: "Forfait",
    REGIE: "Régie (horaire)",
    MIXTE: "Mixte",
};

export const TYPE_FACTURATION_DESCRIPTIONS: Record<TypeFacturation, string> = {
    FORFAIT: "Montant fixe pour la mission complète",
    REGIE: "Facturation basée sur les heures réellement passées",
    MIXTE: "Forfait de base + dépassements horaires",
};

export const STATUT_MISSION_LABELS: Record<StatutMission, string> = {
    PROPOSITION: "Proposition",
    VALIDEE: "Validée",
    EN_COURS: "En cours",
    LIVREE: "Livrée",
    FACTUREE: "Facturée",
    CLOTUREE: "Clôturée",
    ANNULEE: "Annulée",
};

export const STATUT_MISSION_COLORS: Record<StatutMission, string> = {
    PROPOSITION: "bg-black/5 text-black/60",
    VALIDEE: "bg-black/10 text-black/80",
    EN_COURS: "bg-black/20 text-black",
    LIVREE: "bg-black/30 text-black",
    FACTUREE: "bg-black/40 text-white",
    CLOTUREE: "bg-black/60 text-white",
    ANNULEE: "bg-black/10 text-black/40",
};

// Workflow: which statuses can transition to which
export const STATUT_MISSION_TRANSITIONS: Record<
    StatutMission,
    StatutMission[]
> = {
    PROPOSITION: ["VALIDEE", "ANNULEE"],
    VALIDEE: ["EN_COURS", "ANNULEE"],
    EN_COURS: ["LIVREE", "ANNULEE"],
    LIVREE: ["FACTUREE", "EN_COURS"], // can go back to EN_COURS if more work needed
    FACTUREE: ["CLOTUREE"],
    CLOTUREE: [], // terminal state
    ANNULEE: [], // terminal state
};

// ============================================
// HELPERS
// ============================================

// Re-export from centralized format utilities
export { formatDuree, formatDureeDecimal } from "@/lib/utils/format";

/**
 * Parse "HH:MM" string to minutes
 */
export function parseHHMMToMinutes(hhMm: string): number {
    const [hours, mins] = hhMm.split(":").map(Number);
    return (hours || 0) * 60 + (mins || 0);
}

/**
 * Convert minutes to "HH:MM" string
 */
export function minutesToHHMM(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

/**
 * Calculate progress percentage for budget hours
 */
export function calculateBudgetProgress(
    totalMinutes: number,
    budgetMinutes: number | null | undefined
): number | null {
    if (!budgetMinutes || budgetMinutes <= 0) return null;
    return Math.round((totalMinutes / budgetMinutes) * 100);
}

/**
 * Check if a status transition is valid
 */
export function canTransitionTo(
    currentStatut: StatutMission,
    targetStatut: StatutMission
): boolean {
    return STATUT_MISSION_TRANSITIONS[currentStatut].includes(targetStatut);
}

// ============================================
// COMPTABILITE - TYPES SPECIFIQUES
// ============================================

export const TYPE_DOSSIER_COMPTABLE = [
    "BILAN",
    "LIASSE_FISCALE",
    "TVA",
    "IS",
    "IR",
    "PAIE",
    "SOCIAL",
    "COMPTABILITE",
    "CONSEIL",
    "AUDIT",
    "JURIDIQUE",
    "AUTRE",
] as const;
export type TypeDossierComptable = (typeof TYPE_DOSSIER_COMPTABLE)[number];

export const PERIODICITE_ECHEANCE = [
    "PONCTUEL",
    "MENSUEL",
    "TRIMESTRIEL",
    "SEMESTRIEL",
    "ANNUEL",
] as const;
export type PeriodiciteEcheance = (typeof PERIODICITE_ECHEANCE)[number];

export const STATUT_ECHEANCE = [
    "A_VENIR",
    "EN_COURS",
    "PRET",
    "DEPOSE",
    "VALIDE",
    "EN_RETARD",
] as const;
export type StatutEcheance = (typeof STATUT_ECHEANCE)[number];

// Labels
export const TYPE_DOSSIER_LABELS: Record<TypeDossierComptable, string> = {
    BILAN: "Bilan annuel",
    LIASSE_FISCALE: "Liasse fiscale",
    TVA: "Déclaration TVA",
    IS: "Impôt sur les sociétés",
    IR: "Impôt sur le revenu",
    PAIE: "Gestion de la paie",
    SOCIAL: "Déclarations sociales",
    COMPTABILITE: "Tenue comptable",
    CONSEIL: "Mission de conseil",
    AUDIT: "Audit / Révision",
    JURIDIQUE: "Missions juridiques",
    AUTRE: "Autre",
};

export const PERIODICITE_LABELS: Record<PeriodiciteEcheance, string> = {
    PONCTUEL: "Ponctuel",
    MENSUEL: "Mensuel",
    TRIMESTRIEL: "Trimestriel",
    SEMESTRIEL: "Semestriel",
    ANNUEL: "Annuel",
};

export const STATUT_ECHEANCE_LABELS: Record<StatutEcheance, string> = {
    A_VENIR: "À venir",
    EN_COURS: "En cours",
    PRET: "Prêt",
    DEPOSE: "Déposé",
    VALIDE: "Validé",
    EN_RETARD: "En retard",
};

export const STATUT_ECHEANCE_COLORS: Record<StatutEcheance, string> = {
    A_VENIR: "bg-black/5 text-black/60",
    EN_COURS: "bg-black/10 text-black/80",
    PRET: "bg-black/20 text-black",
    DEPOSE: "bg-black/30 text-black",
    VALIDE: "bg-black/60 text-white",
    EN_RETARD: "bg-red-100 text-red-800",
};

// ============================================
// ECHEANCE FISCALE INTERFACES
// ============================================

export interface EcheanceFiscale {
    id: string;
    missionId: string;
    mission?: {
        id: string;
        numero: string;
        nom: string;
    };
    clientId: string;
    client?: {
        id: string;
        nom: string;
        prenom?: string | null;
    };

    type: TypeDossierComptable;
    libelle: string;

    dateEcheance: string;
    dateRealisation?: string | null;
    dateDepot?: string | null;

    statut: StatutEcheance;
    periodicite: PeriodiciteEcheance;

    exerciceFiscal?: string | null;
    periodeDebut?: string | null;
    periodeFin?: string | null;
    montant?: number | null;
    reference?: string | null;
    notes?: string | null;

    rappelEnvoye: boolean;
    dateRappel?: string | null;

    createdAt: string;
    updatedAt: string;
}

export interface EcheanceFiscaleCreateInput {
    missionId: string;
    clientId: string;
    type: TypeDossierComptable;
    libelle: string;
    dateEcheance: string;
    periodicite?: PeriodiciteEcheance;
    exerciceFiscal?: string;
    periodeDebut?: string;
    periodeFin?: string;
    montant?: number;
    notes?: string;
}

export interface EcheanceFiscaleUpdateInput {
    type?: TypeDossierComptable;
    libelle?: string;
    dateEcheance?: string;
    dateRealisation?: string;
    dateDepot?: string;
    statut?: StatutEcheance;
    periodicite?: PeriodiciteEcheance;
    exerciceFiscal?: string;
    periodeDebut?: string;
    periodeFin?: string;
    montant?: number;
    reference?: string;
    notes?: string;
    rappelEnvoye?: boolean;
    dateRappel?: string;
}

export interface EcheanceFiscaleFilters {
    search?: string;
    type?: TypeDossierComptable | TypeDossierComptable[];
    statut?: StatutEcheance | StatutEcheance[];
    clientId?: string;
    missionId?: string;
    dateDebut?: string;
    dateFin?: string;
    periode?: "avenir" | "retard" | "semaine" | "mois";
}

export interface EcheancesStats {
    total: number;
    aVenir: number;
    enCours: number;
    enRetard: number;
    deposees: number;
    prochaine?: EcheanceFiscale | null;
}

// ============================================
// MISSION EXTENDED FOR COMPTABILITE
// ============================================

export interface MissionComptable extends Mission {
    typeDossier?: TypeDossierComptable | null;
    periodicite?: PeriodiciteEcheance | null;
    exerciceFiscal?: string | null;
    anneeReference?: number | null;
    echeances?: EcheanceFiscale[];
}

export interface MissionComptableCreateInput extends MissionCreateInput {
    typeDossier?: TypeDossierComptable;
    periodicite?: PeriodiciteEcheance;
    exerciceFiscal?: string;
    anneeReference?: number;
}

export interface MissionComptableUpdateInput extends MissionUpdateInput {
    typeDossier?: TypeDossierComptable;
    periodicite?: PeriodiciteEcheance;
    exerciceFiscal?: string;
    anneeReference?: number;
}

// ============================================
// CLIENT COMPTABLE - INFORMATIONS FISCALES
// ============================================

export const REGIME_FISCAL = [
    "REEL_NORMAL",
    "REEL_SIMPLIFIE",
    "MICRO",
] as const;
export type RegimeFiscal = (typeof REGIME_FISCAL)[number];

export const REGIME_TVA = [
    "MENSUEL",
    "TRIMESTRIEL",
    "ANNUEL",
    "FRANCHISE",
] as const;
export type RegimeTVA = (typeof REGIME_TVA)[number];

export const FORME_JURIDIQUE = [
    "SARL",
    "SAS",
    "SA",
    "EURL",
    "SASU",
    "EI",
    "EIRL",
    "SCI",
    "SNC",
    "ASSOCIATION",
    "AUTRE",
] as const;
export type FormeJuridique = (typeof FORME_JURIDIQUE)[number];

export const TYPE_IMPOSITION = ["IS", "IR"] as const;
export type TypeImposition = (typeof TYPE_IMPOSITION)[number];

export const REGIME_FISCAL_LABELS: Record<RegimeFiscal, string> = {
    REEL_NORMAL: "Réel normal",
    REEL_SIMPLIFIE: "Réel simplifié",
    MICRO: "Micro-entreprise",
};

export const REGIME_TVA_LABELS: Record<RegimeTVA, string> = {
    MENSUEL: "TVA mensuelle (CA3)",
    TRIMESTRIEL: "TVA trimestrielle",
    ANNUEL: "TVA annuelle (CA12)",
    FRANCHISE: "Franchise en base",
};

export const FORME_JURIDIQUE_LABELS: Record<FormeJuridique, string> = {
    SARL: "SARL",
    SAS: "SAS",
    SA: "SA",
    EURL: "EURL",
    SASU: "SASU",
    EI: "Entreprise Individuelle",
    EIRL: "EIRL",
    SCI: "SCI",
    SNC: "SNC",
    ASSOCIATION: "Association",
    AUTRE: "Autre",
};

export const TYPE_IMPOSITION_LABELS: Record<TypeImposition, string> = {
    IS: "Impôt sur les Sociétés (IS)",
    IR: "Impôt sur le Revenu (IR)",
};

export interface ClientInfoFiscale {
    siret?: string | null;
    formeJuridique?: FormeJuridique | null;
    regimeFiscal?: RegimeFiscal | null;
    regimeTVA?: RegimeTVA | null;
    typeImposition?: TypeImposition | null;
    dateClotureExercice?: string | null;
    avecSalaries?: boolean | null;
    effectif?: number | null;
    codeAPE?: string | null;
    numTVAIntra?: string | null;
}

export interface ClientComptableUpdateInput {
    siret?: string;
    formeJuridique?: FormeJuridique;
    regimeFiscal?: RegimeFiscal;
    regimeTVA?: RegimeTVA;
    typeImposition?: TypeImposition;
    dateClotureExercice?: string;
    avecSalaries?: boolean;
    effectif?: number;
    codeAPE?: string;
    numTVAIntra?: string;
}
