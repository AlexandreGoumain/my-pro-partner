import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/syndic/travaux/[id]
 * Get single travaux
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const travaux = await prisma.travauxCopropriete.findFirst({
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
                },
            });

            if (!travaux) {
                throw new NotFoundError("Travaux non trouvés");
            }

            return NextResponse.json({ travaux });
        },
        {
            anyCapability: ["travaux_copro"],
            context: { resourceName: "TravauxCopropriete", operation: "get" },
        }
    );
}

/**
 * PATCH /api/syndic/travaux/[id]
 * Update travaux
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;
            const body = await request.json();

            const existing = await prisma.travauxCopropriete.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Travaux non trouvés");
            }

            const updateData: Record<string, unknown> = {};

            if (body.titre !== undefined) updateData.titre = body.titre;
            if (body.description !== undefined) updateData.description = body.description;
            if (body.categorie !== undefined) updateData.categorie = body.categorie;
            if (body.statut !== undefined) {
                updateData.statut = body.statut;

                // Set dates based on status
                if (body.statut === "EN_COURS" && !existing.dateDebutReelle) {
                    updateData.dateDebutReelle = new Date();
                }
                if (body.statut === "TERMINE" && !existing.dateFinReelle) {
                    updateData.dateFinReelle = new Date();
                }
            }
            if (body.budgetEstime !== undefined) updateData.budgetEstime = body.budgetEstime;
            if (body.budgetVote !== undefined) updateData.budgetVote = body.budgetVote;
            if (body.coutFinal !== undefined) updateData.coutFinal = body.coutFinal;
            if (body.dateDebutPrevue !== undefined) {
                updateData.dateDebutPrevue = body.dateDebutPrevue ? new Date(body.dateDebutPrevue) : null;
            }
            if (body.dateFinPrevue !== undefined) {
                updateData.dateFinPrevue = body.dateFinPrevue ? new Date(body.dateFinPrevue) : null;
            }
            if (body.dateDebutReelle !== undefined) {
                updateData.dateDebutReelle = body.dateDebutReelle ? new Date(body.dateDebutReelle) : null;
            }
            if (body.dateFinReelle !== undefined) {
                updateData.dateFinReelle = body.dateFinReelle ? new Date(body.dateFinReelle) : null;
            }
            if (body.notes !== undefined) updateData.notes = body.notes;

            const travaux = await prisma.travauxCopropriete.update({
                where: { id },
                data: updateData,
                include: {
                    copropriete: {
                        select: {
                            id: true,
                            nom: true,
                        },
                    },
                },
            });

            return NextResponse.json({ travaux });
        },
        {
            anyCapability: ["travaux_copro"],
            context: { resourceName: "TravauxCopropriete", operation: "update" },
        }
    );
}

/**
 * DELETE /api/syndic/travaux/[id]
 * Delete travaux
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.travauxCopropriete.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Travaux non trouvés");
            }

            // Prevent deletion of completed travaux with costs
            if (existing.statut === "TERMINE" && existing.coutFinal) {
                throw new BusinessError("Impossible de supprimer des travaux terminés avec un coût final");
            }

            await prisma.travauxCopropriete.delete({
                where: { id },
            });

            return NextResponse.json({ success: true });
        },
        {
            anyCapability: ["travaux_copro"],
            context: { resourceName: "TravauxCopropriete", operation: "delete" },
        }
    );
}
