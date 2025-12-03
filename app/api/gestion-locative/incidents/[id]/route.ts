import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/gestion-locative/incidents/[id]
 * Get single incident
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const incident = await prisma.incidentLocatif.findFirst({
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
                                    ville: true,
                                    adresse: true,
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

            if (!incident) {
                throw new NotFoundError("Incident non trouvé");
            }

            return NextResponse.json({ incident });
        },
        {
            anyCapability: ["travaux_locatifs"],
            context: { resourceName: "IncidentLocatif", operation: "get" },
        }
    );
}

/**
 * PATCH /api/gestion-locative/incidents/[id]
 * Update incident
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;
            const body = await request.json();

            const existing = await prisma.incidentLocatif.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Incident non trouvé");
            }

            const updateData: Record<string, unknown> = {};

            if (body.statut) {
                updateData.statut = body.statut;

                // Set dates based on status
                if (body.statut === "TRAVAUX_PLANIFIES" && !existing.dateIntervention) {
                    updateData.dateIntervention = new Date();
                }
            }

            if (body.description !== undefined) {
                updateData.description = body.description;
            }

            if (body.categorie !== undefined) {
                updateData.categorie = body.categorie;
            }

            if (body.urgence !== undefined) {
                updateData.urgence = body.urgence;
            }

            if (body.notes !== undefined) {
                updateData.notes = body.notes;
            }

            if (body.photos !== undefined) {
                updateData.photos = body.photos;
            }

            if (body.coutEstime !== undefined) {
                updateData.coutEstime = body.coutEstime;
            }

            if (body.coutReel !== undefined) {
                updateData.coutReel = body.coutReel;
            }

            if (body.prestataire !== undefined) {
                updateData.prestataire = body.prestataire;
            }

            if (body.aChargeDe !== undefined) {
                updateData.aChargeDe = body.aChargeDe;
            }

            if (body.dateIntervention !== undefined) {
                updateData.dateIntervention = body.dateIntervention ? new Date(body.dateIntervention) : null;
            }

            const incident = await prisma.incidentLocatif.update({
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
                                    ville: true,
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

            return NextResponse.json({ incident });
        },
        {
            anyCapability: ["travaux_locatifs"],
            context: { resourceName: "IncidentLocatif", operation: "update" },
        }
    );
}

/**
 * DELETE /api/gestion-locative/incidents/[id]
 * Delete incident
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.incidentLocatif.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Incident non trouvé");
            }

            // Prevent deletion of resolved incidents with costs
            if (existing.statut === "RESOLU" && existing.coutReel) {
                throw new BusinessError(
                    "Impossible de supprimer un incident résolu avec des frais"
                );
            }

            await prisma.incidentLocatif.delete({
                where: { id },
            });

            return NextResponse.json({ success: true });
        },
        {
            anyCapability: ["travaux_locatifs"],
            context: { resourceName: "IncidentLocatif", operation: "delete" },
        }
    );
}
