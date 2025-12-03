import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { ValidationError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/immobilier/visites
 * List visits with filters
 */
export async function GET(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const searchParams = request.nextUrl.searchParams;
            const statut = searchParams.get("statut");
            const bienId = searchParams.get("bienId");
            const agentId = searchParams.get("agentId");
            const dateFrom = searchParams.get("dateFrom");
            const dateTo = searchParams.get("dateTo");
            const today = searchParams.get("today");

            const where: Record<string, unknown> = {
                entrepriseId: ctx.entrepriseId,
            };

            if (statut && statut !== "ALL") {
                where.statut = statut;
            }

            if (bienId) {
                where.bienId = bienId;
            }

            if (agentId) {
                where.agentId = agentId;
            }

            if (today === "true") {
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);
                where.dateVisite = {
                    gte: startOfDay,
                    lte: endOfDay,
                };
            } else {
                if (dateFrom || dateTo) {
                    where.dateVisite = {
                        ...(dateFrom && { gte: new Date(dateFrom) }),
                        ...(dateTo && { lte: new Date(dateTo) }),
                    };
                }
            }

            const visites = await prisma.visiteImmobilier.findMany({
                where,
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
                orderBy: { dateVisite: "asc" },
                take: 100,
            });

            return NextResponse.json({ visites });
        },
        {
            anyCapability: ["visites_immo"],
            context: { resourceName: "VisiteImmobilier", operation: "list" },
        }
    );
}

/**
 * POST /api/immobilier/visites
 * Create new visit
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();

            if (!body.bienId || !body.visiteurId || !body.dateVisite) {
                throw new ValidationError("Bien, visiteur et date requis");
            }

            const visite = await prisma.visiteImmobilier.create({
                data: {
                    entrepriseId: ctx.entrepriseId,
                    bienId: body.bienId,
                    visiteurId: body.visiteurId,
                    mandatId: body.mandatId,
                    agentId: body.agentId,
                    dateVisite: new Date(body.dateVisite),
                    duree: body.duree || 30,
                    statut: "PLANIFIEE",
                },
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

            return NextResponse.json({ visite }, { status: 201 });
        },
        {
            anyCapability: ["visites_immo"],
            context: { resourceName: "VisiteImmobilier", operation: "create" },
        }
    );
}
