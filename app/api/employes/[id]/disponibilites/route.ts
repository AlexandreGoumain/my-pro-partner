import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
    params: Promise<{ id: string }>;
}

/**
 * GET /api/employes/[id]/disponibilites
 * Get employee's availability schedule
 */
export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("agenda");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await context.params;

        // Check employee exists and belongs to entreprise
        const employee = await prisma.employe.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!employee) {
            return NextResponse.json(
                { error: "Employé non trouvé" },
                { status: 404 }
            );
        }

        const disponibilites = await prisma.disponibiliteEmploye.findMany({
            where: { employeId: id },
            orderBy: [{ jourSemaine: "asc" }, { heureDebut: "asc" }],
        });

        return NextResponse.json(disponibilites);
    } catch (error) {
        console.error("Error fetching employee disponibilites:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/employes/[id]/disponibilites
 * Replace employee's availability schedule
 */
export async function PUT(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("agenda");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await context.params;
        const body = await request.json();
        const { disponibilites } = body;

        // Check employee exists and belongs to entreprise
        const employee = await prisma.employe.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!employee) {
            return NextResponse.json(
                { error: "Employé non trouvé" },
                { status: 404 }
            );
        }

        // Validate disponibilites
        if (!Array.isArray(disponibilites)) {
            return NextResponse.json(
                { error: "Les disponibilités doivent être un tableau" },
                { status: 400 }
            );
        }

        for (const d of disponibilites) {
            if (
                d.jourSemaine === undefined ||
                d.jourSemaine < 0 ||
                d.jourSemaine > 6
            ) {
                return NextResponse.json(
                    { error: "Jour de semaine invalide (0-6)" },
                    { status: 400 }
                );
            }

            if (!d.heureDebut || !d.heureFin) {
                return NextResponse.json(
                    { error: "Heures de début et fin requises" },
                    { status: 400 }
                );
            }

            // Validate time format
            const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(d.heureDebut) || !timeRegex.test(d.heureFin)) {
                return NextResponse.json(
                    { error: "Format d'heure invalide (HH:MM)" },
                    { status: 400 }
                );
            }
        }

        // Delete existing and create new in a transaction
        await prisma.$transaction([
            prisma.disponibiliteEmploye.deleteMany({
                where: { employeId: id },
            }),
            prisma.disponibiliteEmploye.createMany({
                data: disponibilites.map(
                    (d: {
                        jourSemaine: number;
                        heureDebut: string;
                        heureFin: string;
                        pause?: boolean;
                    }) => ({
                        employeId: id,
                        jourSemaine: d.jourSemaine,
                        heureDebut: d.heureDebut,
                        heureFin: d.heureFin,
                        pause: d.pause || false,
                    })
                ),
            }),
        ]);

        // Fetch updated disponibilites
        const updated = await prisma.disponibiliteEmploye.findMany({
            where: { employeId: id },
            orderBy: [{ jourSemaine: "asc" }, { heureDebut: "asc" }],
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating employee disponibilites:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
