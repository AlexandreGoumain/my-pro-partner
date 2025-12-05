import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { ValidationError } from "@/lib/errors";
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

/**
 * GET /api/fitness/salles
 * List fitness rooms
 */
export async function GET(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const { searchParams } = new URL(request.url);
            const actif = searchParams.get("actif");
            const type = searchParams.get("type");
            const premium = searchParams.get("premium");
            const reservable = searchParams.get("reservable");

            const where = {
                entrepriseId: ctx.entrepriseId,
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
        },
        {
            capability: "salles_fitness",
            context: { resourceName: "SalleFitness", operation: "list" },
        }
    );
}

/**
 * POST /api/fitness/salles
 * Create a fitness room
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();
            const validation = createSalleSchema.safeParse(body);

            if (!validation.success) {
                throw new ValidationError(
                    "Données invalides",
                    validation.error.flatten().fieldErrors as Record<string, string[]>
                );
            }

            const salle = await prisma.salleFitness.create({
                data: {
                    ...validation.data,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            return NextResponse.json(salle, { status: 201 });
        },
        {
            capability: "salles_fitness",
            context: { resourceName: "SalleFitness", operation: "create" },
        }
    );
}
