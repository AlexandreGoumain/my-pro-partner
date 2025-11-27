import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createSalleSchema = z.object({
    nom: z.string().min(1, "Le nom est requis"),
    description: z.string().optional().nullable(),
    type: z
        .enum([
            "MUSCULATION",
            "CARDIO",
            "COURS_COLLECTIF",
            "PISCINE",
            "SAUNA",
            "VESTIAIRE",
            "CROSSFIT",
            "YOGA",
            "SPINNING",
            "BOXE",
            "AUTRE",
        ])
        .default("AUTRE"),
    capacite: z.number().min(0).default(0),
    equipements: z.string().optional().nullable(),
    surface: z.number().optional().nullable(),
    reservable: z.boolean().optional().default(false),
    premium: z.boolean().optional().default(false),
    actif: z.boolean().optional().default(true),
    ordre: z.number().optional().default(0),
    couleur: z.string().optional().nullable(),
});

// GET /api/fitness/salles - Liste des salles
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("salles_fitness");
        if (capabilityCheck) return capabilityCheck;

        const { searchParams } = new URL(request.url);
        const actif = searchParams.get("actif");
        const type = searchParams.get("type");
        const premium = searchParams.get("premium");
        const reservable = searchParams.get("reservable");

        const where = {
            entrepriseId: session.user.entrepriseId,
            ...(actif !== null && actif !== "" && { actif: actif === "true" }),
            ...(type && {
                type: type as
                    | "MUSCULATION"
                    | "CARDIO"
                    | "COURS_COLLECTIF"
                    | "PISCINE"
                    | "SAUNA"
                    | "VESTIAIRE"
                    | "CROSSFIT"
                    | "YOGA"
                    | "SPINNING"
                    | "BOXE"
                    | "AUTRE",
            }),
            ...(premium !== null &&
                premium !== "" && { premium: premium === "true" }),
            ...(reservable !== null &&
                reservable !== "" && { reservable: reservable === "true" }),
        };

        const salles = await prisma.salleFitness.findMany({
            where,
            orderBy: [{ ordre: "asc" }, { nom: "asc" }],
            include: {
                _count: {
                    select: {
                        cours: true,
                        seances: true,
                        presences: true,
                    },
                },
            },
        });

        return NextResponse.json({ data: salles });
    } catch (error) {
        console.error("Erreur GET salles:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// POST /api/fitness/salles - Créer une salle
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("salles_fitness");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();
        const validatedData = createSalleSchema.parse(body);

        const salle = await prisma.salleFitness.create({
            data: {
                ...validatedData,
                entrepriseId: session.user.entrepriseId,
            },
        });

        return NextResponse.json(salle, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Données invalides", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Erreur POST salle:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
