import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/syndic/comptabilite/[id]
 * Get single écriture
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const ecriture = await prisma.ecritureComptableCopro.findFirst({
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
                    lot: {
                        select: {
                            id: true,
                            numero: true,
                            coproprietaire: {
                                select: {
                                    id: true,
                                    nom: true,
                                    prenom: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!ecriture) {
                throw new NotFoundError("Écriture non trouvée");
            }

            return NextResponse.json({ ecriture });
        },
        {
            anyCapability: ["comptabilite_copro"],
            context: { resourceName: "EcritureComptableCopro", operation: "get" },
        }
    );
}

/**
 * PATCH /api/syndic/comptabilite/[id]
 * Update écriture
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;
            const body = await request.json();

            const existing = await prisma.ecritureComptableCopro.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Écriture non trouvée");
            }

            const updateData: Record<string, unknown> = {};

            if (body.dateEcriture !== undefined) updateData.dateEcriture = new Date(body.dateEcriture);
            if (body.libelle !== undefined) updateData.libelle = body.libelle;
            if (body.montant !== undefined) updateData.montant = body.montant;
            if (body.typeEcriture !== undefined) updateData.typeEcriture = body.typeEcriture;
            if (body.compte !== undefined) updateData.compte = body.compte;
            if (body.categorieCharge !== undefined) updateData.categorieCharge = body.categorieCharge;
            if (body.lotId !== undefined) updateData.lotId = body.lotId || null;
            if (body.pieceJustificative !== undefined) updateData.pieceJustificative = body.pieceJustificative;
            if (body.notes !== undefined) updateData.notes = body.notes;

            const ecriture = await prisma.ecritureComptableCopro.update({
                where: { id },
                data: updateData,
                include: {
                    copropriete: {
                        select: {
                            id: true,
                            nom: true,
                        },
                    },
                    lot: {
                        select: {
                            id: true,
                            numero: true,
                        },
                    },
                },
            });

            return NextResponse.json({ ecriture });
        },
        {
            anyCapability: ["comptabilite_copro"],
            context: { resourceName: "EcritureComptableCopro", operation: "update" },
        }
    );
}

/**
 * DELETE /api/syndic/comptabilite/[id]
 * Delete écriture
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.ecritureComptableCopro.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Écriture non trouvée");
            }

            await prisma.ecritureComptableCopro.delete({
                where: { id },
            });

            return NextResponse.json({ success: true });
        },
        {
            anyCapability: ["comptabilite_copro"],
            context: { resourceName: "EcritureComptableCopro", operation: "delete" },
        }
    );
}
