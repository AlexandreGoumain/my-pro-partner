import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateTypeAbonnementSchema = z.object({
    nom: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    prix: z.number().min(0).optional(),
    periodicite: z
        .enum([
            "JOURNALIER",
            "HEBDOMADAIRE",
            "MENSUEL",
            "TRIMESTRIEL",
            "SEMESTRIEL",
            "ANNUEL",
            "ILLIMITE",
        ])
        .optional(),
    dureeJours: z.number().optional().nullable(),
    nombreSeances: z.number().optional().nullable(),
    accesIllimite: z.boolean().optional(),
    nombreAccesSemaine: z.number().optional().nullable(),
    accesCours: z.boolean().optional(),
    accesZonesPremium: z.boolean().optional(),
    engagementMois: z.number().optional(),
    fraisInscription: z.number().optional(),
    actif: z.boolean().optional(),
    ordre: z.number().optional(),
    couleur: z.string().optional().nullable(),
});

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/fitness/types-abonnements/[id]
 * Get a single subscription type
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const type = await prisma.typeAbonnementFitness.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    _count: {
                        select: { abonnements: true },
                    },
                },
            });

            if (!type) {
                throw new NotFoundError("Type d'abonnement non trouvé");
            }

            return NextResponse.json(type);
        },
        {
            capability: "abonnements_fitness",
            context: { resourceName: "TypeAbonnementFitness", operation: "get" },
        }
    );
}

/**
 * PUT /api/fitness/types-abonnements/[id]
 * Update a subscription type
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.typeAbonnementFitness.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Type d'abonnement non trouvé");
            }

            const body = await request.json();
            const validation = updateTypeAbonnementSchema.safeParse(body);

            if (!validation.success) {
                throw new ValidationError(
                    "Données invalides",
                    validation.error.flatten().fieldErrors as Record<string, string[]>
                );
            }

            const type = await prisma.typeAbonnementFitness.update({
                where: { id },
                data: validation.data,
            });

            return NextResponse.json(type);
        },
        {
            capability: "abonnements_fitness",
            context: { resourceName: "TypeAbonnementFitness", operation: "update" },
        }
    );
}

/**
 * DELETE /api/fitness/types-abonnements/[id]
 * Delete a subscription type
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.typeAbonnementFitness.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    _count: {
                        select: { abonnements: true },
                    },
                },
            });

            if (!existing) {
                throw new NotFoundError("Type d'abonnement non trouvé");
            }

            if (existing._count.abonnements > 0) {
                throw new BusinessError(
                    "Impossible de supprimer un type d'abonnement avec des abonnements actifs. Désactivez-le plutôt."
                );
            }

            await prisma.typeAbonnementFitness.delete({ where: { id } });

            return NextResponse.json({ success: true });
        },
        {
            capability: "abonnements_fitness",
            context: { resourceName: "TypeAbonnementFitness", operation: "delete" },
        }
    );
}
