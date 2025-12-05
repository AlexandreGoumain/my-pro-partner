import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/syndic/conseil-syndical/[id]
 * Get single membre
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const membre = await prisma.membreConseilSyndical.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    copropriete: {
                        select: {
                            id: true,
                            nom: true,
                            adresse: true,
                        },
                    },
                    membre: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            telephone: true,
                            email: true,
                        },
                    },
                },
            });

            if (!membre) {
                throw new NotFoundError("Membre non trouvé");
            }

            return NextResponse.json({ membre });
        },
        {
            anyCapability: ["conseil_syndical"],
            context: { resourceName: "MembreConseilSyndical", operation: "get" },
        }
    );
}

/**
 * PATCH /api/syndic/conseil-syndical/[id]
 * Update membre
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;
            const body = await request.json();

            const existing = await prisma.membreConseilSyndical.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Membre non trouvé");
            }

            const updateData: Record<string, unknown> = {};

            if (body.role !== undefined) updateData.role = body.role;
            if (body.dateDebut !== undefined) updateData.dateDebut = new Date(body.dateDebut);
            if (body.dateFin !== undefined) {
                updateData.dateFin = body.dateFin ? new Date(body.dateFin) : null;
            }
            if (body.actif !== undefined) {
                updateData.actif = body.actif;

                // Auto-set dateFin when deactivating
                if (!body.actif && !existing.dateFin) {
                    updateData.dateFin = new Date();
                }
            }

            const membre = await prisma.membreConseilSyndical.update({
                where: { id },
                data: updateData,
                include: {
                    copropriete: {
                        select: {
                            id: true,
                            nom: true,
                        },
                    },
                    membre: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            telephone: true,
                            email: true,
                        },
                    },
                },
            });

            return NextResponse.json({ membre });
        },
        {
            anyCapability: ["conseil_syndical"],
            context: { resourceName: "MembreConseilSyndical", operation: "update" },
        }
    );
}

/**
 * DELETE /api/syndic/conseil-syndical/[id]
 * Delete membre
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.membreConseilSyndical.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Membre non trouvé");
            }

            await prisma.membreConseilSyndical.delete({
                where: { id },
            });

            return NextResponse.json({ success: true });
        },
        {
            anyCapability: ["conseil_syndical"],
            context: { resourceName: "MembreConseilSyndical", operation: "delete" },
        }
    );
}
