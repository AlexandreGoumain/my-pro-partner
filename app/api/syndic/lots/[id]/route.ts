import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/syndic/lots/[id]
 * Get single lot
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const lot = await prisma.lotCopropriete.findFirst({
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
                            totalTantiemes: true,
                        },
                    },
                    coproprietaire: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            telephone: true,
                            email: true,
                            adresse: true,
                            ville: true,
                        },
                    },
                    locataire: {
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

            if (!lot) {
                throw new NotFoundError("Lot non trouvé");
            }

            return NextResponse.json({ lot });
        },
        {
            anyCapability: ["lots_copro"],
            context: { resourceName: "LotCopropriete", operation: "get" },
        }
    );
}

/**
 * PATCH /api/syndic/lots/[id]
 * Update lot
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;
            const body = await request.json();

            const existing = await prisma.lotCopropriete.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Lot non trouvé");
            }

            // Check for duplicate numero if changing
            if (body.numero && body.numero !== existing.numero) {
                const duplicate = await prisma.lotCopropriete.findFirst({
                    where: {
                        coproprieteId: existing.coproprieteId,
                        numero: body.numero,
                        id: { not: id },
                    },
                });

                if (duplicate) {
                    throw new BusinessError("Un lot avec ce numéro existe déjà");
                }
            }

            const updateData: Record<string, unknown> = {};

            if (body.numero !== undefined) updateData.numero = body.numero;
            if (body.typeLot !== undefined) updateData.typeLot = body.typeLot;
            if (body.etage !== undefined) updateData.etage = body.etage;
            if (body.batiment !== undefined) updateData.batiment = body.batiment;
            if (body.surface !== undefined) updateData.surface = body.surface;
            if (body.tantiemesGeneraux !== undefined) updateData.tantiemesGeneraux = body.tantiemesGeneraux;
            if (body.tantiemesParticuliers !== undefined) updateData.tantiemesParticuliers = body.tantiemesParticuliers;
            if (body.coproprietaireId !== undefined) updateData.coproprietaireId = body.coproprietaireId || null;
            if (body.locataireId !== undefined) updateData.locataireId = body.locataireId || null;
            if (body.estLoue !== undefined) updateData.estLoue = body.estLoue;
            if (body.notes !== undefined) updateData.notes = body.notes;

            const lot = await prisma.lotCopropriete.update({
                where: { id },
                data: updateData,
                include: {
                    copropriete: {
                        select: {
                            id: true,
                            nom: true,
                        },
                    },
                    coproprietaire: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
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
            });

            return NextResponse.json({ lot });
        },
        {
            anyCapability: ["lots_copro"],
            context: { resourceName: "LotCopropriete", operation: "update" },
        }
    );
}

/**
 * DELETE /api/syndic/lots/[id]
 * Delete lot
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.lotCopropriete.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Lot non trouvé");
            }

            // Check if lot has charge lines
            const hasCharges = await prisma.ligneAppelCharges.count({
                where: { lotId: id },
            });

            if (hasCharges > 0) {
                throw new BusinessError("Impossible de supprimer un lot avec des appels de charges");
            }

            const coproprieteId = existing.coproprieteId;

            await prisma.lotCopropriete.delete({
                where: { id },
            });

            // Update nbLots in copropriete
            await prisma.copropriete.update({
                where: { id: coproprieteId },
                data: {
                    nbLots: {
                        decrement: 1,
                    },
                },
            });

            return NextResponse.json({ success: true });
        },
        {
            anyCapability: ["lots_copro"],
            context: { resourceName: "LotCopropriete", operation: "delete" },
        }
    );
}
