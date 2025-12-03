import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { ValidationError, NotFoundError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/syndic/charges
 * List charge calls
 */
export async function GET(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const searchParams = request.nextUrl.searchParams;
            const coproprieteId = searchParams.get("coproprieteId");
            const type = searchParams.get("type");
            const statut = searchParams.get("statut");
            const trimestre = searchParams.get("trimestre");
            const annee = searchParams.get("annee");

            const where: Record<string, unknown> = {
                entrepriseId: ctx.entrepriseId,
            };

            if (coproprieteId) {
                where.coproprieteId = coproprieteId;
            }

            if (type && type !== "ALL") {
                where.typeAppel = type;
            }

            if (statut && statut !== "ALL") {
                where.statut = statut;
            }

            if (trimestre) {
                where.trimestre = parseInt(trimestre);
            }

            if (annee) {
                where.annee = parseInt(annee);
            }

            const charges = await prisma.appelCharges.findMany({
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
                    lignes: {
                        include: {
                            lot: {
                                select: {
                                    id: true,
                                    numero: true,
                                    typeLot: true,
                                    coproprietaire: {
                                        select: {
                                            id: true,
                                            nom: true,
                                            prenom: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: [{ annee: "desc" }, { trimestre: "desc" }],
                take: 100,
            });

            return NextResponse.json({ charges });
        },
        {
            anyCapability: ["charges_copro"],
            context: { resourceName: "AppelCharges", operation: "list" },
        }
    );
}

/**
 * POST /api/syndic/charges
 * Generate charge calls
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();

            if (!body.coproprieteId) {
                throw new ValidationError("Copropriété requise");
            }

            const trimestre = body.trimestre || Math.ceil((new Date().getMonth() + 1) / 3);
            const annee = body.annee || new Date().getFullYear();

            // Get copropriete with its lots
            const copropriete = await prisma.copropriete.findUnique({
                where: { id: body.coproprieteId },
                include: {
                    lots: {
                        where: { coproprietaireId: { not: null } },
                        select: {
                            id: true,
                            numero: true,
                            tantiemesGeneraux: true,
                            coproprietaireId: true,
                        },
                    },
                },
            });

            if (!copropriete) {
                throw new NotFoundError("Copropriété non trouvée");
            }

            // Check if already exists
            const existing = await prisma.appelCharges.findFirst({
                where: {
                    coproprieteId: body.coproprieteId,
                    trimestre,
                    annee,
                    typeAppel: body.typeAppel || "BUDGET_PREVISIONNEL",
                },
            });

            if (existing) {
                throw new BusinessError("Appel de charges déjà existant pour ce trimestre");
            }

            // Generate numero
            const numero = `CHG-${annee}T${trimestre}-${copropriete.id.slice(-4)}`;

            // Calculate total tantiemes
            const totalTantiemes = copropriete.lots.reduce(
                (sum, lot) => sum + lot.tantiemesGeneraux,
                0
            );

            // Calculate quarterly budget (montant must be provided by frontend)
            const montantTotal = body.montantTotal || 0;

            const dateEcheance = new Date(annee, (trimestre - 1) * 3 + 1, 15);

            // Create the charge call
            const appelCharges = await prisma.appelCharges.create({
                data: {
                    numero,
                    entrepriseId: ctx.entrepriseId,
                    coproprieteId: body.coproprieteId,
                    typeAppel: body.typeAppel || "BUDGET_PREVISIONNEL",
                    trimestre,
                    annee,
                    montantTotal,
                    dateEcheance,
                    statut: "BROUILLON",
                    lignes: {
                        create: copropriete.lots.map((lot) => ({
                            lotId: lot.id,
                            montantDu: totalTantiemes > 0 ? (montantTotal * lot.tantiemesGeneraux) / totalTantiemes : 0,
                            montantPaye: 0,
                            entrepriseId: ctx.entrepriseId,
                        })),
                    },
                },
                include: {
                    copropriete: {
                        select: {
                            id: true,
                            nom: true,
                        },
                    },
                    lignes: {
                        include: {
                            lot: {
                                select: {
                                    id: true,
                                    numero: true,
                                    coproprietaire: {
                                        select: {
                                            nom: true,
                                            prenom: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            return NextResponse.json({ appelCharges }, { status: 201 });
        },
        {
            anyCapability: ["charges_copro"],
            context: { resourceName: "AppelCharges", operation: "create" },
        }
    );
}
