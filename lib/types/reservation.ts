/**
 * Reservation types
 */

export enum ReservationStatut {
    CONFIRMEE = "CONFIRMEE",
    EN_ATTENTE = "EN_ATTENTE",
    ANNULEE = "ANNULEE",
}

export interface Reservation {
    id: number | string;
    client: string;
    date: string;
    heure: string;
    personnes: number;
    telephone: string;
    statut: ReservationStatut;
}

export interface ReservationStats {
    total: number;
    confirmees: number;
    enAttente: number;
    couverts: number;
}

export interface CreateReservationData {
    client: string;
    date: string;
    heure: string;
    personnes: number;
    telephone: string;
    statut?: ReservationStatut;
}
