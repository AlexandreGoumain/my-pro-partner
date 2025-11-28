import { authOptions } from "@/lib/auth";
import { Prisma } from "@/lib/generated/prisma";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import type { EntreeTempsCreateInput } from "@/lib/types/mission";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/temps - List time entries with filters
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("temps_passe");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const missionId = searchParams.get("missionId");
        const userId = searchParams.get("userId");
        const dateDebut = searchParams.get("dateDebut");
        const dateFin = searchParams.get("dateFin");
        const facturable = searchParams.get("facturable");
        const facturee = searchParams.get("facturee");
        const limit = parseInt(searchParams.get("limit") || "100");

        const where: Prisma.EntreeTempsWhereInput = {
            entrepriseId: session.user.entrepriseId,
        };

        if (missionId) {
            where.missionId = missionId;
        }

        if (userId) {
            where.userId = userId;
        }

        if (dateDebut || dateFin) {
            where.date = {};
            if (dateDebut) {
                where.date.gte = new Date(dateDebut);
            }
            if (dateFin) {
                where.date.lte = new Date(dateFin);
            }
        }

        if (facturable !== null && facturable !== undefined) {
            where.facturable = facturable === "true";
        }

        if (facturee !== null && facturee !== undefined) {
            where.facturee = facturee === "true";
        }

        const entrees = await prisma.entreeTemps.findMany({
            where,
            include: {
                mission: {
                    select: {
                        id: true,
                        numero: true,
                        nom: true,
                        client: {
                            select: {
                                id: true,
                                nom: true,
                            },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { date: "desc" },
            take: limit,
        });

        // Convert Decimal fields
        const formattedEntrees = entrees.map((e) => ({
            ...e,
            tauxHoraire: Number(e.tauxHoraire),
            montant: Number(e.montant),
        }));

        return NextResponse.json({ entrees: formattedEntrees });
    } catch (error) {
        console.error("Error fetching time entries:", error);
        return NextResponse.json(
            { error: "Failed to fetch time entries" },
            { status: 500 }
        );
    }
}

// POST /api/temps - Create new time entry
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId || !session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("temps_passe");
        if (capabilityCheck) return capabilityCheck;

        const body: EntreeTempsCreateInput = await request.json();

        // Validation
        if (!body.missionId) {
            return NextResponse.json(
                { error: "La mission est requise" },
                { status: 400 }
            );
        }

        if (!body.date) {
            return NextResponse.json(
                { error: "La date est requise" },
                { status: 400 }
            );
        }

        if (!body.duree || body.duree <= 0) {
            return NextResponse.json(
                { error: "La durée doit être supérieure à 0" },
                { status: 400 }
            );
        }

        if (!body.description?.trim()) {
            return NextResponse.json(
                { error: "La description est requise" },
                { status: 400 }
            );
        }

        // Verify mission exists and belongs to enterprise
        const mission = await prisma.mission.findFirst({
            where: {
                id: body.missionId,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!mission) {
            return NextResponse.json(
                { error: "Mission introuvable" },
                { status: 404 }
            );
        }

        // Get taux horaire: use provided, or mission rate, or default 80€
        const tauxHoraire =
            body.tauxHoraire ??
            (mission.tauxHoraire ? Number(mission.tauxHoraire) : 80);

        // Calculate montant
        const montant = (body.duree / 60) * tauxHoraire;

        const entree = await prisma.entreeTemps.create({
            data: {
                missionId: body.missionId,
                userId: session.user.id,
                entrepriseId: session.user.entrepriseId,
                date: new Date(body.date),
                duree: body.duree,
                description: body.description.trim(),
                facturable: body.facturable ?? true,
                tauxHoraire,
                montant,
            },
            include: {
                mission: {
                    select: {
                        id: true,
                        numero: true,
                        nom: true,
                        client: {
                            select: {
                                id: true,
                                nom: true,
                            },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        // Update mission totals
        await updateMissionTotals(body.missionId);

        // Convert Decimal fields
        const formattedEntree = {
            ...entree,
            tauxHoraire: Number(entree.tauxHoraire),
            montant: Number(entree.montant),
        };

        return NextResponse.json({ entree: formattedEntree }, { status: 201 });
    } catch (error) {
        console.error("Error creating time entry:", error);
        return NextResponse.json(
            { error: "Failed to create time entry" },
            { status: 500 }
        );
    }
}

// Helper to update mission totals after time entry changes
async function updateMissionTotals(missionId: string) {
    const result = await prisma.entreeTemps.aggregate({
        where: { missionId },
        _sum: {
            duree: true,
            montant: true,
        },
    });

    const facturableResult = await prisma.entreeTemps.aggregate({
        where: { missionId, facturable: true },
        _sum: {
            duree: true,
        },
    });

    await prisma.mission.update({
        where: { id: missionId },
        data: {
            totalHeures: result._sum.duree || 0,
            totalFacturable: facturableResult._sum.duree || 0,
            totalMontant: result._sum.montant || 0,
        },
    });
}
