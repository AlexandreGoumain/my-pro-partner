import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { ValidationError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/syndic/ag
 * List general assemblies
 */
export async function GET(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const searchParams = request.nextUrl.searchParams;
            const coproprieteId = searchParams.get("coproprieteId");
            const type = searchParams.get("type");
            const statut = searchParams.get("statut");
            const upcoming = searchParams.get("upcoming");

            const where: Record<string, unknown> = {
                entrepriseId: ctx.entrepriseId,
            };

            if (coproprieteId) {
                where.coproprieteId = coproprieteId;
            }

            if (type && type !== "ALL") {
                where.typeAG = type;
            }

            if (statut && statut !== "ALL") {
                where.statut = statut;
            }

            // Filter for upcoming AGs
            if (upcoming === "true") {
                where.dateAG = { gte: new Date() };
                where.statut = { in: ["PLANIFIEE", "CONVOCATIONS_ENVOYEES", "EN_COURS"] };
            }

            const assemblees = await prisma.assembleeGenerale.findMany({
                where,
                include: {
                    copropriete: {
                        select: {
                            id: true,
                            nom: true,
                            adresse: true,
                            ville: true,
                        },
                    },
                    resolutions: {
                        orderBy: { numero: "asc" },
                    },
                    _count: {
                        select: {
                            resolutions: true,
                        },
                    },
                },
                orderBy: { dateAG: "desc" },
                take: 100,
            });

            return NextResponse.json({ assemblees });
        },
        {
            anyCapability: ["assemblees_generales"],
            context: { resourceName: "AssembleeGenerale", operation: "list" },
        }
    );
}

/**
 * POST /api/syndic/ag
 * Create new general assembly
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();

            if (!body.coproprieteId || !body.dateAG) {
                throw new ValidationError("Copropriété et date requises");
            }

            const dateConvocation = body.dateConvocation
                ? new Date(body.dateConvocation)
                : new Date();

            const ag = await prisma.assembleeGenerale.create({
                data: {
                    entrepriseId: ctx.entrepriseId,
                    coproprieteId: body.coproprieteId,
                    typeAG: body.typeAG || body.type || "ORDINAIRE",
                    dateConvocation,
                    dateAG: new Date(body.dateAG),
                    lieu: body.lieu || "",
                    heureDebut: body.heureDebut || "18:30",
                    statut: "PLANIFIEE",
                    ordreJour: body.ordreJour,
                    resolutions: body.resolutions
                        ? {
                              create: body.resolutions.map(
                                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                  (res: any, index: number) => ({
                                      numero: index + 1,
                                      titre: res.titre,
                                      description: res.description,
                                      typeMajorite: res.typeMajorite || "SIMPLE",
                                      entrepriseId: ctx.entrepriseId,
                                  })
                              ),
                          }
                        : undefined,
                },
                include: {
                    copropriete: {
                        select: {
                            id: true,
                            nom: true,
                        },
                    },
                    resolutions: true,
                },
            });

            return NextResponse.json({ ag }, { status: 201 });
        },
        {
            anyCapability: ["assemblees_generales"],
            context: { resourceName: "AssembleeGenerale", operation: "create" },
        }
    );
}
