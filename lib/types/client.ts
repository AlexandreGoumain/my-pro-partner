import { Client as PrismaClient } from "@/lib/generated/prisma";

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
