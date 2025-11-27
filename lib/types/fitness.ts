// Types TypeScript pour le module FITNESS

// ============================================
// ENUMS (miroir des enums Prisma)
// ============================================

export type StatutAbonnementFitness =
    | "ACTIF"
    | "SUSPENDU"
    | "EXPIRE"
    | "RESILIE"
    | "EN_ATTENTE";

export type PeriodiciteFitness =
    | "JOURNALIER"
    | "HEBDOMADAIRE"
    | "MENSUEL"
    | "TRIMESTRIEL"
    | "SEMESTRIEL"
    | "ANNUEL"
    | "ILLIMITE";

export type NiveauCours =
    | "DEBUTANT"
    | "INTERMEDIAIRE"
    | "AVANCE"
    | "TOUS_NIVEAUX";

export type StatutSeanceCours =
    | "PLANIFIEE"
    | "EN_COURS"
    | "TERMINEE"
    | "ANNULEE"
    | "COMPLETE";

export type StatutReservationCours =
    | "CONFIRMEE"
    | "EN_ATTENTE"
    | "ANNULEE"
    | "NO_SHOW"
    | "PRESENTE";

export type TypeSalleFitness =
    | "MUSCULATION"
    | "CARDIO"
    | "COURS_COLLECTIF"
    | "PISCINE"
    | "SAUNA"
    | "VESTIAIRE"
    | "CROSSFIT"
    | "YOGA"
    | "SPINNING"
    | "BOXE"
    | "AUTRE";

export type TypeAccesFitness = "ENTREE" | "SORTIE" | "COURS" | "ESPACE_PREMIUM";

// ============================================
// LABELS pour l'affichage
// ============================================

export const STATUT_ABONNEMENT_LABELS: Record<StatutAbonnementFitness, string> =
    {
        ACTIF: "Actif",
        SUSPENDU: "Suspendu",
        EXPIRE: "Expiré",
        RESILIE: "Résilié",
        EN_ATTENTE: "En attente",
    };

export const PERIODICITE_LABELS: Record<PeriodiciteFitness, string> = {
    JOURNALIER: "Journalier",
    HEBDOMADAIRE: "Hebdomadaire",
    MENSUEL: "Mensuel",
    TRIMESTRIEL: "Trimestriel",
    SEMESTRIEL: "Semestriel",
    ANNUEL: "Annuel",
    ILLIMITE: "Illimité",
};

export const NIVEAU_COURS_LABELS: Record<NiveauCours, string> = {
    DEBUTANT: "Débutant",
    INTERMEDIAIRE: "Intermédiaire",
    AVANCE: "Avancé",
    TOUS_NIVEAUX: "Tous niveaux",
};

export const STATUT_SEANCE_LABELS: Record<StatutSeanceCours, string> = {
    PLANIFIEE: "Planifiée",
    EN_COURS: "En cours",
    TERMINEE: "Terminée",
    ANNULEE: "Annulée",
    COMPLETE: "Complète",
};

export const STATUT_RESERVATION_LABELS: Record<StatutReservationCours, string> =
    {
        CONFIRMEE: "Confirmée",
        EN_ATTENTE: "Liste d'attente",
        ANNULEE: "Annulée",
        NO_SHOW: "Absent",
        PRESENTE: "Présent",
    };

export const TYPE_SALLE_LABELS: Record<TypeSalleFitness, string> = {
    MUSCULATION: "Musculation",
    CARDIO: "Cardio",
    COURS_COLLECTIF: "Cours collectifs",
    PISCINE: "Piscine",
    SAUNA: "Sauna / Hammam",
    VESTIAIRE: "Vestiaires",
    CROSSFIT: "CrossFit",
    YOGA: "Yoga / Pilates",
    SPINNING: "Spinning",
    BOXE: "Boxe",
    AUTRE: "Autre",
};

export const TYPE_ACCES_LABELS: Record<TypeAccesFitness, string> = {
    ENTREE: "Entrée",
    SORTIE: "Sortie",
    COURS: "Cours",
    ESPACE_PREMIUM: "Zone Premium",
};

// ============================================
// CATEGORIES DE COURS (pour regroupement)
// ============================================

export const CATEGORIES_COURS = [
    { value: "cardio", label: "Cardio" },
    { value: "renforcement", label: "Renforcement musculaire" },
    { value: "bien-etre", label: "Bien-être" },
    { value: "danse", label: "Danse" },
    { value: "aquatique", label: "Aquatique" },
    { value: "combat", label: "Sports de combat" },
    { value: "stretching", label: "Stretching / Mobilité" },
] as const;

// ============================================
// SPECIALITES COACH
// ============================================

export const SPECIALITES_COACH = [
    { value: "musculation", label: "Musculation" },
    { value: "cardio", label: "Cardio Training" },
    { value: "yoga", label: "Yoga" },
    { value: "pilates", label: "Pilates" },
    { value: "crossfit", label: "CrossFit" },
    { value: "boxe", label: "Boxe / Kickboxing" },
    { value: "natation", label: "Natation" },
    { value: "danse", label: "Danse Fitness" },
    { value: "cycling", label: "Cycling / Spinning" },
    { value: "nutrition", label: "Nutrition" },
    { value: "coaching_perso", label: "Coaching Personnel" },
    { value: "stretching", label: "Stretching" },
    { value: "hiit", label: "HIIT" },
    { value: "trx", label: "TRX" },
] as const;

// ============================================
// INTERFACES
// ============================================

export interface TypeAbonnementFitness {
    id: string;
    nom: string;
    description: string | null;
    prix: number;
    periodicite: PeriodiciteFitness;
    dureeJours: number | null;
    nombreSeances: number | null;
    accesIllimite: boolean;
    nombreAccesSemaine: number | null;
    accesCours: boolean;
    accesZonesPremium: boolean;
    engagementMois: number;
    fraisInscription: number;
    actif: boolean;
    ordre: number;
    couleur: string | null;
    entrepriseId: string;
    createdAt: Date;
    updatedAt: Date;
    _count?: {
        abonnements: number;
    };
}

export interface AbonnementFitness {
    id: string;
    numero: string;
    clientId: string;
    client?: {
        id: string;
        nom: string;
        prenom: string | null;
        email: string | null;
        telephone: string | null;
    };
    typeAbonnementId: string;
    typeAbonnement?: TypeAbonnementFitness;
    dateDebut: Date;
    dateFin: Date | null;
    dateResiliation: Date | null;
    statut: StatutAbonnementFitness;
    seancesRestantes: number | null;
    seancesUtilisees: number;
    montantPaye: number;
    prochainPaiement: Date | null;
    modePaiement: string | null;
    numeroCarte: string | null;
    codeAcces: string | null;
    notes: string | null;
    entrepriseId: string;
    createdAt: Date;
    updatedAt: Date;
    _count?: {
        presences: number;
    };
}

export interface CreateAbonnementInput {
    clientId: string;
    typeAbonnementId: string;
    dateDebut: string; // ISO string
    dateFin?: string | null;
    statut?: StatutAbonnementFitness;
    seancesRestantes?: number | null;
    montantPaye?: number;
    prochainPaiement?: string | null;
    modePaiement?: string | null;
    numeroCarte?: string | null;
    codeAcces?: string | null;
    notes?: string | null;
}

export interface CreateTypeAbonnementInput {
    nom: string;
    description?: string | null;
    prix: number;
    periodicite: PeriodiciteFitness;
    dureeJours?: number | null;
    nombreSeances?: number | null;
    accesIllimite?: boolean;
    nombreAccesSemaine?: number | null;
    accesCours?: boolean;
    accesZonesPremium?: boolean;
    engagementMois?: number;
    fraisInscription?: number;
    actif?: boolean;
    ordre?: number;
    couleur?: string | null;
}

export interface CoursCollectif {
    id: string;
    nom: string;
    description: string | null;
    dureeMinutes: number;
    niveau: NiveauCours;
    capaciteMax: number;
    categorie: string | null;
    instructeurId: string | null;
    instructeur?: {
        id: string;
        nom: string;
        prenom: string;
        couleur: string | null;
    };
    salleId: string | null;
    salle?: {
        id: string;
        nom: string;
        type: TypeSalleFitness;
    };
    materielNecessaire: string | null;
    couleur: string | null;
    actif: boolean;
    reservationRequise: boolean;
    imageUrl: string | null;
    entrepriseId: string;
    createdAt: Date;
    updatedAt: Date;
    _count?: {
        seances: number;
    };
}

export interface SeanceCours {
    id: string;
    coursId: string;
    cours?: CoursCollectif;
    dateHeure: Date;
    dureeMinutes: number | null;
    instructeurId: string | null;
    instructeur?: {
        id: string;
        nom: string;
        prenom: string;
        couleur: string | null;
    };
    salleId: string | null;
    salle?: {
        id: string;
        nom: string;
        type: TypeSalleFitness;
    };
    capaciteMax: number | null;
    statut: StatutSeanceCours;
    placesReservees: number;
    notes: string | null;
    motifAnnulation: string | null;
    entrepriseId: string;
    createdAt: Date;
    updatedAt: Date;
    reservations?: ReservationCours[];
    _count?: {
        reservations: number;
    };
}

export interface ReservationCours {
    id: string;
    seanceId: string;
    seance?: SeanceCours;
    clientId: string;
    client?: {
        id: string;
        nom: string;
        prenom: string | null;
        email: string | null;
        telephone: string | null;
    };
    statut: StatutReservationCours;
    positionAttente: number | null;
    heureArrivee: Date | null;
    notes: string | null;
    entrepriseId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface SalleFitness {
    id: string;
    nom: string;
    description: string | null;
    type: TypeSalleFitness;
    capacite: number;
    equipements: string | null;
    surface: number | null;
    reservable: boolean;
    premium: boolean;
    actif: boolean;
    ordre: number;
    couleur: string | null;
    entrepriseId: string;
    createdAt: Date;
    updatedAt: Date;
    _count?: {
        cours: number;
        seances: number;
        presences: number;
    };
}

export interface PresenceFitness {
    id: string;
    clientId: string;
    client?: {
        id: string;
        nom: string;
        prenom: string | null;
        email: string | null;
    };
    abonnementId: string | null;
    abonnement?: AbonnementFitness;
    typeAcces: TypeAccesFitness;
    heureEntree: Date;
    heureSortie: Date | null;
    salleId: string | null;
    salle?: {
        id: string;
        nom: string;
        type: TypeSalleFitness;
    };
    methodCheckin: string | null;
    notes: string | null;
    entrepriseId: string;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// STATISTIQUES
// ============================================

export interface FitnessStats {
    // Abonnements
    totalAbonnements: number;
    abonnementsActifs: number;
    abonnementsSuspendus: number;
    abonnementsExpires: number;

    // Membres
    membresActifs: number;
    nouveauxMembresMois: number;

    // Revenus
    revenusMensuels: number;
    revenusAnnuels: number;

    // Cours
    totalCours: number;
    coursActifs: number;
    seancesSemaine: number;

    // Présences
    presencesJour: number;
    presencesSemaine: number;
    presencesMois: number;
    moyennePresencesJour: number;

    // Taux
    tauxRemplissageCours: number;
    tauxRetention: number;
}
