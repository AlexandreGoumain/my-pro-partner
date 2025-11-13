import { Client as PrismaClient } from "@/lib/generated/prisma";
import { CheckCircle2, Clock, AlertCircle, LucideIcon } from "lucide-react";

// Type from Prisma
export type ClientWithRelations = PrismaClient;

// Frontend display type
export type ClientDisplay = {
    id: string;
    nom: string;
    prenom?: string | null;
    nomComplet: string;
    email?: string | null;
    telephone?: string | null;
    adresse?: string | null;
    codePostal?: string | null;
    ville?: string | null;
    pays: string;
    localisation?: string;
    notes?: string | null;
    createdAt: Date;
    updatedAt: Date;
};

// Client health status
export interface ClientHealth {
    status: "active" | "inactive" | "warning";
    daysSinceUpdate: number;
    completionScore: number;
}

// Status configuration
export interface StatusConfig {
    label: string;
    className: string;
    icon: LucideIcon;
}

// Status configuration constants
export const STATUS_CONFIG: Record<ClientHealth["status"], StatusConfig> = {
    active: {
        label: "Actif",
        className: "bg-green-100 text-green-700 border-green-200",
        icon: CheckCircle2,
    },
    warning: {
        label: "Peu actif",
        className: "bg-orange-100 text-orange-700 border-orange-200",
        icon: Clock,
    },
    inactive: {
        label: "Inactif",
        className: "bg-red-100 text-red-700 border-red-200",
        icon: AlertCircle,
    },
};

// Mapper function from DB to display
export function mapClientToDisplay(client: ClientWithRelations): ClientDisplay {
    const nomComplet = client.prenom
        ? `${client.nom} ${client.prenom}`
        : client.nom;

    let localisation = client.ville || "";
    if (client.codePostal && client.ville) {
        localisation = `${client.codePostal} ${client.ville}`;
    }
    if (localisation && client.pays && client.pays !== "France") {
        localisation += `, ${client.pays}`;
    }

    return {
        id: client.id,
        nom: client.nom,
        prenom: client.prenom,
        nomComplet,
        email: client.email,
        telephone: client.telephone,
        adresse: client.adresse,
        codePostal: client.codePostal,
        ville: client.ville,
        pays: client.pays,
        localisation: localisation || undefined,
        notes: client.notes,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
    };
}
