import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import type { MissionStats } from "@/lib/types/mission";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/missions/stats - Get mission statistics
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

        // Total missions
        const total = await prisma.mission.count({
            where: { entrepriseId: session.user.entrepriseId },
        });

        // Missions en cours
        const enCours = await prisma.mission.count({
            where: {
                entrepriseId: session.user.entrepriseId,
                statut: "EN_COURS",
            },
        });

        // Missions à facturer (LIVREE)
        const aFacturer = await prisma.mission.count({
            where: {
                entrepriseId: session.user.entrepriseId,
                statut: "LIVREE",
            },
        });

        // Total montant (sum of all missions)
        const montantResult = await prisma.mission.aggregate({
            where: {
                entrepriseId: session.user.entrepriseId,
                statut: { notIn: ["ANNULEE"] },
            },
            _sum: {
                totalMontant: true,
            },
        });

        // Heures non facturées
        const heuresResult = await prisma.entreeTemps.aggregate({
            where: {
                entrepriseId: session.user.entrepriseId,
                facturee: false,
                facturable: true,
            },
            _sum: {
                duree: true,
            },
        });

        const stats: MissionStats = {
            total,
            enCours,
            aFacturer,
            totalMontant: Number(montantResult._sum.totalMontant || 0),
            heuresNonFacturees: heuresResult._sum.duree || 0,
        };

        return NextResponse.json({ stats });
    } catch (error) {
        console.error("Error fetching mission stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch mission stats" },
            { status: 500 }
        );
    }
}
