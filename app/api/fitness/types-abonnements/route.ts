import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { ValidationError } from "@/lib/errors";
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

/**
 * GET /api/fitness/types-abonnements
 * List subscription types
 */
export async function GET(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const { searchParams } = new URL(request.url);
            const actif = searchParams.get("actif");

            const where = {
                entrepriseId: ctx.entrepriseId,
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
        },
        {
            capability: "abonnements_fitness",
            context: { resourceName: "TypeAbonnementFitness", operation: "list" },
        }
    );
}

/**
 * POST /api/fitness/types-abonnements
 * Create a subscription type
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();
            const validation = createTypeAbonnementSchema.safeParse(body);

            if (!validation.success) {
                throw new ValidationError(
                    "Données invalides",
                    validation.error.flatten().fieldErrors as Record<string, string[]>
                );
            }

            const type = await prisma.typeAbonnementFitness.create({
                data: {
                    ...validation.data,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            return NextResponse.json(type, { status: 201 });
        },
        {
            capability: "abonnements_fitness",
            context: { resourceName: "TypeAbonnementFitness", operation: "create" },
        }
    );
}
