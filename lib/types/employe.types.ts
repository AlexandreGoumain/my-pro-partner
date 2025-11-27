/**
 * Types for Employe (employees/staff for appointment-based businesses)
 */

export interface DisponibiliteEmploye {
    id: string;
    employeId: string;
    jourSemaine: number; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    heureDebut: string; // "09:00"
    heureFin: string; // "18:00"
    pause: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface Employe {
    id: string;
    nom: string;
    prenom: string;
    email: string | null;
    telephone: string | null;
    couleur: string | null; // Color for calendar display
    actif: boolean;
    entrepriseId: string;
    disponibilites?: DisponibiliteEmploye[];
    // Coach fields (fitness)
    poste?: string | null;
    specialites?: string[] | null; // Ex: ["musculation", "cardio", "yoga"]
    bio?: string | null;
    certifications?: string | null; // Stored as comma-separated string
    // Counts
    _count?: {
        coursAssignes?: number;
        seancesAnimees?: number;
        rendezVous?: number;
    };
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface EmployeCreateInput {
    nom: string;
    prenom: string;
    email?: string;
    telephone?: string;
    couleur?: string;
    actif?: boolean;
    disponibilites?: DisponibiliteCreateInput[];
    // Coach fields (fitness)
    poste?: string;
    specialites?: string[];
    bio?: string;
    certifications?: string;
}

export interface EmployeUpdateInput {
    nom?: string;
    prenom?: string;
    email?: string;
    telephone?: string;
    couleur?: string;
    actif?: boolean;
    // Coach fields (fitness)
    poste?: string;
    specialites?: string[];
    bio?: string;
    certifications?: string;
}

export interface DisponibiliteCreateInput {
    jourSemaine: number;
    heureDebut: string;
    heureFin: string;
    pause?: boolean;
}

export interface EmployesPaginationParams {
    page?: number;
    limit?: number;
    search?: string;
    actif?: boolean;
}

export const JOURS_SEMAINE = [
    { value: 0, label: "Dimanche" },
    { value: 1, label: "Lundi" },
    { value: 2, label: "Mardi" },
    { value: 3, label: "Mercredi" },
    { value: 4, label: "Jeudi" },
    { value: 5, label: "Vendredi" },
    { value: 6, label: "Samedi" },
] as const;
