import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/syndic/conseil-syndical - List membres du conseil
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("conseil_syndical");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const coproprieteId = searchParams.get("coproprieteId");
        const actif = searchParams.get("actif");
        const role = searchParams.get("role");

        const where: any = {
            entrepriseId: session.user.entrepriseId,
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
    } catch (error) {
        console.error("Error fetching conseil syndical:", error);
        return NextResponse.json(
            { error: "Failed to fetch conseil syndical" },
            { status: 500 }
        );
    }
}

// POST /api/syndic/conseil-syndical - Add membre
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("conseil_syndical");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();

        if (!body.coproprieteId || !body.membreId || !body.role || !body.dateDebut) {
            return NextResponse.json(
                { error: "Copropriété, membre, rôle et date de début requis" },
                { status: 400 }
            );
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
            return NextResponse.json(
                { error: "Ce membre fait déjà partie du conseil syndical" },
                { status: 400 }
            );
        }

        const membre = await prisma.membreConseilSyndical.create({
            data: {
                entrepriseId: session.user.entrepriseId,
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
    } catch (error) {
        console.error("Error adding membre conseil:", error);
        return NextResponse.json(
            { error: "Failed to add membre" },
            { status: 500 }
        );
    }
}
