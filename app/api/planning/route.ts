import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("domicile");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const dateParam = searchParams.get("date");
        const startDateParam = searchParams.get("startDate");
        const endDateParam = searchParams.get("endDate");
        const plombierId = searchParams.get("plombierId");

        if (!dateParam && (!startDateParam || !endDateParam)) {
            return NextResponse.json(
                { error: "Date parameter or date range is required" },
                { status: 400 }
            );
        }

        // Parse dates - support single day or date range
        let startOfDay: Date;
        let endOfDay: Date;

        if (startDateParam && endDateParam) {
            startOfDay = new Date(startDateParam);
            startOfDay.setHours(0, 0, 0, 0);
            endOfDay = new Date(endDateParam);
            endOfDay.setHours(23, 59, 59, 999);
        } else {
            const date = new Date(dateParam!);
            startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
        }

        // Get all plumbers in the company
        const allPlombiers = await prisma.user.findMany({
            where: {
                entrepriseId: session.user.entrepriseId,
                role: {
                    in: ["EMPLOYEE", "MANAGER", "ADMIN"],
                },
                status: "ACTIVE",
            },
            select: {
                id: true,
                name: true,
            },
        });

        // Build plombiers stats with interventions
        const plombiersPromises = allPlombiers.map(async (plombier) => {
            const where: any = {
                entrepriseId: session.user.entrepriseId,
                plombierId: plombier.id,
                datePrevisionnelle: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                statut: {
                    notIn: ["TERMINEE", "FACTUREE", "ANNULEE"],
                },
            };

            const interventions = await prisma.intervention.findMany({
                where,
                include: {
                    client: {
                        select: {
                            nom: true,
                            prenom: true,
                        },
                    },
                    plombier: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: {
                    datePrevisionnelle: "asc",
                },
            });

            return {
                id: plombier.id,
                name: plombier.name || "Sans nom",
                interventionsCount: interventions.length,
                interventions,
            };
        });

        let plombiers = await Promise.all(plombiersPromises);

        // Filter by specific plombier if requested
        if (plombierId && plombierId !== "ALL") {
            plombiers = plombiers.filter((p) => p.id === plombierId);
        }

        // Only return plombiers with interventions or if filtering by specific plombier
        if (!plombierId || plombierId === "ALL") {
            plombiers = plombiers.filter((p) => p.interventionsCount > 0);
        }

        return NextResponse.json({ plombiers });
    } catch (error) {
        console.error("Error fetching planning:", error);
        return NextResponse.json(
            { error: "Failed to fetch planning" },
            { status: 500 }
        );
    }
}
