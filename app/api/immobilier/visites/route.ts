import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/immobilier/visites - List visits with filters
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("visites_immo");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const statut = searchParams.get("statut");
        const bienId = searchParams.get("bienId");
        const agentId = searchParams.get("agentId");
        const dateFrom = searchParams.get("dateFrom");
        const dateTo = searchParams.get("dateTo");
        const today = searchParams.get("today");

        const where: any = {
            entrepriseId: session.user.entrepriseId,
        };

        if (statut && statut !== "ALL") {
            where.statut = statut;
        }

        if (bienId) {
            where.bienId = bienId;
        }

        if (agentId) {
            where.agentId = agentId;
        }

        // Filter for today's visits
        if (today === "true") {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            where.dateVisite = {
                gte: startOfDay,
                lte: endOfDay,
            };
        } else {
            if (dateFrom) {
                where.dateVisite = { ...where.dateVisite, gte: new Date(dateFrom) };
            }
            if (dateTo) {
                where.dateVisite = { ...where.dateVisite, lte: new Date(dateTo) };
            }
        }

        const visites = await prisma.visiteImmobilier.findMany({
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
                        photos: true,
                    },
                },
                visiteur: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        telephone: true,
                        email: true,
                    },
                },
                agent: {
                    select: {
                        id: true,
                        prenom: true,
                        nom: true,
                    },
                },
                mandat: {
                    select: {
                        id: true,
                        numero: true,
                    },
                },
            },
            orderBy: { dateVisite: "asc" },
            take: 100,
        });

        return NextResponse.json({ visites });
    } catch (error) {
        console.error("Error fetching visites:", error);
        return NextResponse.json(
            { error: "Failed to fetch visites" },
            { status: 500 }
        );
    }
}

// POST /api/immobilier/visites - Create new visit
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("visites_immo");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();

        if (!body.bienId || !body.visiteurId || !body.dateVisite) {
            return NextResponse.json(
                { error: "Bien, visiteur et date requis" },
                { status: 400 }
            );
        }

        const visite = await prisma.visiteImmobilier.create({
            data: {
                entrepriseId: session.user.entrepriseId,
                bienId: body.bienId,
                visiteurId: body.visiteurId,
                mandatId: body.mandatId,
                agentId: body.agentId,
                dateVisite: new Date(body.dateVisite),
                duree: body.duree || 30,
                statut: "PLANIFIEE",
            },
            include: {
                bien: {
                    select: {
                        id: true,
                        reference: true,
                        titre: true,
                    },
                },
                visiteur: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        telephone: true,
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

        return NextResponse.json({ visite }, { status: 201 });
    } catch (error) {
        console.error("Error creating visite:", error);
        return NextResponse.json(
            { error: "Failed to create visite" },
            { status: 500 }
        );
    }
}
