import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/immobilier/diffusion/[id]
 * Get single diffusion
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const diffusion = await prisma.diffusionAnnonce.findFirst({
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
                            description: true,
                        },
                    },
                    _count: {
                        select: {
                            leads: true,
                        },
                    },
                },
            });

            if (!diffusion) {
                throw new NotFoundError("Diffusion non trouvée");
            }

            return NextResponse.json({ diffusion });
        },
        {
            anyCapability: ["diffusion_annonces"],
            context: { resourceName: "DiffusionAnnonce", operation: "get" },
        }
    );
}

/**
 * PATCH /api/immobilier/diffusion/[id]
 * Update diffusion
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;
            const body = await request.json();

            const existing = await prisma.diffusionAnnonce.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Diffusion non trouvée");
            }

            const updateData: Record<string, unknown> = {};

            if (body.statut !== undefined) {
                updateData.statut = body.statut;
                if (body.statut === "ACTIVE" && !existing.datePublication) {
                    updateData.datePublication = new Date();
                }
                if (body.statut === "EXPIREE" && !existing.dateExpiration) {
                    updateData.dateExpiration = new Date();
                }
            }

            if (body.typeAnnonce !== undefined) updateData.typeAnnonce = body.typeAnnonce;
            if (body.titreAnnonce !== undefined) updateData.titreAnnonce = body.titreAnnonce;
            if (body.descriptionAnnonce !== undefined) updateData.descriptionAnnonce = body.descriptionAnnonce;
            if (body.photosSelectionnees !== undefined) updateData.photosSelectionnees = body.photosSelectionnees;
            if (body.urlAnnonce !== undefined) updateData.urlAnnonce = body.urlAnnonce;
            if (body.vues !== undefined) updateData.vues = body.vues;
            if (body.contacts !== undefined) updateData.contacts = body.contacts;

            const diffusion = await prisma.diffusionAnnonce.update({
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
                            prixVente: true,
                            photos: true,
                        },
                    },
                    _count: {
                        select: {
                            leads: true,
                        },
                    },
                },
            });

            return NextResponse.json({ diffusion });
        },
        {
            anyCapability: ["diffusion_annonces"],
            context: { resourceName: "DiffusionAnnonce", operation: "update" },
        }
    );
}

/**
 * DELETE /api/immobilier/diffusion/[id]
 * Delete diffusion (retire from portal)
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.diffusionAnnonce.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Diffusion non trouvée");
            }

            if (existing.statut === "ACTIVE") {
                await prisma.diffusionAnnonce.update({
                    where: { id },
                    data: {
                        statut: "EXPIREE",
                        dateExpiration: new Date(),
                    },
                });
            } else {
                await prisma.diffusionAnnonce.delete({ where: { id } });
            }

            return NextResponse.json({ success: true });
        },
        {
            anyCapability: ["diffusion_annonces"],
            context: { resourceName: "DiffusionAnnonce", operation: "delete" },
        }
    );
}
