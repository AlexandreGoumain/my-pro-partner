import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/syndic/coproprietes/[id]
 * Get single copropriete
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const copropriete = await prisma.copropriete.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    lots: {
                        include: {
                            coproprietaire: {
                                select: {
                                    id: true,
                                    nom: true,
                                    prenom: true,
                                    telephone: true,
                                    email: true,
                                },
                            },
                            locataire: {
                                select: {
                                    id: true,
                                    nom: true,
                                    prenom: true,
                                },
                            },
                        },
                        orderBy: { numero: "asc" },
                    },
                    _count: {
                        select: {
                            lots: true,
                            appelsCharges: true,
                            assemblees: true,
                            travauxCopro: true,
                            conseilSyndical: true,
                        },
                    },
                },
            });

            if (!copropriete) {
                throw new NotFoundError("Copropriété non trouvée");
            }

            return NextResponse.json({ copropriete });
        },
        {
            anyCapability: ["coproprietes"],
            context: { resourceName: "Copropriete", operation: "get" },
        }
    );
}

/**
 * PATCH /api/syndic/coproprietes/[id]
 * Update copropriete
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;
            const body = await request.json();

            const existing = await prisma.copropriete.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Copropriété non trouvée");
            }

            const updateData: Record<string, unknown> = {};

            if (body.nom !== undefined) updateData.nom = body.nom;
            if (body.adresse !== undefined) updateData.adresse = body.adresse;
            if (body.codePostal !== undefined) updateData.codePostal = body.codePostal;
            if (body.ville !== undefined) updateData.ville = body.ville;
            if (body.nbLots !== undefined) updateData.nbLots = body.nbLots;
            if (body.nbBatiments !== undefined) updateData.nbBatiments = body.nbBatiments;
            if (body.totalTantiemes !== undefined) updateData.totalTantiemes = body.totalTantiemes;
            if (body.datePriseSyndic !== undefined) {
                updateData.datePriseSyndic = new Date(body.datePriseSyndic);
            }
            if (body.dateCreation !== undefined) {
                updateData.dateCreation = body.dateCreation ? new Date(body.dateCreation) : null;
            }
            if (body.numeroImmatriculation !== undefined) {
                updateData.numeroImmatriculation = body.numeroImmatriculation;
            }
            if (body.reglementCopro !== undefined) updateData.reglementCopro = body.reglementCopro;
            if (body.notes !== undefined) updateData.notes = body.notes;

            const copropriete = await prisma.copropriete.update({
                where: { id },
                data: updateData,
                include: {
                    _count: {
                        select: {
                            lots: true,
                            appelsCharges: true,
                            assemblees: true,
                            travauxCopro: true,
                        },
                    },
                },
            });

            return NextResponse.json({ copropriete });
        },
        {
            anyCapability: ["coproprietes"],
            context: { resourceName: "Copropriete", operation: "update" },
        }
    );
}

/**
 * DELETE /api/syndic/coproprietes/[id]
 * Delete copropriete
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.copropriete.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    _count: {
                        select: {
                            lots: true,
                        },
                    },
                },
            });

            if (!existing) {
                throw new NotFoundError("Copropriété non trouvée");
            }

            if (existing._count.lots > 0) {
                throw new BusinessError(
                    "Impossible de supprimer une copropriété avec des lots. Supprimez d'abord les lots."
                );
            }

            await prisma.copropriete.delete({
                where: { id },
            });

            return NextResponse.json({ success: true });
        },
        {
            anyCapability: ["coproprietes"],
            context: { resourceName: "Copropriete", operation: "delete" },
        }
    );
}
