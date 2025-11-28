import { authOptions } from "@/lib/auth";
import { Prisma } from "@/lib/generated/prisma";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import type { MissionCreateInput } from "@/lib/types/mission";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/missions - List missions with filters
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
        const clientId = searchParams.get("clientId");
        const typeFact = searchParams.get("typeFact");
        const search = searchParams.get("search");
        const limit = parseInt(searchParams.get("limit") || "50");

        const where: Prisma.MissionWhereInput = {
            entrepriseId: session.user.entrepriseId,
        };

        if (statut && statut !== "ALL") {
            // Support multiple statuses (comma-separated)
            const statuts = statut.split(",");
            if (statuts.length === 1) {
                where.statut = statut as any;
            } else {
                where.statut = { in: statuts as any };
            }
        }

        if (clientId) {
            where.clientId = clientId;
        }

        if (typeFact && typeFact !== "ALL") {
            where.typeFact = typeFact as any;
        }

        if (search) {
            where.OR = [
                { numero: { contains: search, mode: "insensitive" } },
                { nom: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { client: { nom: { contains: search, mode: "insensitive" } } },
            ];
        }

        const missions = await prisma.mission.findMany({
            where,
            include: {
                client: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        email: true,
                        telephone: true,
                    },
                },
                _count: {
                    select: {
                        entreesTemps: true,
                    },
                },
            },
            orderBy: [{ statut: "asc" }, { updatedAt: "desc" }],
            take: limit,
        });

        // Convert Decimal fields to numbers
        const formattedMissions = missions.map((m) => ({
            ...m,
            montantForfait: m.montantForfait ? Number(m.montantForfait) : null,
            tauxHoraire: m.tauxHoraire ? Number(m.tauxHoraire) : null,
            totalMontant: Number(m.totalMontant),
        }));

        return NextResponse.json({ missions: formattedMissions });
    } catch (error) {
        console.error("Error fetching missions:", error);
        return NextResponse.json(
            { error: "Failed to fetch missions" },
            { status: 500 }
        );
    }
}

// POST /api/missions - Create new mission
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

        const body: MissionCreateInput = await request.json();

        // Validation
        if (!body.nom?.trim()) {
            return NextResponse.json(
                { error: "Le nom de la mission est requis" },
                { status: 400 }
            );
        }

        if (!body.clientId) {
            return NextResponse.json(
                { error: "Le client est requis" },
                { status: 400 }
            );
        }

        // Verify client belongs to enterprise
        const client = await prisma.client.findFirst({
            where: {
                id: body.clientId,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!client) {
            return NextResponse.json(
                { error: "Client introuvable" },
                { status: 404 }
            );
        }

        // Generate mission number
        const year = new Date().getFullYear();
        const lastMission = await prisma.mission.findFirst({
            where: {
                entrepriseId: session.user.entrepriseId,
                numero: { startsWith: `MISS-${year}-` },
            },
            orderBy: { createdAt: "desc" },
            select: { numero: true },
        });

        let nextNumber = 1;
        if (lastMission) {
            const match = lastMission.numero.match(/MISS-\d{4}-(\d+)/);
            if (match) {
                nextNumber = parseInt(match[1]) + 1;
            }
        }
        const numero = `MISS-${year}-${nextNumber.toString().padStart(3, "0")}`;

        // Get default taux horaire from parametres if not provided
        let tauxHoraire = body.tauxHoraire;
        if (!tauxHoraire && body.typeFact !== "FORFAIT") {
            const parametres = await prisma.parametresEntreprise.findUnique({
                where: { entrepriseId: session.user.entrepriseId },
            });
            // Default to 80€/h if no setting
            tauxHoraire = 80;
        }

        const mission = await prisma.mission.create({
            data: {
                numero,
                nom: body.nom.trim(),
                description: body.description?.trim() || null,
                clientId: body.clientId,
                entrepriseId: session.user.entrepriseId,
                typeFact: body.typeFact || "REGIE",
                montantForfait: body.montantForfait || null,
                tauxHoraire: tauxHoraire || null,
                budgetHeures: body.budgetHeures || null,
                dateDebut: body.dateDebut ? new Date(body.dateDebut) : null,
                dateFin: body.dateFin ? new Date(body.dateFin) : null,
                dateEcheance: body.dateEcheance
                    ? new Date(body.dateEcheance)
                    : null,
                devisId: body.devisId || null,
                statut: "PROPOSITION",
                createdById: session.user.id,
            },
            include: {
                client: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        email: true,
                        telephone: true,
                    },
                },
            },
        });

        // Convert Decimal fields
        const formattedMission = {
            ...mission,
            montantForfait: mission.montantForfait
                ? Number(mission.montantForfait)
                : null,
            tauxHoraire: mission.tauxHoraire
                ? Number(mission.tauxHoraire)
                : null,
            totalMontant: Number(mission.totalMontant),
        };

        return NextResponse.json(
            { mission: formattedMission },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating mission:", error);
        return NextResponse.json(
            { error: "Failed to create mission" },
            { status: 500 }
        );
    }
}
