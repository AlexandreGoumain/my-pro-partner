import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/syndic/charges - List charge calls
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("charges_copro");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const coproprieteId = searchParams.get("coproprieteId");
        const type = searchParams.get("type");
        const statut = searchParams.get("statut");
        const trimestre = searchParams.get("trimestre");
        const annee = searchParams.get("annee");

        const where: any = {
            entrepriseId: session.user.entrepriseId,
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
    } catch (error) {
        console.error("Error fetching charges:", error);
        return NextResponse.json(
            { error: "Failed to fetch charges" },
            { status: 500 }
        );
    }
}

// POST /api/syndic/charges - Generate charge calls
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("charges_copro");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();

        if (!body.coproprieteId) {
            return NextResponse.json(
                { error: "Copropriété requise" },
                { status: 400 }
            );
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
            return NextResponse.json(
                { error: "Copropriété non trouvée" },
                { status: 404 }
            );
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
            return NextResponse.json(
                { error: "Appel de charges déjà existant pour ce trimestre" },
                { status: 400 }
            );
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

        const dateEcheance = new Date(annee, (trimestre - 1) * 3 + 1, 15); // 15th of middle month of trimester

        // Create the charge call
        const appelCharges = await prisma.appelCharges.create({
            data: {
                numero,
                entrepriseId: session.user.entrepriseId,
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
                        entrepriseId: session.user.entrepriseId,
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
    } catch (error) {
        console.error("Error creating charges:", error);
        return NextResponse.json(
            { error: "Failed to create charges" },
            { status: 500 }
        );
    }
}
