import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { ValidationError, NotFoundError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/immobilier/diffusion
 * List diffusions with filters
 */
export async function GET(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const searchParams = request.nextUrl.searchParams;
            const bienId = searchParams.get("bienId");
            const portail = searchParams.get("portail");
            const statut = searchParams.get("statut");

            const where: Record<string, unknown> = {
                entrepriseId: ctx.entrepriseId,
            };

            if (bienId) {
                where.bienId = bienId;
            }

            if (portail && portail !== "ALL") {
                where.portail = portail;
            }

            if (statut && statut !== "ALL") {
                where.statut = statut;
            }

            const diffusions = await prisma.diffusionAnnonce.findMany({
                where,
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
                orderBy: { createdAt: "desc" },
                take: 100,
            });

            return NextResponse.json({ diffusions });
        },
        {
            anyCapability: ["diffusion_annonces"],
            context: { resourceName: "DiffusionAnnonce", operation: "list" },
        }
    );
}

/**
 * POST /api/immobilier/diffusion
 * Publish to portals
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();

            if (!body.bienId || !body.portails || body.portails.length === 0) {
                throw new ValidationError("Bien et portails requis");
            }

            const bien = await prisma.bienImmobilier.findUnique({
                where: { id: body.bienId },
                select: {
                    id: true,
                    titre: true,
                    description: true,
                    typeBien: true,
                    prixVente: true,
                    photos: true,
                },
            });

            if (!bien) {
                throw new NotFoundError("Bien non trouvé");
            }

            const diffusions = await Promise.all(
                body.portails.map(async (portail: string) => {
                    const existing = await prisma.diffusionAnnonce.findFirst({
                        where: {
                            bienId: body.bienId,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            portail: portail as any,
                            statut: { in: ["EN_ATTENTE", "ACTIVE"] },
                        },
                    });

                    if (existing) {
                        return existing;
                    }

                    return prisma.diffusionAnnonce.create({
                        data: {
                            entrepriseId: ctx.entrepriseId,
                            bienId: body.bienId,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            portail: portail as any,
                            typeAnnonce: body.typeAnnonce || "STANDARD",
                            statut: "EN_ATTENTE",
                            titreAnnonce: body.titre || bien.titre,
                            descriptionAnnonce: body.description || bien.description,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            photosSelectionnees: (body.photos || bien.photos) as any,
                        },
                    });
                })
            );

            // Simulate publishing
            setTimeout(async () => {
                for (const diffusion of diffusions) {
                    await prisma.diffusionAnnonce.update({
                        where: { id: diffusion.id },
                        data: {
                            statut: "ACTIVE",
                            datePublication: new Date(),
                            urlAnnonce: `https://${diffusion.portail.toLowerCase()}.fr/annonce/${diffusion.id}`,
                        },
                    });
                }
            }, 2000);

            return NextResponse.json({ diffusions }, { status: 201 });
        },
        {
            anyCapability: ["diffusion_annonces"],
            context: { resourceName: "DiffusionAnnonce", operation: "create" },
        }
    );
}
