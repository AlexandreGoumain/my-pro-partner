import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateSalleSchema = z.object({
    nom: z.string().min(1).optional(),
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
        .optional(),
    capacite: z.number().min(0).optional(),
    equipements: z.string().optional().nullable(),
    surface: z.number().optional().nullable(),
    reservable: z.boolean().optional(),
    premium: z.boolean().optional(),
    actif: z.boolean().optional(),
    ordre: z.number().optional(),
    couleur: z.string().optional().nullable(),
});

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/fitness/salles/[id]
 * Get a single fitness room
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const salle = await prisma.salleFitness.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    cours: {
                        where: { actif: true },
                        select: {
                            id: true,
                            nom: true,
                            niveau: true,
                            dureeMinutes: true,
                        },
                    },
                    _count: {
                        select: {
                            cours: true,
                            seances: true,
                            presences: true,
                        },
                    },
                },
            });

            if (!salle) {
                throw new NotFoundError("Salle non trouvée");
            }

            return NextResponse.json(salle);
        },
        {
            capability: "salles_fitness",
            context: { resourceName: "SalleFitness", operation: "get" },
        }
    );
}

/**
 * PUT /api/fitness/salles/[id]
 * Update a fitness room
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.salleFitness.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Salle non trouvée");
            }

            const body = await request.json();
            const validation = updateSalleSchema.safeParse(body);

            if (!validation.success) {
                throw new ValidationError(
                    "Données invalides",
                    validation.error.flatten().fieldErrors as Record<string, string[]>
                );
            }

            const salle = await prisma.salleFitness.update({
                where: { id },
                data: validation.data,
            });

            return NextResponse.json(salle);
        },
        {
            capability: "salles_fitness",
            context: { resourceName: "SalleFitness", operation: "update" },
        }
    );
}

/**
 * DELETE /api/fitness/salles/[id]
 * Delete a fitness room
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.salleFitness.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    _count: {
                        select: { seances: true },
                    },
                },
            });

            if (!existing) {
                throw new NotFoundError("Salle non trouvée");
            }

            if (existing._count.seances > 0) {
                throw new BusinessError(
                    "Impossible de supprimer une salle avec des séances planifiées. Désactivez-la plutôt."
                );
            }

            await prisma.salleFitness.delete({ where: { id } });

            return NextResponse.json({ success: true });
        },
        {
            capability: "salles_fitness",
            context: { resourceName: "SalleFitness", operation: "delete" },
        }
    );
}
