import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import type { ConsultingStats } from "@/lib/types/mission";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/temps/stats - Get consulting time statistics
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
        const periodDays = parseInt(searchParams.get("period") || "30");

        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - periodDays);

        // Available hours (assuming 8h/day, 5 days/week)
        const workDaysInPeriod = Math.floor((periodDays * 5) / 7);
        const heuresDisponibles = workDaysInPeriod * 8 * 60; // in minutes

        // Total hours tracked in period
        const trackedResult = await prisma.entreeTemps.aggregate({
            where: {
                entrepriseId: session.user.entrepriseId,
                date: { gte: startDate, lte: endDate },
            },
            _sum: {
                duree: true,
                montant: true,
            },
        });
        const heuresTracked = trackedResult._sum.duree || 0;

        // Billable hours in period
        const facturableResult = await prisma.entreeTemps.aggregate({
            where: {
                entrepriseId: session.user.entrepriseId,
                date: { gte: startDate, lte: endDate },
                facturable: true,
            },
            _sum: {
                duree: true,
                montant: true,
            },
        });
        const heuresFacturables = facturableResult._sum.duree || 0;

        // Utilization rate
        const tauxUtilisation =
            heuresDisponibles > 0
                ? Math.round((heuresFacturables / heuresDisponibles) * 100)
                : 0;

        // Revenue from invoiced documents in period
        const caFactureResult = await prisma.document.aggregate({
            where: {
                entrepriseId: session.user.entrepriseId,
                type: "FACTURE",
                statut: { in: ["PAYE", "ENVOYE"] },
                dateEmission: { gte: startDate, lte: endDate },
            },
            _sum: {
                total_ttc: true,
            },
        });
        const caFacture = Number(caFactureResult._sum.total_ttc || 0);

        // Potential revenue from uninvoiced time
        const caPotentiel = Number(facturableResult._sum.montant || 0);

        // Revenue per hour
        const revenuParHeure =
            heuresTracked > 0
                ? Math.round((caFacture / (heuresTracked / 60)) * 100) / 100
                : 0;

        // Missions en cours
        const missionsEnCours = await prisma.mission.count({
            where: {
                entrepriseId: session.user.entrepriseId,
                statut: "EN_COURS",
            },
        });

        // Missions à facturer
        const missionsAFacturer = await prisma.mission.count({
            where: {
                entrepriseId: session.user.entrepriseId,
                statut: "LIVREE",
            },
        });

        // Pipeline value (propositions)
        const pipelineResult = await prisma.mission.aggregate({
            where: {
                entrepriseId: session.user.entrepriseId,
                statut: "PROPOSITION",
            },
            _sum: {
                montantForfait: true,
            },
        });
        const pipelineValeur = Number(pipelineResult._sum.montantForfait || 0);

        // Uninvoiced hours and amount
        const uninvoicedResult = await prisma.entreeTemps.aggregate({
            where: {
                entrepriseId: session.user.entrepriseId,
                facturee: false,
                facturable: true,
            },
            _sum: {
                duree: true,
                montant: true,
            },
        });
        const heuresNonFacturees = uninvoicedResult._sum.duree || 0;
        const montantNonFacture = Number(uninvoicedResult._sum.montant || 0);

        const stats: ConsultingStats = {
            heuresDisponibles,
            heuresTracked,
            heuresFacturables,
            tauxUtilisation,
            caFacture,
            caPotentiel,
            revenuParHeure,
            missionsEnCours,
            missionsAFacturer,
            pipelineValeur,
            heuresNonFacturees,
            montantNonFacture,
        };

        return NextResponse.json({ stats });
    } catch (error) {
        console.error("Error fetching time stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch time stats" },
            { status: 500 }
        );
    }
}
