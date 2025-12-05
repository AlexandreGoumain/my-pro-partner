import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/syndic/charges/[id]
 * Get single appel de charges
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const appelCharges = await prisma.appelCharges.findFirst({
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
                    lignes: {
                        include: {
                            lot: {
                                select: {
                                    id: true,
                                    numero: true,
                                    typeLot: true,
                                    tantiemesGeneraux: true,
                                    coproprietaire: {
                                        select: {
                                            id: true,
                                            nom: true,
                                            prenom: true,
                                            telephone: true,
                                            email: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            if (!appelCharges) {
                throw new NotFoundError("Appel de charges non trouvé");
            }

            return NextResponse.json({ appelCharges });
        },
        {
            anyCapability: ["charges_copro"],
            context: { resourceName: "AppelCharges", operation: "get" },
        }
    );
}

/**
 * PATCH /api/syndic/charges/[id]
 * Update appel de charges
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;
            const body = await request.json();

            const existing = await prisma.appelCharges.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Appel de charges non trouvé");
            }

            const updateData: Record<string, unknown> = {};

            if (body.statut !== undefined) updateData.statut = body.statut;
            if (body.montantTotal !== undefined) updateData.montantTotal = body.montantTotal;
            if (body.dateEcheance !== undefined) updateData.dateEcheance = new Date(body.dateEcheance);
            if (body.dateEnvoi !== undefined) updateData.dateEnvoi = new Date(body.dateEnvoi);
            if (body.notes !== undefined) updateData.notes = body.notes;

            const appelCharges = await prisma.appelCharges.update({
                where: { id },
                data: updateData,
                include: {
                    copropriete: {
                        select: {
                            id: true,
                            nom: true,
                        },
                    },
                    lignes: {
                        include: {
                            lot: {
                                select: {
                                    id: true,
                                    numero: true,
                                    coproprietaire: {
                                        select: {
                                            nom: true,
                                            prenom: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            return NextResponse.json({ appelCharges });
        },
        {
            anyCapability: ["charges_copro"],
            context: { resourceName: "AppelCharges", operation: "update" },
        }
    );
}

/**
 * DELETE /api/syndic/charges/[id]
 * Delete appel de charges
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.appelCharges.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    lignes: true,
                },
            });

            if (!existing) {
                throw new NotFoundError("Appel de charges non trouvé");
            }

            // Prevent deletion if any payment received
            const hasPayments = existing.lignes.some(l => Number(l.montantPaye) > 0);
            if (hasPayments) {
                throw new BusinessError("Impossible de supprimer un appel avec des paiements reçus");
            }

            // Delete lignes first
            await prisma.ligneAppelCharges.deleteMany({
                where: { appelId: id },
            });

            await prisma.appelCharges.delete({
                where: { id },
            });

            return NextResponse.json({ success: true });
        },
        {
            anyCapability: ["charges_copro"],
            context: { resourceName: "AppelCharges", operation: "delete" },
        }
    );
}
