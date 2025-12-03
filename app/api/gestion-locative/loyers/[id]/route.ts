import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/gestion-locative/loyers/[id]
 * Get single loyer
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const loyer = await prisma.appelLoyer.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    bail: {
                        include: {
                            bien: {
                                select: {
                                    id: true,
                                    reference: true,
                                    titre: true,
                                    adresse: true,
                                    ville: true,
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

            if (!loyer) {
                throw new NotFoundError("Loyer non trouvé");
            }

            return NextResponse.json({ loyer });
        },
        {
            anyCapability: ["loyers"],
            context: { resourceName: "AppelLoyer", operation: "get" },
        }
    );
}

/**
 * PATCH /api/gestion-locative/loyers/[id]
 * Update loyer (status, payment)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;
            const body = await request.json();

            const existing = await prisma.appelLoyer.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Loyer non trouvé");
            }

            const updateData: Record<string, unknown> = {};

            if (body.statut) {
                updateData.statut = body.statut;
            }

            if (body.montantPaye !== undefined) {
                updateData.montantPaye = body.montantPaye;

                const totalDu = Number(existing.totalDu);
                const montantPaye = Number(body.montantPaye);

                if (montantPaye >= totalDu) {
                    updateData.statut = "PAYE";
                } else if (montantPaye > 0) {
                    updateData.statut = "PARTIELLEMENT_PAYE";
                }
            }

            if (body.datePaiement) {
                updateData.datePaiement = new Date(body.datePaiement);
            }

            if (body.dateEnvoi) {
                updateData.dateEnvoi = new Date(body.dateEnvoi);
                if (!body.statut && existing.statut === "A_ENVOYER") {
                    updateData.statut = "ENVOYE";
                }
            }

            if (body.quittanceUrl) {
                updateData.quittanceUrl = body.quittanceUrl;
                updateData.quittanceGeneree = true;
            }

            const loyer = await prisma.appelLoyer.update({
                where: { id },
                data: updateData,
                include: {
                    bail: {
                        include: {
                            bien: {
                                select: {
                                    id: true,
                                    reference: true,
                                    titre: true,
                                },
                            },
                            locatairePrincipal: {
                                select: {
                                    nom: true,
                                    prenom: true,
                                },
                            },
                        },
                    },
                },
            });

            return NextResponse.json({ loyer });
        },
        {
            anyCapability: ["loyers"],
            context: { resourceName: "AppelLoyer", operation: "update" },
        }
    );
}

/**
 * DELETE /api/gestion-locative/loyers/[id]
 * Delete loyer
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.appelLoyer.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Loyer non trouvé");
            }

            if (existing.statut === "PAYE") {
                throw new BusinessError(
                    "Impossible de supprimer un loyer déjà payé"
                );
            }

            await prisma.appelLoyer.delete({ where: { id } });

            return NextResponse.json({ success: true });
        },
        {
            anyCapability: ["loyers"],
            context: { resourceName: "AppelLoyer", operation: "delete" },
        }
    );
}
