import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/immobilier/visites/[id]
 * Get single visite
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const visite = await prisma.visiteImmobilier.findFirst({
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
                            photos: true,
                            prixVente: true,
                        },
                    },
                    visiteur: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            telephone: true,
                            email: true,
                        },
                    },
                    agent: {
                        select: {
                            id: true,
                            prenom: true,
                            nom: true,
                        },
                    },
                    mandat: {
                        select: {
                            id: true,
                            numero: true,
                        },
                    },
                },
            });

            if (!visite) {
                throw new NotFoundError("Visite non trouvée");
            }

            return NextResponse.json({ visite });
        },
        {
            anyCapability: ["visites_immo"],
            context: { resourceName: "VisiteImmobilier", operation: "get" },
        }
    );
}

/**
 * PATCH /api/immobilier/visites/[id]
 * Update visite
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;
            const body = await request.json();

            const existing = await prisma.visiteImmobilier.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Visite non trouvée");
            }

            const updateData: Record<string, unknown> = {};

            if (body.statut !== undefined) updateData.statut = body.statut;
            if (body.dateVisite !== undefined) updateData.dateVisite = new Date(body.dateVisite);
            if (body.duree !== undefined) updateData.duree = body.duree;
            if (body.agentId !== undefined) updateData.agentId = body.agentId;
            if (body.compteRendu !== undefined) updateData.compteRendu = body.compteRendu;
            if (body.noteInteret !== undefined) updateData.noteInteret = body.noteInteret;
            if (body.notes !== undefined) updateData.notes = body.notes;

            const visite = await prisma.visiteImmobilier.update({
                where: { id },
                data: updateData,
                include: {
                    bien: {
                        select: {
                            id: true,
                            reference: true,
                            titre: true,
                        },
                    },
                    visiteur: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            telephone: true,
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

            return NextResponse.json({ visite });
        },
        {
            anyCapability: ["visites_immo"],
            context: { resourceName: "VisiteImmobilier", operation: "update" },
        }
    );
}

/**
 * DELETE /api/immobilier/visites/[id]
 * Delete visite
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.visiteImmobilier.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Visite non trouvée");
            }

            await prisma.visiteImmobilier.delete({ where: { id } });

            return NextResponse.json({ success: true });
        },
        {
            anyCapability: ["visites_immo"],
            context: { resourceName: "VisiteImmobilier", operation: "delete" },
        }
    );
}
