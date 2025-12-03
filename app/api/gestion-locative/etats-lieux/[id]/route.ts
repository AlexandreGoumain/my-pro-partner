import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/gestion-locative/etats-lieux/[id]
 * Get single etat des lieux
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const etatDesLieux = await prisma.etatDesLieux.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    bail: {
                        select: {
                            id: true,
                            reference: true,
                            bien: {
                                select: {
                                    id: true,
                                    titre: true,
                                    adresse: true,
                                    ville: true,
                                    surface: true,
                                },
                            },
                            locatairePrincipal: {
                                select: {
                                    id: true,
                                    nom: true,
                                    prenom: true,
                                    telephone: true,
                                    email: true,
                                },
                            },
                            proprietaire: {
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

            if (!etatDesLieux) {
                throw new NotFoundError("État des lieux non trouvé");
            }

            return NextResponse.json({ etatDesLieux });
        },
        {
            anyCapability: ["etats_lieux"],
            context: { resourceName: "EtatDesLieux", operation: "get" },
        }
    );
}

/**
 * PATCH /api/gestion-locative/etats-lieux/[id]
 * Update etat des lieux
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;
            const body = await request.json();

            const existing = await prisma.etatDesLieux.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("État des lieux non trouvé");
            }

            const updateData: Record<string, unknown> = {};

            if (body.dateEtat !== undefined) {
                updateData.dateEtat = new Date(body.dateEtat);
            }

            if (body.releveEau !== undefined) {
                updateData.releveEau = body.releveEau;
            }

            if (body.releveElec !== undefined) {
                updateData.releveElec = body.releveElec;
            }

            if (body.releveGaz !== undefined) {
                updateData.releveGaz = body.releveGaz;
            }

            if (body.constatations !== undefined) {
                updateData.constatations = body.constatations;
            }

            if (body.photos !== undefined) {
                updateData.photos = body.photos;
            }

            if (body.notes !== undefined) {
                updateData.notes = body.notes;
            }

            if (body.signatureLocataire !== undefined) {
                updateData.signatureLocataire = body.signatureLocataire;
            }

            if (body.signatureProprietaire !== undefined) {
                updateData.signatureProprietaire = body.signatureProprietaire;
            }

            if (body.documentUrl !== undefined) {
                updateData.documentUrl = body.documentUrl;
            }

            if (body.retenueDepot !== undefined) {
                updateData.retenueDepot = body.retenueDepot;
            }

            if (body.motifRetenue !== undefined) {
                updateData.motifRetenue = body.motifRetenue;
            }

            const etatDesLieux = await prisma.etatDesLieux.update({
                where: { id },
                data: updateData,
                include: {
                    bail: {
                        select: {
                            id: true,
                            reference: true,
                            bien: {
                                select: {
                                    id: true,
                                    titre: true,
                                },
                            },
                            locatairePrincipal: {
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

            return NextResponse.json({ etatDesLieux });
        },
        {
            anyCapability: ["etats_lieux"],
            context: { resourceName: "EtatDesLieux", operation: "update" },
        }
    );
}

/**
 * DELETE /api/gestion-locative/etats-lieux/[id]
 * Delete etat des lieux
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.etatDesLieux.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("État des lieux non trouvé");
            }

            // Prevent deletion if signed
            if (existing.signatureLocataire && existing.signatureProprietaire) {
                throw new BusinessError(
                    "Impossible de supprimer un état des lieux signé"
                );
            }

            await prisma.etatDesLieux.delete({
                where: { id },
            });

            return NextResponse.json({ success: true });
        },
        {
            anyCapability: ["etats_lieux"],
            context: { resourceName: "EtatDesLieux", operation: "delete" },
        }
    );
}
