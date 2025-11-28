/**
 * Centralized badge color configurations
 * Eliminates repeated badge color logic across components
 */

import type { StatutContrat } from "@/lib/types/contrats";
import type {
    NiveauCours,
    StatutAbonnementFitness,
    StatutSeanceCours,
} from "@/lib/types/fitness";
import type {
    PrioriteIntervention,
    StatutIntervention,
} from "@/lib/types/intervention";
import { ReservationStatut } from "@/lib/types/reservation";
import { TableStatus } from "@/lib/types/table.types";

// ============================================================================
// Intervention Priority Colors
// ============================================================================

export const INTERVENTION_PRIORITY_COLORS: Record<
    PrioriteIntervention,
    string
> = {
    CRITIQUE: "bg-red-100 text-red-800 border-red-200",
    URGENTE: "bg-orange-100 text-orange-800 border-orange-200",
    NORMALE: "bg-gray-100 text-gray-800 border-gray-200",
};

export function getInterventionPriorityColor(
    priorite: PrioriteIntervention
): string {
    return INTERVENTION_PRIORITY_COLORS[priorite];
}

// ============================================================================
// Intervention Status Colors
// ============================================================================

export const INTERVENTION_STATUS_COLORS: Record<StatutIntervention, string> = {
    DEMANDE: "bg-blue-100 text-blue-800",
    PLANIFIEE: "bg-purple-100 text-purple-800",
    EN_ROUTE: "bg-yellow-100 text-yellow-800",
    SUR_PLACE: "bg-cyan-100 text-cyan-800",
    DIAGNOSTIC_FAIT: "bg-indigo-100 text-indigo-800",
    DEVIS_ENVOYE: "bg-sky-100 text-sky-800",
    DEVIS_ACCEPTE: "bg-teal-100 text-teal-800",
    EN_COURS: "bg-orange-100 text-orange-800",
    TERMINEE: "bg-green-100 text-green-800",
    FACTUREE: "bg-emerald-100 text-emerald-800",
    ANNULEE: "bg-gray-100 text-gray-800",
};

export function getInterventionStatusColor(statut: StatutIntervention): string {
    return INTERVENTION_STATUS_COLORS[statut] || "bg-gray-100 text-gray-800";
}

// ============================================================================
// Contract Status Colors
// ============================================================================

export const CONTRACT_STATUS_COLORS: Record<StatutContrat, string> = {
    ACTIF: "bg-green-100 text-green-800",
    EXPIRE: "bg-red-100 text-red-800",
    RESILIE: "bg-gray-100 text-gray-800",
    EN_ATTENTE: "bg-yellow-100 text-yellow-800",
    SUSPENDU: "bg-orange-100 text-orange-800",
};

export function getContractStatusColor(statut: StatutContrat): string {
    return CONTRACT_STATUS_COLORS[statut];
}

// ============================================================================
// Fitness Abonnement Status Colors
// ============================================================================

export const ABONNEMENT_FITNESS_STATUS_COLORS: Record<
    StatutAbonnementFitness,
    string
> = {
    ACTIF: "bg-green-100 text-green-800",
    SUSPENDU: "bg-yellow-100 text-yellow-800",
    EXPIRE: "bg-red-100 text-red-800",
    RESILIE: "bg-gray-100 text-gray-800",
    EN_ATTENTE: "bg-blue-100 text-blue-800",
};

export function getAbonnementFitnessStatusColor(
    statut: StatutAbonnementFitness
): string {
    return ABONNEMENT_FITNESS_STATUS_COLORS[statut];
}

// ============================================================================
// Fitness Seance Status Colors
// ============================================================================

export const SEANCE_STATUS_COLORS: Record<StatutSeanceCours, string> = {
    PLANIFIEE: "bg-black/5 text-black/60",
    EN_COURS: "bg-green-100 text-green-800",
    TERMINEE: "bg-black/5 text-black/40",
    ANNULEE: "bg-red-100 text-red-800",
    COMPLETE: "bg-yellow-100 text-yellow-800",
};

export function getSeanceStatusColor(statut: StatutSeanceCours): string {
    return SEANCE_STATUS_COLORS[statut];
}

// ============================================================================
// Fitness Niveau Cours Colors
// ============================================================================

export const NIVEAU_COURS_COLORS: Record<NiveauCours, string> = {
    DEBUTANT: "bg-green-100 text-green-800",
    INTERMEDIAIRE: "bg-yellow-100 text-yellow-800",
    AVANCE: "bg-red-100 text-red-800",
    TOUS_NIVEAUX: "bg-black/5 text-black/60",
};

export function getNiveauCoursColor(niveau: NiveauCours): string {
    return NIVEAU_COURS_COLORS[niveau];
}

// ============================================================================
// Generic Status Colors (for common patterns)
// ============================================================================

export const GENERIC_STATUS_COLORS = {
    // Success states
    success: "bg-green-100 text-green-800",
    active: "bg-green-100 text-green-800",
    completed: "bg-green-100 text-green-800",
    paid: "bg-emerald-100 text-emerald-800",

    // Warning states
    warning: "bg-orange-100 text-orange-800",
    pending: "bg-yellow-100 text-yellow-800",
    inProgress: "bg-orange-100 text-orange-800",

    // Error states
    error: "bg-red-100 text-red-800",
    expired: "bg-red-100 text-red-800",
    critical: "bg-red-100 text-red-800",

    // Neutral states
    default: "bg-gray-100 text-gray-800",
    draft: "bg-gray-100 text-gray-800",
    cancelled: "bg-gray-100 text-gray-800",

    // Info states
    info: "bg-blue-100 text-blue-800",
    sent: "bg-blue-100 text-blue-800",

    // Special states
    facturable: "bg-black/5 text-black/60",
} as const;

export type GenericStatusKey = keyof typeof GENERIC_STATUS_COLORS;

export function getGenericStatusColor(status: GenericStatusKey): string {
    return GENERIC_STATUS_COLORS[status];
}

// ============================================================================
// Percentage-based Colors (for progress indicators)
// ============================================================================

export function getPercentageColor(percentage: number): string {
    if (percentage >= 100) return "bg-green-100 text-green-800";
    if (percentage >= 75) return "bg-emerald-100 text-emerald-800";
    if (percentage >= 50) return "bg-yellow-100 text-yellow-800";
    if (percentage >= 25) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
}

export function getPercentageProgressColor(percentage: number): string {
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-emerald-500";
    if (percentage >= 50) return "bg-yellow-500";
    if (percentage >= 25) return "bg-orange-500";
    return "bg-red-500";
}

// ============================================================================
// Reservation Status Colors
// ============================================================================

export const RESERVATION_STATUS_COLORS: Record<ReservationStatut, string> = {
    [ReservationStatut.EN_ATTENTE]: "bg-black/5 text-black/60 border-black/8",
    [ReservationStatut.CONFIRMEE]: "bg-black/10 text-black/80 border-black/10",
    [ReservationStatut.ARRIVEE]: "bg-black/20 text-black border-black/20",
    [ReservationStatut.TERMINEE]: "bg-black/5 text-black/40 border-black/5",
    [ReservationStatut.ANNULEE]: "bg-black/5 text-black/40 border-black/5",
    [ReservationStatut.NO_SHOW]: "bg-black/5 text-black/30 border-black/5",
};

export function getReservationStatusColor(statut: ReservationStatut): string {
    return (
        RESERVATION_STATUS_COLORS[statut] ||
        "bg-black/5 text-black/60 border-black/8"
    );
}

// ============================================================================
// Table Status Colors
// ============================================================================

export const TABLE_STATUS_BADGE_COLORS: Record<TableStatus, string> = {
    [TableStatus.LIBRE]: "bg-black/5 text-black/60 border-black/10",
    [TableStatus.OCCUPEE]: "bg-black/10 text-black/80 border-black/20",
    [TableStatus.RESERVEE]: "bg-black/8 text-black/70 border-black/15",
};

export const TABLE_STATUS_CARD_COLORS: Record<TableStatus, string> = {
    [TableStatus.LIBRE]: "border-black/8 hover:border-black/20",
    [TableStatus.OCCUPEE]: "border-black/20 hover:border-black/30",
    [TableStatus.RESERVEE]: "border-black/12 hover:border-black/25",
};

export function getTableStatusBadgeColor(statut: TableStatus): string {
    return (
        TABLE_STATUS_BADGE_COLORS[statut] ||
        "bg-black/5 text-black/40 border-black/8"
    );
}

export function getTableStatusCardColor(statut: TableStatus): string {
    return (
        TABLE_STATUS_CARD_COLORS[statut] ||
        "border-black/8 hover:border-black/20"
    );
}
