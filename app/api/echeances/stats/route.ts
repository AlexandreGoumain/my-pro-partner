import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/echeances/stats - Get statistics for dashboard
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

        const entrepriseId = session.user.entrepriseId;
        const now = new Date();

        // Count by status
        const [total, aVenir, enCours, enRetard, deposees] = await Promise.all([
            prisma.echeanceFiscale.count({
                where: { entrepriseId },
            }),
            prisma.echeanceFiscale.count({
                where: {
                    entrepriseId,
                    statut: "A_VENIR",
                    dateEcheance: { gte: now },
                },
            }),
            prisma.echeanceFiscale.count({
                where: {
                    entrepriseId,
                    statut: "EN_COURS",
                },
            }),
            prisma.echeanceFiscale.count({
                where: {
                    entrepriseId,
                    statut: { notIn: ["VALIDE", "DEPOSE"] },
                    dateEcheance: { lt: now },
                },
            }),
            prisma.echeanceFiscale.count({
                where: {
                    entrepriseId,
                    statut: { in: ["DEPOSE", "VALIDE"] },
                },
            }),
        ]);

        // Get prochaine échéance
        const prochaine = await prisma.echeanceFiscale.findFirst({
            where: {
                entrepriseId,
                statut: { notIn: ["VALIDE", "DEPOSE"] },
                dateEcheance: { gte: now },
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
            orderBy: { dateEcheance: "asc" },
        });

        // Échéances de la semaine à venir
        const weekEnd = new Date(now);
        weekEnd.setDate(weekEnd.getDate() + 7);

        const echeancesSemaine = await prisma.echeanceFiscale.findMany({
            where: {
                entrepriseId,
                statut: { notIn: ["VALIDE", "DEPOSE"] },
                dateEcheance: { gte: now, lte: weekEnd },
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
            orderBy: { dateEcheance: "asc" },
            take: 10,
        });

        // Échéances en retard
        const echeancesRetard = await prisma.echeanceFiscale.findMany({
            where: {
                entrepriseId,
                statut: { notIn: ["VALIDE", "DEPOSE"] },
                dateEcheance: { lt: now },
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
            orderBy: { dateEcheance: "asc" },
            take: 10,
        });

        // Format écheances (convert montant)
        const formatEcheances = (echeances: any[]) =>
            echeances.map((e) => ({
                ...e,
                montant: e.montant ? Number(e.montant) : null,
            }));

        return NextResponse.json({
            stats: {
                total,
                aVenir,
                enCours,
                enRetard,
                deposees,
                prochaine: prochaine
                    ? {
                          ...prochaine,
                          montant: prochaine.montant
                              ? Number(prochaine.montant)
                              : null,
                      }
                    : null,
            },
            echeancesSemaine: formatEcheances(echeancesSemaine),
            echeancesRetard: formatEcheances(echeancesRetard),
        });
    } catch (error) {
        console.error("Error fetching echeances stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch echeances stats" },
            { status: 500 }
        );
    }
}
