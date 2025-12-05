import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/interventions/[id]
 * Get intervention details
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const intervention = await prisma.intervention.findUnique({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    client: true,
                    plombier: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    camionnette: true,
                    materielUtilise: {
                        include: {
                            article: true,
                            stockCamionnette: true,
                        },
                    },
                    timeLogs: {
                        include: {
                            plombier: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                        orderBy: {
                            dateDebut: "desc",
                        },
                    },
                    historique: {
                        orderBy: {
                            createdAt: "desc",
                        },
                        take: 50,
                    },
                    document: true,
                    contrat: true,
                },
            });

            if (!intervention) {
                throw new NotFoundError("Intervention non trouvée");
            }

            return NextResponse.json({ intervention });
        },
        {
            anyCapability: ["domicile", "atelier"],
            context: { resourceName: "Intervention", operation: "get" },
        }
    );
}

/**
 * PUT /api/interventions/[id]
 * Update intervention
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;
            const body = await request.json();

            const existing = await prisma.intervention.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Intervention non trouvée");
            }

            const intervention = await prisma.intervention.update({
                where: { id },
                data: body,
                include: {
                    client: true,
                    plombier: {
                        select: {
                            name: true,
                        },
                    },
                },
            });

            // Log the update
            await prisma.interventionHistorique.create({
                data: {
                    interventionId: id,
                    action: "UPDATE",
                    description: "Intervention mise à jour",
                    metadata: body,
                    createdBy: ctx.userId,
                },
            });

            return NextResponse.json({ intervention });
        },
        {
            anyCapability: ["domicile", "atelier"],
            context: { resourceName: "Intervention", operation: "update" },
        }
    );
}

/**
 * DELETE /api/interventions/[id]
 * Delete intervention
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.intervention.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Intervention non trouvée");
            }

            await prisma.intervention.delete({ where: { id } });

            return NextResponse.json({ success: true });
        },
        {
            anyCapability: ["domicile", "atelier"],
            context: { resourceName: "Intervention", operation: "delete" },
        }
    );
}
