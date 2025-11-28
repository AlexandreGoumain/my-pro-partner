import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/temps/reports - Get detailed time reports
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
        const periodDays = parseInt(searchParams.get("period") || "30");
        const groupBy = searchParams.get("groupBy") || "day"; // day, week, month

        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - periodDays);
        startDate.setHours(0, 0, 0, 0);

        // Fetch all entries in period
        const entries = await prisma.entreeTemps.findMany({
            where: {
                entrepriseId: session.user.entrepriseId,
                date: { gte: startDate, lte: endDate },
            },
            include: {
                mission: {
                    include: {
                        client: {
                            select: { id: true, nom: true, prenom: true },
                        },
                    },
                },
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { date: "asc" },
        });

        // Group entries by time period
        const timeSeriesData: Record<
            string,
            { date: string; tracked: number; billable: number; amount: number }
        > = {};

        entries.forEach((entry) => {
            const date = new Date(entry.date);
            let key: string;

            if (groupBy === "week") {
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay() + 1);
                key = weekStart.toISOString().split("T")[0];
            } else if (groupBy === "month") {
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
            } else {
                key = date.toISOString().split("T")[0];
            }

            if (!timeSeriesData[key]) {
                timeSeriesData[key] = {
                    date: key,
                    tracked: 0,
                    billable: 0,
                    amount: 0,
                };
            }

            timeSeriesData[key].tracked += entry.duree;
            if (entry.facturable) {
                timeSeriesData[key].billable += entry.duree;
                timeSeriesData[key].amount += Number(entry.montant);
            }
        });

        // Group by mission
        const byMission: Record<
            string,
            {
                id: string;
                nom: string;
                numero: string;
                tracked: number;
                billable: number;
                amount: number;
            }
        > = {};

        entries.forEach((entry) => {
            if (!entry.mission) return;

            const missionId = entry.mission.id;
            if (!byMission[missionId]) {
                byMission[missionId] = {
                    id: missionId,
                    nom: entry.mission.nom,
                    numero: entry.mission.numero,
                    tracked: 0,
                    billable: 0,
                    amount: 0,
                };
            }

            byMission[missionId].tracked += entry.duree;
            if (entry.facturable) {
                byMission[missionId].billable += entry.duree;
                byMission[missionId].amount += Number(entry.montant);
            }
        });

        // Group by client
        const byClient: Record<
            string,
            {
                id: string;
                nom: string;
                tracked: number;
                billable: number;
                amount: number;
                missions: number;
            }
        > = {};

        entries.forEach((entry) => {
            if (!entry.mission?.client) return;

            const clientId = entry.mission.client.id;
            if (!byClient[clientId]) {
                byClient[clientId] = {
                    id: clientId,
                    nom:
                        entry.mission.client.nom +
                        (entry.mission.client.prenom
                            ? ` ${entry.mission.client.prenom}`
                            : ""),
                    tracked: 0,
                    billable: 0,
                    amount: 0,
                    missions: 0,
                };
            }

            byClient[clientId].tracked += entry.duree;
            if (entry.facturable) {
                byClient[clientId].billable += entry.duree;
                byClient[clientId].amount += Number(entry.montant);
            }
        });

        // Count missions per client
        const missionsByClient = new Map<string, Set<string>>();
        entries.forEach((entry) => {
            if (!entry.mission?.client) return;
            const clientId = entry.mission.client.id;
            if (!missionsByClient.has(clientId)) {
                missionsByClient.set(clientId, new Set());
            }
            missionsByClient.get(clientId)!.add(entry.mission.id);
        });
        missionsByClient.forEach((missions, clientId) => {
            if (byClient[clientId]) {
                byClient[clientId].missions = missions.size;
            }
        });

        // Group by collaborator
        const byCollaborator: Record<
            string,
            {
                id: string;
                name: string;
                tracked: number;
                billable: number;
                amount: number;
            }
        > = {};

        entries.forEach((entry) => {
            if (!entry.user) return;

            const userId = entry.user.id;
            if (!byCollaborator[userId]) {
                byCollaborator[userId] = {
                    id: userId,
                    name: entry.user.name || entry.user.email || "Inconnu",
                    tracked: 0,
                    billable: 0,
                    amount: 0,
                };
            }

            byCollaborator[userId].tracked += entry.duree;
            if (entry.facturable) {
                byCollaborator[userId].billable += entry.duree;
                byCollaborator[userId].amount += Number(entry.montant);
            }
        });

        // Calculate totals
        const totals = {
            tracked: entries.reduce((sum, e) => sum + e.duree, 0),
            billable: entries
                .filter((e) => e.facturable)
                .reduce((sum, e) => sum + e.duree, 0),
            amount: entries
                .filter((e) => e.facturable)
                .reduce((sum, e) => sum + Number(e.montant), 0),
            entries: entries.length,
        };

        // Calculate averages
        const workDays = Math.floor((periodDays * 5) / 7);
        const avgDailyTracked = workDays > 0 ? totals.tracked / workDays : 0;
        const avgDailyBillable = workDays > 0 ? totals.billable / workDays : 0;

        return NextResponse.json({
            period: {
                start: startDate.toISOString(),
                end: endDate.toISOString(),
                days: periodDays,
            },
            totals,
            averages: {
                dailyTracked: Math.round(avgDailyTracked),
                dailyBillable: Math.round(avgDailyBillable),
            },
            timeSeries: Object.values(timeSeriesData).sort(
                (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
            ),
            byMission: Object.values(byMission).sort(
                (a, b) => b.tracked - a.tracked
            ),
            byClient: Object.values(byClient).sort(
                (a, b) => b.tracked - a.tracked
            ),
            byCollaborator: Object.values(byCollaborator).sort(
                (a, b) => b.tracked - a.tracked
            ),
        });
    } catch (error) {
        console.error("Error fetching time reports:", error);
        return NextResponse.json(
            { error: "Failed to fetch time reports" },
            { status: 500 }
        );
    }
}
