import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { ValidationError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/syndic/conseil-syndical
 * List membres du conseil
 */
export async function GET(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const searchParams = request.nextUrl.searchParams;
            const coproprieteId = searchParams.get("coproprieteId");
            const actif = searchParams.get("actif");
            const role = searchParams.get("role");

            const where: Record<string, unknown> = {
                entrepriseId: ctx.entrepriseId,
            };

            if (coproprieteId) {
                where.coproprieteId = coproprieteId;
            }

            if (actif !== null) {
                where.actif = actif === "true";
            }

            if (role) {
                where.role = role;
            }

            const membres = await prisma.membreConseilSyndical.findMany({
                where,
                include: {
                    copropriete: {
                        select: {
                            id: true,
                            nom: true,
                        },
                    },
                    membre: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            telephone: true,
                            email: true,
                        },
                    },
                },
                orderBy: [{ coproprieteId: "asc" }, { role: "asc" }],
            });

            return NextResponse.json({ membres });
        },
        {
            anyCapability: ["conseil_syndical"],
            context: { resourceName: "MembreConseilSyndical", operation: "list" },
        }
    );
}

/**
 * POST /api/syndic/conseil-syndical
 * Add membre
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();

            if (!body.coproprieteId || !body.membreId || !body.role || !body.dateDebut) {
                throw new ValidationError("Copropriété, membre, rôle et date de début requis");
            }

            // Check if membre is already in conseil for this copropriete
            const existing = await prisma.membreConseilSyndical.findFirst({
                where: {
                    coproprieteId: body.coproprieteId,
                    membreId: body.membreId,
                    actif: true,
                },
            });

            if (existing) {
                throw new BusinessError("Ce membre fait déjà partie du conseil syndical");
            }

            const membre = await prisma.membreConseilSyndical.create({
                data: {
                    entrepriseId: ctx.entrepriseId,
                    coproprieteId: body.coproprieteId,
                    membreId: body.membreId,
                    role: body.role,
                    dateDebut: new Date(body.dateDebut),
                    dateFin: body.dateFin ? new Date(body.dateFin) : undefined,
                    actif: true,
                },
                include: {
                    copropriete: {
                        select: {
                            id: true,
                            nom: true,
                        },
                    },
                    membre: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            telephone: true,
                            email: true,
                        },
                    },
                },
            });

            return NextResponse.json({ membre }, { status: 201 });
        },
        {
            anyCapability: ["conseil_syndical"],
            context: { resourceName: "MembreConseilSyndical", operation: "create" },
        }
    );
}
