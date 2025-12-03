import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { ValidationError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/syndic/lots
 * List lots
 */
export async function GET(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const searchParams = request.nextUrl.searchParams;
            const coproprieteId = searchParams.get("coproprieteId");
            const typeLot = searchParams.get("typeLot");
            const search = searchParams.get("search");

            const where: Record<string, unknown> = {
                entrepriseId: ctx.entrepriseId,
            };

            if (coproprieteId) {
                where.coproprieteId = coproprieteId;
            }

            if (typeLot && typeLot !== "ALL") {
                where.typeLot = typeLot;
            }

            if (search) {
                where.OR = [
                    { numero: { contains: search, mode: "insensitive" } },
                    { coproprietaire: { nom: { contains: search, mode: "insensitive" } } },
                ];
            }

            const lots = await prisma.lotCopropriete.findMany({
                where,
                include: {
                    copropriete: {
                        select: {
                            id: true,
                            nom: true,
                            adresse: true,
                        },
                    },
                    coproprietaire: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            telephone: true,
                            email: true,
                        },
                    },
                    locataire: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            telephone: true,
                        },
                    },
                },
                orderBy: [{ coproprieteId: "asc" }, { numero: "asc" }],
            });

            return NextResponse.json({ lots });
        },
        {
            anyCapability: ["lots_copro"],
            context: { resourceName: "LotCopropriete", operation: "list" },
        }
    );
}

/**
 * POST /api/syndic/lots
 * Create new lot
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();

            if (!body.coproprieteId || !body.numero || body.tantiemesGeneraux === undefined) {
                throw new ValidationError("Copropriété, numéro et tantièmes généraux requis");
            }

            // Check for duplicate numero in same copropriete
            const existing = await prisma.lotCopropriete.findFirst({
                where: {
                    coproprieteId: body.coproprieteId,
                    numero: body.numero,
                },
            });

            if (existing) {
                throw new BusinessError("Un lot avec ce numéro existe déjà");
            }

            const lot = await prisma.lotCopropriete.create({
                data: {
                    entrepriseId: ctx.entrepriseId,
                    coproprieteId: body.coproprieteId,
                    numero: body.numero,
                    typeLot: body.typeLot || "APPARTEMENT",
                    etage: body.etage,
                    batiment: body.batiment,
                    surface: body.surface,
                    tantiemesGeneraux: body.tantiemesGeneraux,
                    tantiemesParticuliers: body.tantiemesParticuliers,
                    coproprietaireId: body.coproprietaireId,
                    locataireId: body.locataireId,
                    estLoue: body.estLoue || false,
                    notes: body.notes,
                },
                include: {
                    copropriete: {
                        select: {
                            id: true,
                            nom: true,
                        },
                    },
                    coproprietaire: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                        },
                    },
                },
            });

            // Update nbLots in copropriete
            await prisma.copropriete.update({
                where: { id: body.coproprieteId },
                data: {
                    nbLots: {
                        increment: 1,
                    },
                },
            });

            return NextResponse.json({ lot }, { status: 201 });
        },
        {
            anyCapability: ["lots_copro"],
            context: { resourceName: "LotCopropriete", operation: "create" },
        }
    );
}
