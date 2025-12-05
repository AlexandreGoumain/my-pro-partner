import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/gestion-locative/baux/[id]
 * Get single bail with full details
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const bail = await prisma.bailLocatif.findFirst({
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
                            adresse: true,
                            codePostal: true,
                            ville: true,
                            surface: true,
                            photos: true,
                        },
                    },
                    locatairePrincipal: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            telephone: true,
                            email: true,
                            adresse: true,
                            codePostal: true,
                            ville: true,
                        },
                    },
                    proprietaire: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            telephone: true,
                            email: true,
                        },
                    },
                    loyers: {
                        orderBy: [{ annee: "desc" }, { mois: "desc" }],
                        take: 12,
                    },
                    _count: {
                        select: {
                            loyers: true,
                        },
                    },
                },
            });

            if (!bail) {
                throw new NotFoundError("Bail non trouvé");
            }

            return NextResponse.json({ bail });
        },
        {
            anyCapability: ["baux_locatifs"],
            context: { resourceName: "BailLocatif", operation: "get" },
        }
    );
}

/**
 * PATCH /api/gestion-locative/baux/[id]
 * Update bail
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;
            const body = await request.json();

            const existing = await prisma.bailLocatif.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Bail non trouvé");
            }

            const updateData: Record<string, unknown> = {};

            if (body.statut) {
                updateData.statut = body.statut;

                // If bail is being terminated, update bien status
                if (body.statut === "TERMINE" || body.statut === "RESILIE") {
                    await prisma.bienImmobilier.update({
                        where: { id: existing.bienId },
                        data: { statut: "DISPONIBLE" },
                    });
                }
            }

            if (body.typeBail) updateData.typeBail = body.typeBail;
            if (body.loyerHC !== undefined) {
                updateData.loyerHC = body.loyerHC;
                updateData.loyerCC = body.loyerHC + (body.provisions ?? Number(existing.provisions));
            }
            if (body.provisions !== undefined) {
                updateData.provisions = body.provisions;
                updateData.loyerCC = (body.loyerHC ?? Number(existing.loyerHC)) + body.provisions;
            }
            if (body.depotGarantie !== undefined) updateData.depotGarantie = body.depotGarantie;
            if (body.dateDebut) updateData.dateDebut = new Date(body.dateDebut);
            if (body.dateFin) updateData.dateFin = new Date(body.dateFin);
            if (body.dureeMois) updateData.dureeMois = body.dureeMois;
            if (body.indiceReference) updateData.indiceReference = body.indiceReference;
            if (body.dateRevision) updateData.dateRevision = new Date(body.dateRevision);
            if (body.clausesParticulieres !== undefined) {
                updateData.clausesParticulieres = body.clausesParticulieres;
            }
            if (body.datePreavis) {
                updateData.datePreavis = new Date(body.datePreavis);
                updateData.statut = "PREAVIS";
            }

            const bail = await prisma.bailLocatif.update({
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
                    locatairePrincipal: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
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
            });

            return NextResponse.json({ bail });
        },
        {
            anyCapability: ["baux_locatifs"],
            context: { resourceName: "BailLocatif", operation: "update" },
        }
    );
}

/**
 * DELETE /api/gestion-locative/baux/[id]
 * Delete bail
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.bailLocatif.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    _count: {
                        select: {
                            loyers: true,
                        },
                    },
                },
            });

            if (!existing) {
                throw new NotFoundError("Bail non trouvé");
            }

            if (existing._count.loyers > 0) {
                throw new BusinessError(
                    "Impossible de supprimer un bail avec des loyers associés"
                );
            }

            // Update bien status back to available
            await prisma.bienImmobilier.update({
                where: { id: existing.bienId },
                data: { statut: "DISPONIBLE" },
            });

            await prisma.bailLocatif.delete({
                where: { id },
            });

            return NextResponse.json({ success: true });
        },
        {
            anyCapability: ["baux_locatifs"],
            context: { resourceName: "BailLocatif", operation: "delete" },
        }
    );
}
