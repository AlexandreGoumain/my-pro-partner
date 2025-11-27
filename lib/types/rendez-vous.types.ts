/**
 * Types for RendezVous (appointments)
 */

export type RendezVousStatut =
    | "EN_ATTENTE"
    | "CONFIRME"
    | "EN_COURS"
    | "TERMINE"
    | "ANNULE"
    | "NO_SHOW";

export interface RendezVousClient {
    id: string;
    nom: string;
    prenom: string | null;
    telephone: string | null;
    email: string | null;
}

export interface RendezVousPrestation {
    id: string;
    nom: string;
    duree: number;
    prix: number;
}

export interface RendezVousEmploye {
    id: string;
    nom: string;
    prenom: string;
    couleur: string | null;
}

export interface RendezVous {
    id: string;
    clientId: string | null;
    client: RendezVousClient | null;
    nomClient: string;
    telephone: string | null;
    email: string | null;
    date: Date | string;
    heure: string; // "14:30"
    duree: number; // Duration in minutes
    statut: RendezVousStatut;
    notes: string | null;
    prestationId: string | null;
    prestation: RendezVousPrestation | null;
    employeId: string | null;
    employe: RendezVousEmploye | null;
    entrepriseId: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface RendezVousCreateInput {
    clientId?: string;
    nomClient: string;
    telephone?: string;
    email?: string;
    date: string; // ISO date
    heure: string;
    duree?: number;
    prestationId?: string;
    employeId?: string;
    notes?: string;
    statut?: RendezVousStatut;
}

export interface RendezVousUpdateInput {
    clientId?: string;
    nomClient?: string;
    telephone?: string;
    email?: string;
    date?: string;
    heure?: string;
    duree?: number;
    prestationId?: string;
    employeId?: string;
    notes?: string;
    statut?: RendezVousStatut;
}

export interface RendezVousPaginationParams {
    page?: number;
    limit?: number;
    search?: string;
    statut?: RendezVousStatut;
    employeId?: string;
    clientId?: string;
    prestationId?: string;
    dateDebut?: string;
    dateFin?: string;
}

export interface TimeSlot {
    heure: string;
    disponible: boolean;
    employeId?: string;
}

export interface DisponibilitesResponse {
    date: string;
    duree: number;
    employeId?: string;
    slots?: TimeSlot[];
    employees?: {
        id: string;
        nom: string;
        prenom: string;
        couleur: string | null;
        slots: TimeSlot[];
    }[];
}

export const RENDEZ_VOUS_STATUTS: {
    value: RendezVousStatut;
    label: string;
    color: string;
}[] = [
    {
        value: "EN_ATTENTE",
        label: "En attente",
        color: "bg-black/10 text-black/60",
    },
    { value: "CONFIRME", label: "Confirmé", color: "bg-black/20 text-black" },
    { value: "EN_COURS", label: "En cours", color: "bg-black/30 text-black" },
    { value: "TERMINE", label: "Terminé", color: "bg-black/5 text-black/40" },
    { value: "ANNULE", label: "Annulé", color: "bg-black/5 text-black/30" },
    {
        value: "NO_SHOW",
        label: "Non présenté",
        color: "bg-black/5 text-black/30",
    },
];
