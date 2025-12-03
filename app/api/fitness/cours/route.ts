import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createCoursSchema = z.object({
    nom: z.string().min(1, "Le nom est requis"),
    description: z.string().optional().nullable(),
    dureeMinutes: z.number().min(15).default(60),
    niveau: z
        .enum(["DEBUTANT", "INTERMEDIAIRE", "AVANCE", "TOUS_NIVEAUX"])
        .default("TOUS_NIVEAUX"),
    capaciteMax: z.number().min(1).default(20),
    categorie: z.string().optional().nullable(),
    instructeurId: z.string().optional().nullable(),
    salleId: z.string().optional().nullable(),
    materielNecessaire: z.string().optional().nullable(),
    couleur: z.string().optional().nullable(),
    actif: z.boolean().optional().default(true),
    reservationRequise: z.boolean().optional().default(true),
    imageUrl: z.string().optional().nullable(),
});

const coursInclude = {
    instructeur: {
        select: {
            id: true,
            nom: true,
            prenom: true,
            couleur: true,
        },
    },
    salle: {
        select: {
            id: true,
            nom: true,
            type: true,
        },
    },
} as const;

/**
 * GET /api/fitness/cours
 * List group classes
 */
export async function GET(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const { searchParams } = new URL(request.url);
            const actif = searchParams.get("actif");
            const categorie = searchParams.get("categorie");
            const niveau = searchParams.get("niveau");
            const instructeurId = searchParams.get("instructeurId");
            const search = searchParams.get("search") || "";

            const where = {
                entrepriseId: ctx.entrepriseId,
                ...(actif !== null && actif !== "" && { actif: actif === "true" }),
                ...(categorie && { categorie }),
                ...(niveau && {
                    niveau: niveau as
                        | "DEBUTANT"
                        | "INTERMEDIAIRE"
                        | "AVANCE"
                        | "TOUS_NIVEAUX",
                }),
                ...(instructeurId && { instructeurId }),
                ...(search && {
                    OR: [
                        { nom: { contains: search, mode: "insensitive" as const } },
                        {
                            description: {
                                contains: search,
                                mode: "insensitive" as const,
                            },
                        },
                    ],
                }),
            };

            const cours = await prisma.coursCollectif.findMany({
                where,
                orderBy: [{ nom: "asc" }],
                include: {
                    ...coursInclude,
                    _count: {
                        select: { seances: true },
                    },
                },
            });

            return NextResponse.json({ data: cours });
        },
        {
            capability: "cours_collectifs",
            context: { resourceName: "CoursCollectif", operation: "list" },
        }
    );
}

/**
 * POST /api/fitness/cours
 * Create a group class
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();
            const validation = createCoursSchema.safeParse(body);

            if (!validation.success) {
                throw new ValidationError(
                    "Données invalides",
                    validation.error.flatten().fieldErrors as Record<string, string[]>
                );
            }

            const data = validation.data;

            // Check that instructor exists (if provided)
            if (data.instructeurId) {
                const instructeur = await prisma.employe.findFirst({
                    where: {
                        id: data.instructeurId,
                        entrepriseId: ctx.entrepriseId,
                        actif: true,
                    },
                });

                if (!instructeur) {
                    throw new NotFoundError("Instructeur non trouvé");
                }
            }

            // Check that room exists (if provided)
            if (data.salleId) {
                const salle = await prisma.salleFitness.findFirst({
                    where: {
                        id: data.salleId,
                        entrepriseId: ctx.entrepriseId,
                        actif: true,
                    },
                });

                if (!salle) {
                    throw new NotFoundError("Salle non trouvée");
                }
            }

            const cours = await prisma.coursCollectif.create({
                data: {
                    ...data,
                    entrepriseId: ctx.entrepriseId,
                },
                include: coursInclude,
            });

            return NextResponse.json(cours, { status: 201 });
        },
        {
            capability: "cours_collectifs",
            context: { resourceName: "CoursCollectif", operation: "create" },
        }
    );
}
