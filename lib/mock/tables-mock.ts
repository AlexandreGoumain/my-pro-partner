import { Table, TableStatus, TablesStats } from "@/lib/types/table.types";

// Mock tables data for development
export const mockTables: Table[] = [
    {
        id: "1",
        numero: 1,
        capacite: 2,
        statut: TableStatus.LIBRE,
        zone: "Terrasse",
    },
    {
        id: "2",
        numero: 2,
        capacite: 4,
        statut: TableStatus.OCCUPEE,
        zone: "Salle principale",
        client: "Dupont",
        depuis: "18:30",
    },
    {
        id: "3",
        numero: 3,
        capacite: 6,
        statut: TableStatus.RESERVEE,
        zone: "Salle principale",
        client: "Martin",
        heure: "20:00",
    },
    {
        id: "4",
        numero: 4,
        capacite: 2,
        statut: TableStatus.LIBRE,
        zone: "Terrasse",
    },
    {
        id: "5",
        numero: 5,
        capacite: 4,
        statut: TableStatus.LIBRE,
        zone: "Salle principale",
    },
    {
        id: "6",
        numero: 6,
        capacite: 8,
        statut: TableStatus.OCCUPEE,
        zone: "Salle VIP",
        client: "Bernard",
        depuis: "19:15",
    },
    {
        id: "7",
        numero: 7,
        capacite: 4,
        statut: TableStatus.LIBRE,
        zone: "Bar",
    },
    {
        id: "8",
        numero: 8,
        capacite: 6,
        statut: TableStatus.RESERVEE,
        zone: "Salle VIP",
        client: "Lefebvre",
        heure: "21:00",
    },
];

// Mock stats for development
export const mockTablesStats: TablesStats = {
    total: 8,
    libres: 4,
    occupees: 2,
    reservees: 2,
    capaciteTotal: 36,
    tauxOccupation: 50,
    byZone: [
        {
            zone: "Terrasse",
            count: 2,
            libres: 2,
            occupees: 0,
            reservees: 0,
        },
        {
            zone: "Salle principale",
            count: 3,
            libres: 1,
            occupees: 1,
            reservees: 1,
        },
        {
            zone: "Salle VIP",
            count: 2,
            libres: 0,
            occupees: 1,
            reservees: 1,
        },
        {
            zone: "Bar",
            count: 1,
            libres: 1,
            occupees: 0,
            reservees: 0,
        },
    ],
};
