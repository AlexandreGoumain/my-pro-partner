import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/immobilier/mandats/[id]
 * Get single mandat
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const mandat = await prisma.mandatImmobilier.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
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
                            prixVente: true,
                            photos: true,
                            surface: true,
                            nbPieces: true,
                        },
                    },
                    mandant: {
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
                    agent: {
                        select: {
                            id: true,
                            prenom: true,
                            nom: true,
                        },
                    },
                    visites: {
                        orderBy: { dateVisite: "desc" },
                        take: 10,
                        include: {
                            visiteur: {
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

            if (!mandat) {
                throw new NotFoundError("Mandat non trouvé");
            }

            return NextResponse.json({ mandat });
        },
        {
            anyCapability: ["mandats_immo"],
            context: { resourceName: "MandatImmobilier", operation: "get" },
        }
    );
}

/**
 * PATCH /api/immobilier/mandats/[id]
 * Update mandat
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;
            const body = await request.json();

            const existing = await prisma.mandatImmobilier.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Mandat non trouvé");
            }

            const updateData: Record<string, unknown> = {};

            if (body.statut !== undefined) updateData.statut = body.statut;
            if (body.typeMandat !== undefined) updateData.typeMandat = body.typeMandat;
            if (body.dateFin !== undefined) updateData.dateFin = body.dateFin ? new Date(body.dateFin) : null;
            if (body.prixMandat !== undefined) updateData.prixMandat = body.prixMandat;
            if (body.tauxHonoraires !== undefined) updateData.tauxHonoraires = body.tauxHonoraires;
            if (body.honorairesHT !== undefined) updateData.honorairesHT = body.honorairesHT;
            if (body.honorairesTTC !== undefined) updateData.honorairesTTC = body.honorairesTTC;
            if (body.chargeVendeur !== undefined) updateData.chargeVendeur = body.chargeVendeur;
            if (body.agentId !== undefined) updateData.agentId = body.agentId;
            if (body.notes !== undefined) updateData.notes = body.notes;

            const mandat = await prisma.mandatImmobilier.update({
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
                    mandant: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
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

            if (body.statut === "TERMINE" || body.statut === "RESILIE") {
                await prisma.bienImmobilier.update({
                    where: { id: mandat.bienId },
                    data: { statut: body.statut === "TERMINE" ? "VENDU" : "DISPONIBLE" },
                });
            }

            return NextResponse.json({ mandat });
        },
        {
            anyCapability: ["mandats_immo"],
            context: { resourceName: "MandatImmobilier", operation: "update" },
        }
    );
}

/**
 * DELETE /api/immobilier/mandats/[id]
 * Delete mandat
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.mandatImmobilier.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Mandat non trouvé");
            }

            if (existing.statut === "EN_COURS") {
                throw new BusinessError(
                    "Impossible de supprimer un mandat actif. Résiliez-le d'abord."
                );
            }

            await prisma.mandatImmobilier.delete({ where: { id } });

            return NextResponse.json({ success: true });
        },
        {
            anyCapability: ["mandats_immo"],
            context: { resourceName: "MandatImmobilier", operation: "delete" },
        }
    );
}
