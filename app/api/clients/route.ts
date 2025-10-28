import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const clientSchema = z.object({
    nom: z.string().min(1, "Le nom est requis"),
    prenom: z.string().optional(),
    email: z.string().email().optional(),
    telephone: z.string().optional(),
    adresse: z.string().optional(),
    codePostal: z.string().optional(),
    ville: z.string().optional(),
    pays: z.string().optional(),
    notes: z.string().optional(),
});

// GET: Récupérer tous les clients
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search");

        const clients = await prisma.client.findMany({
            where: search
                ? {
                      OR: [
                          { nom: { contains: search, mode: "insensitive" } },
                          { email: { contains: search, mode: "insensitive" } },
                          { ville: { contains: search, mode: "insensitive" } },
                      ],
                  }
                : {},
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(clients);
    } catch (error) {
        console.error("Erreur lors de la récupération des clients:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

// POST: Créer un nouveau client
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const validation = clientSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const client = await prisma.client.create({
            data: validation.data,
        });

        return NextResponse.json(client, { status: 201 });
    } catch (error) {
        console.error("Erreur lors de la création du client:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
