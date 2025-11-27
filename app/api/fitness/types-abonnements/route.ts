import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createTypeAbonnementSchema = z.object({
    nom: z.string().min(1, "Le nom est requis"),
    description: z.string().optional(),
    prix: z.number().min(0),
    periodicite: z.enum([
        "JOURNALIER",
        "HEBDOMADAIRE",
        "MENSUEL",
        "TRIMESTRIEL",
        "SEMESTRIEL",
        "ANNUEL",
        "ILLIMITE",
    ]),
    dureeJours: z.number().optional().nullable(),
    nombreSeances: z.number().optional().nullable(),
    accesIllimite: z.boolean().optional().default(true),
    nombreAccesSemaine: z.number().optional().nullable(),
    accesCours: z.boolean().optional().default(true),
    accesZonesPremium: z.boolean().optional().default(false),
    engagementMois: z.number().optional().default(0),
    fraisInscription: z.number().optional().default(0),
    actif: z.boolean().optional().default(true),
    ordre: z.number().optional().default(0),
    couleur: z.string().optional().nullable(),
});

// GET /api/fitness/types-abonnements - Liste des types d'abonnements
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("abonnements_fitness");
        if (capabilityCheck) return capabilityCheck;

        const { searchParams } = new URL(request.url);
        const actif = searchParams.get("actif");

        const where = {
            entrepriseId: session.user.entrepriseId,
            ...(actif !== null && actif !== "" && { actif: actif === "true" }),
        };

        const types = await prisma.typeAbonnementFitness.findMany({
            where,
            orderBy: [{ ordre: "asc" }, { nom: "asc" }],
            include: {
                _count: {
                    select: { abonnements: true },
                },
            },
        });

        return NextResponse.json({ data: types });
    } catch (error) {
        console.error("Erreur GET types-abonnements:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// POST /api/fitness/types-abonnements - Créer un type d'abonnement
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("abonnements_fitness");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();
        const validatedData = createTypeAbonnementSchema.parse(body);

        const type = await prisma.typeAbonnementFitness.create({
            data: {
                ...validatedData,
                entrepriseId: session.user.entrepriseId,
            },
        });

        return NextResponse.json(type, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Données invalides", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Erreur POST type-abonnement:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
