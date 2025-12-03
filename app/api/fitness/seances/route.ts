import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createSeanceSchema = z.object({
    coursId: z.string().min(1, "Le cours est requis"),
    dateHeure: z.string().transform((str) => new Date(str)),
    dureeMinutes: z.number().optional().nullable(),
    instructeurId: z.string().optional().nullable(),
    salleId: z.string().optional().nullable(),
    capaciteMax: z.number().optional().nullable(),
    statut: z
        .enum(["PLANIFIEE", "EN_COURS", "TERMINEE", "ANNULEE", "COMPLETE"])
        .optional()
        .default("PLANIFIEE"),
    notes: z.string().optional().nullable(),
});

// Create multiple sessions (recurrence)
const createSeancesRecurrentesSchema = z.object({
    coursId: z.string().min(1),
    dateDebut: z.string().transform((str) => new Date(str)),
    dateFin: z.string().transform((str) => new Date(str)),
    heureDebut: z.string(), // "14:30"
    joursSemaine: z.array(z.number().min(0).max(6)), // [1, 3, 5] = Monday, Wednesday, Friday
    instructeurId: z.string().optional().nullable(),
    salleId: z.string().optional().nullable(),
});

const seanceInclude = {
    cours: {
        select: {
            id: true,
            nom: true,
            niveau: true,
            dureeMinutes: true,
            capaciteMax: true,
            couleur: true,
            categorie: true,
        },
    },
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
 * GET /api/fitness/seances
 * List class sessions
 */
export async function GET(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const { searchParams } = new URL(request.url);
            const page = parseInt(searchParams.get("page") || "1");
            const limit = parseInt(searchParams.get("limit") || "50");
            const coursId = searchParams.get("coursId");
            const instructeurId = searchParams.get("instructeurId");
            const salleId = searchParams.get("salleId");
            const statut = searchParams.get("statut");
            const dateDebut = searchParams.get("dateDebut");
            const dateFin = searchParams.get("dateFin");

            const where = {
                entrepriseId: ctx.entrepriseId,
                ...(coursId && { coursId }),
                ...(instructeurId && { instructeurId }),
                ...(salleId && { salleId }),
                ...(statut && {
                    statut: statut as
                        | "PLANIFIEE"
                        | "EN_COURS"
                        | "TERMINEE"
                        | "ANNULEE"
                        | "COMPLETE",
                }),
                ...(dateDebut && {
                    dateHeure: {
                        gte: new Date(dateDebut),
                        ...(dateFin && { lte: new Date(dateFin) }),
                    },
                }),
            };

            const [seances, total] = await Promise.all([
                prisma.seanceCours.findMany({
                    where,
                    orderBy: [{ dateHeure: "asc" }],
                    skip: (page - 1) * limit,
                    take: limit,
                    include: {
                        ...seanceInclude,
                        _count: {
                            select: { reservations: true },
                        },
                    },
                }),
                prisma.seanceCours.count({ where }),
            ]);

            return NextResponse.json({
                data: seances,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            });
        },
        {
            capability: "cours_collectifs",
            context: { resourceName: "SeanceCours", operation: "list" },
        }
    );
}

/**
 * POST /api/fitness/seances
 * Create a class session (single or recurring)
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();

            // Check if it's a recurring creation
            if (body.joursSemaine && body.dateDebut && body.dateFin) {
                const validation = createSeancesRecurrentesSchema.safeParse(body);

                if (!validation.success) {
                    throw new ValidationError(
                        "Données invalides",
                        validation.error.flatten().fieldErrors as Record<string, string[]>
                    );
                }

                const recurrentData = validation.data;

                // Check that course exists
                const cours = await prisma.coursCollectif.findFirst({
                    where: {
                        id: recurrentData.coursId,
                        entrepriseId: ctx.entrepriseId,
                    },
                });

                if (!cours) {
                    throw new NotFoundError("Cours non trouvé");
                }

                // Generate dates
                const seancesData: {
                    dateHeure: Date;
                    coursId: string;
                    instructeurId: string | null;
                    salleId: string | null;
                    entrepriseId: string;
                }[] = [];
                const currentDate = new Date(recurrentData.dateDebut);
                const endDate = new Date(recurrentData.dateFin);
                const [heures, minutes] = recurrentData.heureDebut
                    .split(":")
                    .map(Number);

                while (currentDate <= endDate) {
                    const dayOfWeek = currentDate.getDay();
                    if (recurrentData.joursSemaine.includes(dayOfWeek)) {
                        const dateHeure = new Date(currentDate);
                        dateHeure.setHours(heures, minutes, 0, 0);

                        seancesData.push({
                            dateHeure,
                            coursId: recurrentData.coursId,
                            instructeurId:
                                recurrentData.instructeurId ?? cours.instructeurId,
                            salleId: recurrentData.salleId ?? cours.salleId,
                            entrepriseId: ctx.entrepriseId,
                        });
                    }
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                if (seancesData.length === 0) {
                    throw new BusinessError(
                        "Aucune séance à créer avec ces paramètres"
                    );
                }

                const result = await prisma.seanceCours.createMany({
                    data: seancesData,
                });

                return NextResponse.json(
                    {
                        created: result.count,
                        message: `${result.count} séances créées`,
                    },
                    { status: 201 }
                );
            }

            // Single creation
            const validation = createSeanceSchema.safeParse(body);

            if (!validation.success) {
                throw new ValidationError(
                    "Données invalides",
                    validation.error.flatten().fieldErrors as Record<string, string[]>
                );
            }

            const data = validation.data;

            // Check that course exists
            const cours = await prisma.coursCollectif.findFirst({
                where: {
                    id: data.coursId,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!cours) {
                throw new NotFoundError("Cours non trouvé");
            }

            const seance = await prisma.seanceCours.create({
                data: {
                    ...data,
                    instructeurId: data.instructeurId ?? cours.instructeurId,
                    salleId: data.salleId ?? cours.salleId,
                    entrepriseId: ctx.entrepriseId,
                },
                include: seanceInclude,
            });

            return NextResponse.json(seance, { status: 201 });
        },
        {
            capability: "cours_collectifs",
            context: { resourceName: "SeanceCours", operation: "create" },
        }
    );
}
