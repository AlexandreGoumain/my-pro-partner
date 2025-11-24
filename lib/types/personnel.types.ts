// ============================================================================
// Enums
// ============================================================================

export const StatutEmploye = {
    ACTIF: "ACTIF",
    CONGE: "CONGE",
    MALADIE: "MALADIE",
    ABSENT: "ABSENT",
    INACTIF: "INACTIF",
} as const;

export type StatutEmploye = (typeof StatutEmploye)[keyof typeof StatutEmploye];

export const TypeContrat = {
    CDI: "CDI",
    CDD: "CDD",
    INTERIM: "INTERIM",
    APPRENTI: "APPRENTI",
    STAGE: "STAGE",
    FREELANCE: "FREELANCE",
} as const;

export type TypeContrat = (typeof TypeContrat)[keyof typeof TypeContrat];

// ============================================================================
// Employee Model Types
// ============================================================================

export interface Employee {
    id: string;
    entrepriseId: string;

    // Informations personnelles
    prenom: string;
    nom: string;
    email: string;
    telephone: string | null;
    dateNaissance: Date | null;
    adresse: string | null;
    ville: string | null;
    codePostal: string | null;
    pays: string;
    photoUrl: string | null;

    // Informations professionnelles
    poste: string;
    departement: string | null;
    statut: StatutEmploye;
    typeContrat: TypeContrat;

    // Dates importantes
    dateEmbauche: Date;
    dateFin: Date | null;

    // Salaire et compensation
    salaireBrut: number;
    devise: string;

    // Horaires et planning
    heuresHebdo: number | null;
    joursTravail: string | null;

    // Documents et notes
    notes: string | null;
    competences: string | null;

    // Congés
    congesRestants: number;
    congesPris: number;

    // Relations
    userId: string | null;

    createdAt: Date;
    updatedAt: Date;
}

// ============================================================================
// Form Types
// ============================================================================

export interface EmployeeFormData {
    // Informations personnelles
    prenom: string;
    nom: string;
    email: string;
    telephone?: string;
    dateNaissance?: Date;
    adresse?: string;
    ville?: string;
    codePostal?: string;
    pays?: string;
    photoUrl?: string;

    // Informations professionnelles
    poste: string;
    departement?: string;
    statut: StatutEmploye;
    typeContrat: TypeContrat;

    // Dates importantes
    dateEmbauche: Date;
    dateFin?: Date;

    // Salaire et compensation
    salaireBrut: number;
    devise?: string;

    // Horaires et planning
    heuresHebdo?: number;
    joursTravail?: string;

    // Documents et notes
    notes?: string;
    competences?: string;

    // Congés
    congesRestants?: number;
    congesPris?: number;
}

// ============================================================================
// Filter and Sort Types
// ============================================================================

export type EmployeeSortBy =
    | "nom"
    | "prenom"
    | "dateEmbauche"
    | "poste"
    | "departement"
    | "salaireBrut";

export type SortOrder = "asc" | "desc";

export interface EmployeeFilters {
    search?: string;
    statut?: StatutEmploye[];
    typeContrat?: TypeContrat[];
    departement?: string[];
    sortBy?: EmployeeSortBy;
    sortOrder?: SortOrder;
}

// ============================================================================
// Stats Types
// ============================================================================

export interface EmployeeStats {
    total: number;
    actifs: number;
    inactifs: number;
    enConge: number;
    nouveaux30Jours: number;
    salaireTotal: number;
    salaireMoyen: number;
}

export interface DepartementStats {
    departement: string;
    effectif: number;
    salaireMoyen: number;
}

export interface ContratStats {
    typeContrat: TypeContrat;
    count: number;
    percentage: number;
}

// ============================================================================
// Response Types
// ============================================================================

export interface EmployeeListResponse {
    employees: Employee[];
    stats: EmployeeStats;
    total: number;
}

export interface EmployeeResponse {
    employee: Employee;
}

// ============================================================================
// Helper Types
// ============================================================================

export interface EmployeeWithUser extends Employee {
    user?: {
        id: string;
        name: string | null;
        email: string;
    } | null;
}

// ============================================================================
// Constants
// ============================================================================

export const STATUT_LABELS: Record<StatutEmploye, string> = {
    ACTIF: "Actif",
    CONGE: "En congé",
    MALADIE: "Arrêt maladie",
    ABSENT: "Absent",
    INACTIF: "Inactif",
};

export const TYPE_CONTRAT_LABELS: Record<TypeContrat, string> = {
    CDI: "CDI",
    CDD: "CDD",
    INTERIM: "Intérim",
    APPRENTI: "Apprentissage",
    STAGE: "Stage",
    FREELANCE: "Freelance",
};

export const DEFAULT_HEURES_HEBDO = 35;
export const DEFAULT_CONGES_ANNUELS = 25;
export const DEFAULT_DEVISE = "EUR";
export const DEFAULT_PAYS = "France";
