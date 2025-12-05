import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateSeanceSchema = z.object({
    dateHeure: z
        .string()
        .optional()
        .transform((str) => (str ? new Date(str) : undefined)),
    dureeMinutes: z.number().optional().nullable(),
    instructeurId: z.string().optional().nullable(),
    salleId: z.string().optional().nullable(),
    capaciteMax: z.number().optional().nullable(),
    statut: z
        .enum(["PLANIFIEE", "EN_COURS", "TERMINEE", "ANNULEE", "COMPLETE"])
        .optional(),
    placesReservees: z.number().optional(),
    notes: z.string().optional().nullable(),
    motifAnnulation: z.string().optional().nullable(),
});

type RouteParams = { params: Promise<{ id: string }> };

const seanceInclude = {
    cours: {
        select: {
            id: true,
            nom: true,
            niveau: true,
            dureeMinutes: true,
            capaciteMax: true,
            couleur: true,
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
 * GET /api/fitness/seances/[id]
 * Get a single class session
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const seance = await prisma.seanceCours.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    cours: true,
                    instructeur: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            couleur: true,
                            specialites: true,
                        },
                    },
                    salle: true,
                    reservations: {
                        include: {
                            client: {
                                select: {
                                    id: true,
                                    nom: true,
                                    prenom: true,
                                    email: true,
                                    telephone: true,
                                },
                            },
                        },
                        orderBy: [
                            { statut: "asc" },
                            { positionAttente: "asc" },
                            { createdAt: "asc" },
                        ],
                    },
                    _count: {
                        select: { reservations: true },
                    },
                },
            });

            if (!seance) {
                throw new NotFoundError("Séance non trouvée");
            }

            return NextResponse.json(seance);
        },
        {
            capability: "cours_collectifs",
            context: { resourceName: "SeanceCours", operation: "get" },
        }
    );
}

/**
 * PUT /api/fitness/seances/[id]
 * Update a class session
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.seanceCours.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Séance non trouvée");
            }

            const body = await request.json();
            const validation = updateSeanceSchema.safeParse(body);

            if (!validation.success) {
                throw new ValidationError(
                    "Données invalides",
                    validation.error.flatten().fieldErrors as Record<string, string[]>
                );
            }

            // Filter undefined values
            const updateData = Object.fromEntries(
                Object.entries(validation.data).filter(([, v]) => v !== undefined)
            );

            const seance = await prisma.seanceCours.update({
                where: { id },
                data: updateData,
                include: seanceInclude,
            });

            return NextResponse.json(seance);
        },
        {
            capability: "cours_collectifs",
            context: { resourceName: "SeanceCours", operation: "update" },
        }
    );
}

/**
 * DELETE /api/fitness/seances/[id]
 * Delete a class session
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.seanceCours.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    _count: {
                        select: { reservations: true },
                    },
                },
            });

            if (!existing) {
                throw new NotFoundError("Séance non trouvée");
            }

            // Delete associated reservations
            await prisma.reservationCours.deleteMany({
                where: { seanceId: id },
            });

            await prisma.seanceCours.delete({ where: { id } });

            return NextResponse.json({ success: true });
        },
        {
            capability: "cours_collectifs",
            context: { resourceName: "SeanceCours", operation: "delete" },
        }
    );
}
