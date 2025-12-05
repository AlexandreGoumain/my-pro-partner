import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { ValidationError, NotFoundError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/immobilier/estimations
 * List estimations with filters
 */
export async function GET(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const searchParams = request.nextUrl.searchParams;
            const bienId = searchParams.get("bienId");
            const agentId = searchParams.get("agentId");
            const dateFrom = searchParams.get("dateFrom");
            const dateTo = searchParams.get("dateTo");
            const search = searchParams.get("search");

            const where: Record<string, unknown> = {
                bien: {
                    entrepriseId: ctx.entrepriseId,
                },
            };

            if (bienId) {
                where.bienId = bienId;
            }

            if (agentId) {
                where.agentId = agentId;
            }

            if (dateFrom || dateTo) {
                where.dateEstimation = {
                    ...(dateFrom && { gte: new Date(dateFrom) }),
                    ...(dateTo && { lte: new Date(dateTo) }),
                };
            }

            if (search) {
                where.OR = [
                    { bien: { titre: { contains: search, mode: "insensitive" } } },
                    { bien: { reference: { contains: search, mode: "insensitive" } } },
                    { bien: { ville: { contains: search, mode: "insensitive" } } },
                    { notes: { contains: search, mode: "insensitive" } },
                ];
            }

            const estimations = await prisma.estimationBien.findMany({
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
                            surface: true,
                            nbPieces: true,
                            photos: true,
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
                orderBy: { dateEstimation: "desc" },
                take: 100,
            });

            return NextResponse.json({ estimations });
        },
        {
            anyCapability: ["estimation_immo"],
            context: { resourceName: "EstimationBien", operation: "list" },
        }
    );
}

/**
 * POST /api/immobilier/estimations
 * Create new estimation
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();

            if (!body.bienId || !body.prixEstimeBas || !body.prixEstimeHaut || !body.prixRecommande) {
                throw new ValidationError("Bien et prix d'estimation requis");
            }

            const bien = await prisma.bienImmobilier.findFirst({
                where: {
                    id: body.bienId,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!bien) {
                throw new NotFoundError("Bien non trouvé");
            }

            const estimation = await prisma.estimationBien.create({
                data: {
                    entrepriseId: ctx.entrepriseId,
                    bienId: body.bienId,
                    prixEstimeBas: body.prixEstimeBas,
                    prixEstimeHaut: body.prixEstimeHaut,
                    prixRecommande: body.prixRecommande,
                    methode: body.methode,
                    comparables: body.comparables,
                    agentId: body.agentId,
                    validiteJours: body.validiteJours || 90,
                    notes: body.notes,
                },
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
                    agent: {
                        select: {
                            id: true,
                            prenom: true,
                            nom: true,
                        },
                    },
                },
            });

            return NextResponse.json({ estimation }, { status: 201 });
        },
        {
            anyCapability: ["estimation_immo"],
            context: { resourceName: "EstimationBien", operation: "create" },
        }
    );
}
