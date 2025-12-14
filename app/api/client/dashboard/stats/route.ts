import {
    handleClientAuthError,
    requireClientAuth,
} from "@/lib/middleware/client-auth";
import { prisma } from "@/lib/prisma";
import { CapabilityService } from "@/lib/services/capability.service";
import type { ActivityItem } from "@/lib/types/dashboard";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/client/dashboard/stats
 * Get enhanced dashboard statistics for the authenticated client (capability-aware)
 * Includes micro-visualization data for 2025 dashboard design
 */
export async function GET(req: NextRequest) {
    try {
        const { client, entrepriseId } = await requireClientAuth(req);

        // Get business capabilities
        const businessType = client.entreprise.businessType;
        const capabilities =
            CapabilityService.getCapabilitiesForType(businessType);

        const now = new Date();

        // ============================================================
        // Base stats
        // ============================================================

        const documentsCount = await prisma.document.count({
            where: {
                clientId: client.id,
            },
        });

        // Recent documents (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentDocumentsCount = await prisma.document.count({
            where: {
                clientId: client.id,
                createdAt: { gte: thirtyDaysAgo },
            },
        });

        // ============================================================
        // Points expiring soon (next 30 days)
        // ============================================================

        const in30Days = new Date();
        in30Days.setDate(in30Days.getDate() + 30);

        const pointsExpiringSoon = await prisma.mouvementPoints.aggregate({
            where: {
                clientId: client.id,
                type: "GAIN",
                dateExpiration: {
                    gte: now,
                    lte: in30Days,
                },
            },
            _sum: {
                points: true,
            },
        });

        // Get days until next expiration
        const nextExpiration = await prisma.mouvementPoints.findFirst({
            where: {
                clientId: client.id,
                type: "GAIN",
                dateExpiration: { gte: now },
                points: { gt: 0 },
            },
            orderBy: { dateExpiration: "asc" },
            select: { dateExpiration: true },
        });

        let daysUntilNextExpiry: number | undefined;
        if (nextExpiration?.dateExpiration) {
            const diffTime =
                nextExpiration.dateExpiration.getTime() - now.getTime();
            daysUntilNextExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        // ============================================================
        // Points history for sparkline (last 6 months cumulative)
        // ============================================================

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const pointsMovements = await prisma.mouvementPoints.findMany({
            where: {
                clientId: client.id,
                createdAt: { gte: sixMonthsAgo },
            },
            select: {
                points: true,
                type: true,
                createdAt: true,
            },
            orderBy: { createdAt: "asc" },
        });

        // Group by month and calculate cumulative
        const monthlyPoints: number[] = [];
        const months = 6;
        const runningTotal = client.points_solde;

        // Calculate backwards from current balance
        const pointsByMonth = new Map<string, number>();
        for (const mv of pointsMovements) {
            const monthKey = `${mv.createdAt.getFullYear()}-${mv.createdAt.getMonth()}`;
            const delta = mv.type === "GAIN" ? mv.points : -mv.points;
            pointsByMonth.set(
                monthKey,
                (pointsByMonth.get(monthKey) || 0) + delta
            );
        }

        // Build history array
        for (let i = months - 1; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

            if (i === 0) {
                monthlyPoints.push(client.points_solde);
            } else {
                // Calculate what balance was at that point
                let balanceAtMonth = client.points_solde;
                for (let j = 0; j < i; j++) {
                    const d = new Date();
                    d.setMonth(d.getMonth() - j);
                    const key = `${d.getFullYear()}-${d.getMonth()}`;
                    balanceAtMonth -= pointsByMonth.get(key) || 0;
                }
                monthlyPoints.push(Math.max(0, balanceAtMonth));
            }
        }

        // ============================================================
        // Loyalty level progress
        // ============================================================

        let progressToNextLevel = 100;
        let nextLevel = null;

        if (client.niveauFidelite) {
            // Find next level
            const allLevels = await prisma.niveauFidelite.findMany({
                where: {
                    entrepriseId,
                    actif: true,
                },
                orderBy: { seuilPoints: "asc" },
                select: {
                    id: true,
                    nom: true,
                    couleur: true,
                    seuilPoints: true,
                },
            });

            const currentIndex = allLevels.findIndex(
                (l) => l.id === client.niveauFidelite?.id
            );
            if (currentIndex >= 0 && currentIndex < allLevels.length - 1) {
                nextLevel = allLevels[currentIndex + 1];
                const currentThreshold = client.niveauFidelite.seuilPoints;
                const nextThreshold = nextLevel.seuilPoints;
                const pointsInLevel = client.points_solde - currentThreshold;
                const pointsNeeded = nextThreshold - currentThreshold;
                progressToNextLevel =
                    pointsNeeded > 0
                        ? Math.min(
                              100,
                              Math.max(0, (pointsInLevel / pointsNeeded) * 100)
                          )
                        : 100;
            }
        }

        // ============================================================
        // Recent activities for timeline
        // ============================================================

        const recentActivities: ActivityItem[] = [];

        // Recent documents
        const recentDocs = await prisma.document.findMany({
            where: { clientId: client.id },
            orderBy: { createdAt: "desc" },
            take: 3,
            select: {
                id: true,
                numero: true,
                type: true,
                createdAt: true,
            },
        });

        for (const doc of recentDocs) {
            const typeLabel =
                doc.type === "DEVIS"
                    ? "Devis"
                    : doc.type === "FACTURE"
                      ? "Facture"
                      : "Avoir";
            recentActivities.push({
                id: `doc-${doc.id}`,
                type: "document",
                title: `${typeLabel} ${doc.numero}`,
                description: `Nouveau ${typeLabel.toLowerCase()} créé`,
                timestamp: doc.createdAt,
                href: `/client/documents/${doc.id}`,
            });
        }

        // Recent points movements
        const recentPoints = await prisma.mouvementPoints.findMany({
            where: { clientId: client.id },
            orderBy: { createdAt: "desc" },
            take: 2,
            select: {
                id: true,
                type: true,
                points: true,
                description: true,
                createdAt: true,
            },
        });

        for (const mv of recentPoints) {
            const sign = mv.type === "GAIN" ? "+" : "-";
            recentActivities.push({
                id: `points-${mv.id}`,
                type: "points",
                title: `${sign}${mv.points} points`,
                description:
                    mv.description ||
                    (mv.type === "GAIN" ? "Points gagnés" : "Points utilisés"),
                timestamp: mv.createdAt,
                href: "/client/fidelite",
            });
        }

        // Sort by timestamp
        recentActivities.sort(
            (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
        );

        // ============================================================
        // Capability-based stats
        // ============================================================

        let upcomingRdv: unknown[] = [];
        let activeInterventions: unknown[] = [];

        // Fetch upcoming RDV if business has agenda capability
        if (capabilities.includes("agenda")) {
            upcomingRdv = await prisma.rendezVous.findMany({
                where: {
                    clientId: client.id,
                    entrepriseId,
                    date: { gte: now },
                    statut: { notIn: ["ANNULE", "NO_SHOW", "TERMINE"] },
                },
                select: {
                    id: true,
                    date: true,
                    heure: true,
                    statut: true,
                    prestation: {
                        select: {
                            nom: true,
                            duree: true,
                        },
                    },
                    employe: {
                        select: {
                            prenom: true,
                            nom: true,
                        },
                    },
                },
                orderBy: [{ date: "asc" }, { heure: "asc" }],
                take: 3,
            });

            // Add upcoming RDV to activities
            for (const rdv of upcomingRdv as Array<{
                id: string;
                date: Date;
                heure: string;
                prestation?: { nom: string };
            }>) {
                recentActivities.push({
                    id: `rdv-${rdv.id}`,
                    type: "rdv",
                    title: rdv.prestation?.nom || "Rendez-vous",
                    description: `Prévu le ${new Date(rdv.date).toLocaleDateString("fr-FR")} à ${rdv.heure}`,
                    timestamp: new Date(rdv.date),
                    href: `/client/rdv/${rdv.id}`,
                });
            }
        }

        // Fetch active interventions if business has intervention capabilities
        if (
            capabilities.includes("domicile") ||
            capabilities.includes("atelier")
        ) {
            activeInterventions = await prisma.intervention.findMany({
                where: {
                    clientId: client.id,
                    entrepriseId,
                    statut: { notIn: ["TERMINEE", "FACTUREE", "ANNULEE"] },
                },
                select: {
                    id: true,
                    numero: true,
                    typeIntervention: true,
                    statut: true,
                    priorite: true,
                    datePrevisionnelle: true,
                    plombier: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: { dateDemande: "desc" },
                take: 3,
            });

            // Add interventions to activities
            for (const inter of activeInterventions as Array<{
                id: string;
                numero: string;
                typeIntervention: string;
                updatedAt?: Date;
            }>) {
                recentActivities.push({
                    id: `inter-${inter.id}`,
                    type: "intervention",
                    title: `Intervention ${inter.numero}`,
                    description: inter.typeIntervention,
                    timestamp: new Date(),
                    href: `/client/interventions/${inter.id}`,
                });
            }
        }

        // Final sort and limit activities
        recentActivities.sort(
            (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
        );
        const limitedActivities = recentActivities.slice(0, 5);

        return NextResponse.json({
            client: {
                nom: client.nom,
                prenom: client.prenom,
                points_solde: client.points_solde,
                niveauFidelite: client.niveauFidelite,
            },
            documentsCount,
            recentDocumentsCount,
            pointsExpiringSoon: pointsExpiringSoon._sum.points || 0,
            daysUntilNextExpiry,
            // Enhanced data for 2025 dashboard
            pointsHistory: monthlyPoints,
            progressToNextLevel,
            nextLevel,
            recentActivities: limitedActivities,
            lastUpdated: now,
            // Capability-based data
            capabilities,
            upcomingRdv,
            activeInterventions,
        });
    } catch (error) {
        return handleClientAuthError(error);
    }
}
