import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/syndic/ag/[id]
 * Get single assemblée générale
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const ag = await prisma.assembleeGenerale.findFirst({
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
                            ville: true,
                        },
                    },
                    resolutions: {
                        orderBy: { numero: "asc" },
                    },
                },
            });

            if (!ag) {
                throw new NotFoundError("Assemblée générale non trouvée");
            }

            return NextResponse.json({ ag });
        },
        {
            anyCapability: ["assemblees_generales"],
            context: { resourceName: "AssembleeGenerale", operation: "get" },
        }
    );
}

/**
 * PATCH /api/syndic/ag/[id]
 * Update assemblée générale
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;
            const body = await request.json();

            const existing = await prisma.assembleeGenerale.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Assemblée générale non trouvée");
            }

            const updateData: Record<string, unknown> = {};

            if (body.statut !== undefined) updateData.statut = body.statut;
            if (body.typeAG !== undefined) updateData.typeAG = body.typeAG;
            if (body.dateAG !== undefined) updateData.dateAG = new Date(body.dateAG);
            if (body.dateConvocation !== undefined) updateData.dateConvocation = new Date(body.dateConvocation);
            if (body.lieu !== undefined) updateData.lieu = body.lieu;
            if (body.heureDebut !== undefined) updateData.heureDebut = body.heureDebut;
            if (body.ordreJour !== undefined) updateData.ordreJour = body.ordreJour;
            if (body.quorum !== undefined) updateData.quorum = body.quorum;
            if (body.procesVerbalUrl !== undefined) updateData.procesVerbalUrl = body.procesVerbalUrl;
            if (body.notes !== undefined) updateData.notes = body.notes;

            const ag = await prisma.assembleeGenerale.update({
                where: { id },
                data: updateData,
                include: {
                    copropriete: {
                        select: {
                            id: true,
                            nom: true,
                        },
                    },
                    resolutions: {
                        orderBy: { numero: "asc" },
                    },
                },
            });

            return NextResponse.json({ ag });
        },
        {
            anyCapability: ["assemblees_generales"],
            context: { resourceName: "AssembleeGenerale", operation: "update" },
        }
    );
}

/**
 * DELETE /api/syndic/ag/[id]
 * Delete assemblée générale
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.assembleeGenerale.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Assemblée générale non trouvée");
            }

            // Prevent deletion of completed AGs
            if (existing.statut === "TERMINEE") {
                throw new BusinessError("Impossible de supprimer une assemblée générale terminée");
            }

            // Delete resolutions first
            await prisma.resolutionAG.deleteMany({
                where: { assembleeId: id },
            });

            await prisma.assembleeGenerale.delete({
                where: { id },
            });

            return NextResponse.json({ success: true });
        },
        {
            anyCapability: ["assemblees_generales"],
            context: { resourceName: "AssembleeGenerale", operation: "delete" },
        }
    );
}
