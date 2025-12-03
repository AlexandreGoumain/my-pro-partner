import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { ValidationError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/syndic/comptabilite
 * List écritures comptables
 */
export async function GET(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const searchParams = request.nextUrl.searchParams;
            const coproprieteId = searchParams.get("coproprieteId");
            const typeEcriture = searchParams.get("typeEcriture");
            const compte = searchParams.get("compte");
            const dateFrom = searchParams.get("dateFrom");
            const dateTo = searchParams.get("dateTo");
            const search = searchParams.get("search");

            const where: Record<string, unknown> = {
                entrepriseId: ctx.entrepriseId,
            };

            if (coproprieteId) {
                where.coproprieteId = coproprieteId;
            }

            if (typeEcriture && typeEcriture !== "ALL") {
                where.typeEcriture = typeEcriture;
            }

            if (compte) {
                where.compte = compte;
            }

            if (dateFrom) {
                where.dateEcriture = { ...((where.dateEcriture as object) || {}), gte: new Date(dateFrom) };
            }

            if (dateTo) {
                where.dateEcriture = { ...((where.dateEcriture as object) || {}), lte: new Date(dateTo) };
            }

            if (search) {
                where.OR = [
                    { libelle: { contains: search, mode: "insensitive" } },
                    { compte: { contains: search, mode: "insensitive" } },
                ];
            }

            const ecritures = await prisma.ecritureComptableCopro.findMany({
                where,
                include: {
                    copropriete: {
                        select: {
                            id: true,
                            nom: true,
                        },
                    },
                    lot: {
                        select: {
                            id: true,
                            numero: true,
                        },
                    },
                },
                orderBy: { dateEcriture: "desc" },
                take: 500,
            });

            return NextResponse.json({ ecritures });
        },
        {
            anyCapability: ["comptabilite_copro"],
            context: { resourceName: "EcritureComptableCopro", operation: "list" },
        }
    );
}

/**
 * POST /api/syndic/comptabilite
 * Create écriture
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();

            if (!body.coproprieteId || !body.dateEcriture || !body.libelle || !body.montant || !body.typeEcriture || !body.compte) {
                throw new ValidationError("Copropriété, date, libellé, montant, type et compte requis");
            }

            const ecriture = await prisma.ecritureComptableCopro.create({
                data: {
                    entrepriseId: ctx.entrepriseId,
                    coproprieteId: body.coproprieteId,
                    dateEcriture: new Date(body.dateEcriture),
                    libelle: body.libelle,
                    montant: body.montant,
                    typeEcriture: body.typeEcriture,
                    compte: body.compte,
                    categorieCharge: body.categorieCharge,
                    lotId: body.lotId,
                    pieceJustificative: body.pieceJustificative,
                    notes: body.notes,
                },
                include: {
                    copropriete: {
                        select: {
                            id: true,
                            nom: true,
                        },
                    },
                    lot: {
                        select: {
                            id: true,
                            numero: true,
                        },
                    },
                },
            });

            return NextResponse.json({ ecriture }, { status: 201 });
        },
        {
            anyCapability: ["comptabilite_copro"],
            context: { resourceName: "EcritureComptableCopro", operation: "create" },
        }
    );
}
