import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET /api/immobilier/biens/[id]
 * Get single bien
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const bien = await prisma.bienImmobilier.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    proprietaire: {
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
                    mandats: {
                        orderBy: { createdAt: "desc" },
                        take: 5,
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
                    diffusions: {
                        orderBy: { createdAt: "desc" },
                    },
                    estimations: {
                        orderBy: { dateEstimation: "desc" },
                        take: 5,
                    },
                    _count: {
                        select: {
                            visites: true,
                            diffusions: true,
                            mandats: true,
                        },
                    },
                },
            });

            if (!bien) {
                throw new NotFoundError("Bien non trouvé");
            }

            return NextResponse.json({ bien });
        },
        {
            anyCapability: ["biens_immo"],
            context: { resourceName: "BienImmobilier", operation: "get" },
        }
    );
}

/**
 * PATCH /api/immobilier/biens/[id]
 * Update bien
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;
            const body = await request.json();

            const existing = await prisma.bienImmobilier.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Bien non trouvé");
            }

            const fields = [
                "titre", "description", "typeBien", "statut",
                "enVente", "enLocation", "prixVente", "prixLocation", "chargesLoc",
                "adresse", "codePostal", "ville", "pays", "latitude", "longitude",
                "etage", "ascenseur", "surface", "nbPieces", "nbChambres",
                "nbSallesBains", "nbWc", "balcon", "terrasse", "jardin",
                "surfaceJardin", "parking", "garage", "cave", "piscine",
                "anneeConstruction", "etatGeneral", "dpeConsommation", "dpeEmission",
                "enCopropriete", "nbLotsCopro", "chargesCopro", "proprietaireId", "photos"
            ];

            const updateData: Record<string, unknown> = {};
            fields.forEach(field => {
                if (body[field] !== undefined) {
                    updateData[field] = body[field];
                }
            });

            const bien = await prisma.bienImmobilier.update({
                where: { id },
                data: updateData,
                include: {
                    proprietaire: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                        },
                    },
                },
            });

            return NextResponse.json({ bien });
        },
        {
            anyCapability: ["biens_immo"],
            context: { resourceName: "BienImmobilier", operation: "update" },
        }
    );
}

/**
 * DELETE /api/immobilier/biens/[id]
 * Delete bien
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.bienImmobilier.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Bien non trouvé");
            }

            const activeMandats = await prisma.mandatImmobilier.count({
                where: {
                    bienId: id,
                    statut: "EN_COURS",
                },
            });

            if (activeMandats > 0) {
                throw new BusinessError(
                    "Impossible de supprimer un bien avec des mandats actifs"
                );
            }

            await prisma.bienImmobilier.delete({ where: { id } });

            return NextResponse.json({ success: true });
        },
        {
            anyCapability: ["biens_immo"],
            context: { resourceName: "BienImmobilier", operation: "delete" },
        }
    );
}
