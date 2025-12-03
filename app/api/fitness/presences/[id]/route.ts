import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updatePresenceSchema = z.object({
    heureSortie: z
        .string()
        .optional()
        .nullable()
        .transform((str) => (str ? new Date(str) : null)),
    notes: z.string().optional().nullable(),
});

type RouteParams = { params: Promise<{ id: string }> };

const presenceInclude = {
    client: {
        select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
        },
    },
    abonnement: {
        select: {
            id: true,
            numero: true,
            statut: true,
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
 * GET /api/fitness/presences/[id]
 * Get a single attendance record
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const presence = await prisma.presenceFitness.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
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
                    abonnement: {
                        include: {
                            typeAbonnement: true,
                        },
                    },
                    salle: true,
                },
            });

            if (!presence) {
                throw new NotFoundError("Présence non trouvée");
            }

            return NextResponse.json(presence);
        },
        {
            capability: "presences_fitness",
            context: { resourceName: "PresenceFitness", operation: "get" },
        }
    );
}

/**
 * PUT /api/fitness/presences/[id]
 * Update attendance (notably exit time)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.presenceFitness.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Présence non trouvée");
            }

            const body = await request.json();
            const validation = updatePresenceSchema.safeParse(body);

            if (!validation.success) {
                throw new ValidationError(
                    "Données invalides",
                    validation.error.flatten().fieldErrors as Record<string, string[]>
                );
            }

            const presence = await prisma.presenceFitness.update({
                where: { id },
                data: validation.data,
                include: presenceInclude,
            });

            return NextResponse.json(presence);
        },
        {
            capability: "presences_fitness",
            context: { resourceName: "PresenceFitness", operation: "update" },
        }
    );
}

/**
 * DELETE /api/fitness/presences/[id]
 * Delete attendance record
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.presenceFitness.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Présence non trouvée");
            }

            await prisma.presenceFitness.delete({ where: { id } });

            return NextResponse.json({ success: true });
        },
        {
            capability: "presences_fitness",
            context: { resourceName: "PresenceFitness", operation: "delete" },
        }
    );
}
