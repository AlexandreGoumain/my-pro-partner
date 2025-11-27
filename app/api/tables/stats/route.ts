import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// GET /api/tables/stats - Get tables statistics
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("tables");
        if (capabilityCheck) return capabilityCheck;

        const entrepriseId = session.user.entrepriseId;

        // Get all tables
        const tables = await prisma.tableRestaurant.findMany({
            where: { entrepriseId },
            select: {
                id: true,
                statut: true,
                zone: true,
                capacite: true,
            },
        });

        // Calculate stats
        const total = tables.length;
        const libres = tables.filter((t) => t.statut === "LIBRE").length;
        const occupees = tables.filter((t) => t.statut === "OCCUPEE").length;
        const reservees = tables.filter((t) => t.statut === "RESERVEE").length;
        const capaciteTotal = tables.reduce((sum, t) => sum + t.capacite, 0);

        // Calculate stats by zone
        const zoneMap = new Map<
            string,
            {
                count: number;
                libres: number;
                occupees: number;
                reservees: number;
                capacite: number;
            }
        >();

        tables.forEach((table) => {
            const current = zoneMap.get(table.zone) || {
                count: 0,
                libres: 0,
                occupees: 0,
                reservees: 0,
                capacite: 0,
            };

            current.count++;
            current.capacite += table.capacite;

            if (table.statut === "LIBRE") current.libres++;
            else if (table.statut === "OCCUPEE") current.occupees++;
            else if (table.statut === "RESERVEE") current.reservees++;

            zoneMap.set(table.zone, current);
        });

        const byZone = Array.from(zoneMap.entries()).map(([zone, stats]) => ({
            zone,
            ...stats,
        }));

        // Get unique zones for filter options
        const zones = [...new Set(tables.map((t) => t.zone))].sort();

        return NextResponse.json({
            stats: {
                total,
                libres,
                occupees,
                reservees,
                capaciteTotal,
                tauxOccupation:
                    total > 0 ? Math.round((occupees / total) * 100) : 0,
                byZone,
            },
            zones,
        });
    } catch (error) {
        console.error("Error fetching table stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch table stats" },
            { status: 500 }
        );
    }
}
