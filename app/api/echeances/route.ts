import { authOptions } from "@/lib/auth";
import { Prisma } from "@/lib/generated/prisma";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import type { EcheanceFiscaleCreateInput } from "@/lib/types/mission";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/echeances - List échéances with filters
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("projets");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const statut = searchParams.get("statut");
        const type = searchParams.get("type");
        const clientId = searchParams.get("clientId");
        const missionId = searchParams.get("missionId");
        const search = searchParams.get("search");
        const periode = searchParams.get("periode");
        const limit = parseInt(searchParams.get("limit") || "100");

        const where: Prisma.EcheanceFiscaleWhereInput = {
            entrepriseId: session.user.entrepriseId,
        };

        const now = new Date();

        if (statut && statut !== "ALL") {
            const statuts = statut.split(",");
            if (statuts.length === 1) {
                where.statut = statut as any;
            } else {
                where.statut = { in: statuts as any };
            }
        }

        if (type && type !== "ALL") {
            const types = type.split(",");
            if (types.length === 1) {
                where.type = type as any;
            } else {
                where.type = { in: types as any };
            }
        }

        if (clientId) {
            where.clientId = clientId;
        }

        if (missionId) {
            where.missionId = missionId;
        }

        // Période filters
        if (periode === "avenir") {
            where.dateEcheance = { gte: now };
            where.statut = { notIn: ["VALIDE", "DEPOSE"] };
        } else if (periode === "retard") {
            where.dateEcheance = { lt: now };
            where.statut = { notIn: ["VALIDE", "DEPOSE"] };
        } else if (periode === "semaine") {
            const weekEnd = new Date(now);
            weekEnd.setDate(weekEnd.getDate() + 7);
            where.dateEcheance = { gte: now, lte: weekEnd };
        } else if (periode === "mois") {
            const monthEnd = new Date(now);
            monthEnd.setMonth(monthEnd.getMonth() + 1);
            where.dateEcheance = { gte: now, lte: monthEnd };
        }

        if (search) {
            where.OR = [
                { libelle: { contains: search, mode: "insensitive" } },
                { reference: { contains: search, mode: "insensitive" } },
                { notes: { contains: search, mode: "insensitive" } },
                { client: { nom: { contains: search, mode: "insensitive" } } },
                { mission: { nom: { contains: search, mode: "insensitive" } } },
            ];
        }

        const echeances = await prisma.echeanceFiscale.findMany({
            where,
            include: {
                client: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                    },
                },
                mission: {
                    select: {
                        id: true,
                        numero: true,
                        nom: true,
                    },
                },
            },
            orderBy: [{ dateEcheance: "asc" }],
            take: limit,
        });

        // Convert montant to number
        const formattedEcheances = echeances.map((e) => ({
            ...e,
            montant: e.montant ? Number(e.montant) : null,
        }));

        return NextResponse.json({ echeances: formattedEcheances });
    } catch (error) {
        console.error("Error fetching echeances:", error);
        return NextResponse.json(
            { error: "Failed to fetch echeances" },
            { status: 500 }
        );
    }
}

// POST /api/echeances - Create new échéance
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("projets");
        if (capabilityCheck) return capabilityCheck;

        const body: EcheanceFiscaleCreateInput = await request.json();

        // Validation
        if (!body.libelle?.trim()) {
            return NextResponse.json(
                { error: "Le libellé est requis" },
                { status: 400 }
            );
        }

        if (!body.missionId) {
            return NextResponse.json(
                { error: "Le dossier/mission est requis" },
                { status: 400 }
            );
        }

        if (!body.dateEcheance) {
            return NextResponse.json(
                { error: "La date d'échéance est requise" },
                { status: 400 }
            );
        }

        // Verify mission belongs to enterprise
        const mission = await prisma.mission.findFirst({
            where: {
                id: body.missionId,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!mission) {
            return NextResponse.json(
                { error: "Dossier introuvable" },
                { status: 404 }
            );
        }

        // Use clientId from body or from mission
        const clientId = body.clientId || mission.clientId;

        // Verify client belongs to enterprise
        const client = await prisma.client.findFirst({
            where: {
                id: clientId,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!client) {
            return NextResponse.json(
                { error: "Client introuvable" },
                { status: 404 }
            );
        }

        const echeance = await prisma.echeanceFiscale.create({
            data: {
                missionId: body.missionId,
                clientId,
                entrepriseId: session.user.entrepriseId,
                type: body.type,
                libelle: body.libelle.trim(),
                dateEcheance: new Date(body.dateEcheance),
                periodicite: body.periodicite || "PONCTUEL",
                exerciceFiscal: body.exerciceFiscal || null,
                periodeDebut: body.periodeDebut
                    ? new Date(body.periodeDebut)
                    : null,
                periodeFin: body.periodeFin ? new Date(body.periodeFin) : null,
                montant: body.montant || null,
                notes: body.notes || null,
                statut: "A_VENIR",
            },
            include: {
                client: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                    },
                },
                mission: {
                    select: {
                        id: true,
                        numero: true,
                        nom: true,
                    },
                },
            },
        });

        // Convert montant to number
        const formattedEcheance = {
            ...echeance,
            montant: echeance.montant ? Number(echeance.montant) : null,
        };

        return NextResponse.json(
            { echeance: formattedEcheance },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating echeance:", error);
        return NextResponse.json(
            { error: "Failed to create echeance" },
            { status: 500 }
        );
    }
}
