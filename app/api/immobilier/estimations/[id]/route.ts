import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/immobilier/estimations/[id]
 * Get single estimation
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const estimation = await prisma.estimationBien.findFirst({
                where: {
                    id,
                    bien: {
                        entrepriseId: ctx.entrepriseId,
                    },
                },
                include: {
                    bien: {
                        select: {
                            id: true,
                            reference: true,
                            titre: true,
                            typeBien: true,
                            ville: true,
                            adresse: true,
                            surface: true,
                            nbPieces: true,
                            photos: true,
                        },
                    },
                    agent: {
                        select: {
                            id: true,
                            prenom: true,
                            nom: true,
                        },
                    },
                },
            });

            if (!estimation) {
                throw new NotFoundError("Estimation non trouvée");
            }

            return NextResponse.json({ estimation });
        },
        {
            anyCapability: ["estimation_immo"],
            context: { resourceName: "EstimationBien", operation: "get" },
        }
    );
}

/**
 * PATCH /api/immobilier/estimations/[id]
 * Update estimation
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;
            const body = await request.json();

            const existing = await prisma.estimationBien.findFirst({
                where: {
                    id,
                    bien: {
                        entrepriseId: ctx.entrepriseId,
                    },
                },
            });

            if (!existing) {
                throw new NotFoundError("Estimation non trouvée");
            }

            const updateData: Record<string, unknown> = {};

            if (body.prixEstimeBas !== undefined) updateData.prixEstimeBas = body.prixEstimeBas;
            if (body.prixEstimeHaut !== undefined) updateData.prixEstimeHaut = body.prixEstimeHaut;
            if (body.prixRecommande !== undefined) updateData.prixRecommande = body.prixRecommande;
            if (body.methode !== undefined) updateData.methode = body.methode;
            if (body.comparables !== undefined) updateData.comparables = body.comparables;
            if (body.validiteJours !== undefined) updateData.validiteJours = body.validiteJours;
            if (body.notes !== undefined) updateData.notes = body.notes;

            const estimation = await prisma.estimationBien.update({
                where: { id },
                data: updateData,
                include: {
                    bien: {
                        select: {
                            id: true,
                            reference: true,
                            titre: true,
                            typeBien: true,
                            ville: true,
                        },
                    },
                    agent: {
                        select: {
                            id: true,
                            prenom: true,
                            nom: true,
                        },
                    },
                },
            });

            return NextResponse.json({ estimation });
        },
        {
            anyCapability: ["estimation_immo"],
            context: { resourceName: "EstimationBien", operation: "update" },
        }
    );
}

/**
 * DELETE /api/immobilier/estimations/[id]
 * Delete estimation
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.estimationBien.findFirst({
                where: {
                    id,
                    bien: {
                        entrepriseId: ctx.entrepriseId,
                    },
                },
            });

            if (!existing) {
                throw new NotFoundError("Estimation non trouvée");
            }

            await prisma.estimationBien.delete({ where: { id } });

            return NextResponse.json({ success: true });
        },
        {
            anyCapability: ["estimation_immo"],
            context: { resourceName: "EstimationBien", operation: "delete" },
        }
    );
}
