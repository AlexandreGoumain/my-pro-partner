import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateCoursSchema = z.object({
    nom: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    dureeMinutes: z.number().min(15).optional(),
    niveau: z
        .enum(["DEBUTANT", "INTERMEDIAIRE", "AVANCE", "TOUS_NIVEAUX"])
        .optional(),
    capaciteMax: z.number().min(1).optional(),
    categorie: z.string().optional().nullable(),
    instructeurId: z.string().optional().nullable(),
    salleId: z.string().optional().nullable(),
    materielNecessaire: z.string().optional().nullable(),
    couleur: z.string().optional().nullable(),
    actif: z.boolean().optional(),
    reservationRequise: z.boolean().optional(),
    imageUrl: z.string().optional().nullable(),
});

type RouteParams = { params: Promise<{ id: string }> };

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
 * GET /api/fitness/cours/[id]
 * Get a single group class
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const cours = await prisma.coursCollectif.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    instructeur: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            couleur: true,
                            specialites: true,
                            bio: true,
                        },
                    },
                    salle: {
                        select: {
                            id: true,
                            nom: true,
                            type: true,
                            capacite: true,
                        },
                    },
                    seances: {
                        where: {
                            dateHeure: { gte: new Date() },
                            statut: { not: "ANNULEE" },
                        },
                        orderBy: { dateHeure: "asc" },
                        take: 10,
                        include: {
                            _count: { select: { reservations: true } },
                        },
                    },
                    _count: {
                        select: { seances: true },
                    },
                },
            });

            if (!cours) {
                throw new NotFoundError("Cours non trouvé");
            }

            return NextResponse.json(cours);
        },
        {
            capability: "cours_collectifs",
            context: { resourceName: "CoursCollectif", operation: "get" },
        }
    );
}

/**
 * PUT /api/fitness/cours/[id]
 * Update a group class
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.coursCollectif.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Cours non trouvé");
            }

            const body = await request.json();
            const validation = updateCoursSchema.safeParse(body);

            if (!validation.success) {
                throw new ValidationError(
                    "Données invalides",
                    validation.error.flatten().fieldErrors as Record<string, string[]>
                );
            }

            const cours = await prisma.coursCollectif.update({
                where: { id },
                data: validation.data,
                include: coursInclude,
            });

            return NextResponse.json(cours);
        },
        {
            capability: "cours_collectifs",
            context: { resourceName: "CoursCollectif", operation: "update" },
        }
    );
}

/**
 * DELETE /api/fitness/cours/[id]
 * Delete a group class
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.coursCollectif.findFirst({
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
                throw new NotFoundError("Cours non trouvé");
            }

            if (existing._count.seances > 0) {
                throw new BusinessError(
                    "Impossible de supprimer un cours avec des séances planifiées. Désactivez-le plutôt."
                );
            }

            await prisma.coursCollectif.delete({ where: { id } });

            return NextResponse.json({ success: true });
        },
        {
            capability: "cours_collectifs",
            context: { resourceName: "CoursCollectif", operation: "delete" },
        }
    );
}
