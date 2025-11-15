// Table status enum
export enum TableStatus {
    LIBRE = "LIBRE",
    OCCUPEE = "OCCUPEE",
    RESERVEE = "RESERVEE",
}

// Table zone type
export type TableZone = "Terrasse" | "Salle principale" | "Salle VIP" | "Bar" | "Autre";

// Base table interface
export interface Table {
    id: string;
    numero: number;
    capacite: number;
    statut: TableStatus;
    zone: TableZone;
    client?: string;
    depuis?: string; // Time since occupied
    heure?: string; // Reservation time
    createdAt?: Date;
    updatedAt?: Date;
}

// Table create input (for API)
export interface TableCreateInput {
    numero: number;
    capacite: number;
    statut?: TableStatus;
    zone: TableZone;
}

// Table update input (for API)
export interface TableUpdateInput {
    numero?: number;
    capacite?: number;
    statut?: TableStatus;
    zone?: TableZone;
    client?: string;
    depuis?: string;
    heure?: string;
}

// Table statistics interface
export interface TablesStats {
    total: number;
    libres: number;
    occupees: number;
    reservees: number;
    capaciteTotal: number;
    tauxOccupation: number;
    byZone: {
        zone: TableZone;
        count: number;
        libres: number;
        occupees: number;
        reservees: number;
    }[];
}

// Pagination params for tables
export interface TablesPaginationParams {
    page?: number;
    limit?: number;
    search?: string;
    zone?: TableZone;
    statut?: TableStatus;
}
