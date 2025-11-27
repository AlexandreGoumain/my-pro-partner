/**
 * Reservation types - aligned with Prisma schema
 */

export enum ReservationStatut {
    EN_ATTENTE = "EN_ATTENTE",
    CONFIRMEE = "CONFIRMEE",
    ARRIVEE = "ARRIVEE",
    TERMINEE = "TERMINEE",
    ANNULEE = "ANNULEE",
    NO_SHOW = "NO_SHOW",
}

export interface Reservation {
    id: string;
    clientId?: string | null;
    nomClient: string;
    telephone?: string | null;
    email?: string | null;
    date: string | Date;
    heure: string;
    personnes: number;
    statut: ReservationStatut;
    notes?: string | null;
    tableId?: string | null;
    table?: {
        id: string;
        numero: number;
        nom?: string | null;
        zone: string;
    } | null;
    client?: {
        id: string;
        nom: string;
        prenom?: string | null;
        telephone?: string | null;
        email?: string | null;
    } | null;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

export interface ReservationStats {
    total: number;
    enAttente: number;
    confirmees: number;
    arrivees: number;
    terminees: number;
    annulees: number;
    noShow: number;
    couvertsTotal: number;
    // Stats du jour
    aujourdhui: {
        total: number;
        enAttente: number;
        confirmees: number;
        couverts: number;
    };
    // Stats de la semaine
    semaine: {
        total: number;
        couverts: number;
    };
}

export interface CreateReservationData {
    clientId?: string;
    nomClient: string;
    telephone?: string;
    email?: string;
    date: string;
    heure: string;
    personnes: number;
    tableId?: string;
    notes?: string;
}

export interface UpdateReservationData {
    clientId?: string | null;
    nomClient?: string;
    telephone?: string | null;
    email?: string | null;
    date?: string;
    heure?: string;
    personnes?: number;
    tableId?: string | null;
    notes?: string | null;
    statut?: ReservationStatut;
}

// Helper to get status label in French
export function getReservationStatutLabel(statut: ReservationStatut): string {
    const labels: Record<ReservationStatut, string> = {
        [ReservationStatut.EN_ATTENTE]: "En attente",
        [ReservationStatut.CONFIRMEE]: "Confirmée",
        [ReservationStatut.ARRIVEE]: "Arrivée",
        [ReservationStatut.TERMINEE]: "Terminée",
        [ReservationStatut.ANNULEE]: "Annulée",
        [ReservationStatut.NO_SHOW]: "No-show",
    };
    return labels[statut] || statut;
}

// Helper to get status color class
export function getReservationStatutColor(statut: ReservationStatut): string {
    const colors: Record<ReservationStatut, string> = {
        [ReservationStatut.EN_ATTENTE]: "bg-black/5 text-black/60",
        [ReservationStatut.CONFIRMEE]: "bg-black/10 text-black/80",
        [ReservationStatut.ARRIVEE]: "bg-black/20 text-black",
        [ReservationStatut.TERMINEE]: "bg-black/5 text-black/40",
        [ReservationStatut.ANNULEE]: "bg-black/5 text-black/30",
        [ReservationStatut.NO_SHOW]: "bg-black/5 text-black/30",
    };
    return colors[statut] || "bg-black/5 text-black/60";
}
