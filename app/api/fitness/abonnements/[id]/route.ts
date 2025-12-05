import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateAbonnementSchema = z.object({
    typeAbonnementId: z.string().optional(),
    dateDebut: z
        .string()
        .optional()
        .transform((str) => (str ? new Date(str) : undefined)),
    dateFin: z
        .string()
        .optional()
        .nullable()
        .transform((str) => (str ? new Date(str) : null)),
    dateResiliation: z
        .string()
        .optional()
        .nullable()
        .transform((str) => (str ? new Date(str) : null)),
    statut: z
        .enum(["ACTIF", "SUSPENDU", "EXPIRE", "RESILIE", "EN_ATTENTE"])
        .optional(),
    seancesRestantes: z.number().optional().nullable(),
    seancesUtilisees: z.number().optional(),
    montantPaye: z.number().optional(),
    prochainPaiement: z
        .string()
        .optional()
        .nullable()
        .transform((str) => (str ? new Date(str) : null)),
    modePaiement: z.string().optional().nullable(),
    numeroCarte: z.string().optional().nullable(),
    codeAcces: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
});

type RouteParams = { params: Promise<{ id: string }> };

const abonnementInclude = {
    client: {
        select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            telephone: true,
        },
    },
    typeAbonnement: true,
} as const;

/**
 * GET /api/fitness/abonnements/[id]
 * Get a single subscription
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const abonnement = await prisma.abonnementFitness.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    ...abonnementInclude,
                    presences: {
                        orderBy: { heureEntree: "desc" },
                        take: 20,
                    },
                    _count: {
                        select: { presences: true },
                    },
                },
            });

            if (!abonnement) {
                throw new NotFoundError("Abonnement non trouvé");
            }

            return NextResponse.json(abonnement);
        },
        {
            capability: "abonnements_fitness",
            context: { resourceName: "AbonnementFitness", operation: "get" },
        }
    );
}

/**
 * PUT /api/fitness/abonnements/[id]
 * Update a subscription
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.abonnementFitness.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Abonnement non trouvé");
            }

            const body = await request.json();
            const validation = updateAbonnementSchema.safeParse(body);

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

            const abonnement = await prisma.abonnementFitness.update({
                where: { id },
                data: updateData,
                include: abonnementInclude,
            });

            return NextResponse.json(abonnement);
        },
        {
            capability: "abonnements_fitness",
            context: { resourceName: "AbonnementFitness", operation: "update" },
        }
    );
}

/**
 * DELETE /api/fitness/abonnements/[id]
 * Delete a subscription
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.abonnementFitness.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    _count: {
                        select: { presences: true },
                    },
                },
            });

            if (!existing) {
                throw new NotFoundError("Abonnement non trouvé");
            }

            if (existing._count.presences > 0) {
                throw new BusinessError(
                    "Impossible de supprimer un abonnement avec des présences enregistrées. Résiliez-le plutôt."
                );
            }

            await prisma.abonnementFitness.delete({ where: { id } });

            return NextResponse.json({ success: true });
        },
        {
            capability: "abonnements_fitness",
            context: { resourceName: "AbonnementFitness", operation: "delete" },
        }
    );
}
