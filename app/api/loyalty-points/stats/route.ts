import { prisma } from "@/lib/prisma";
import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const { searchParams } = new URL(req.url);
        const clientId = searchParams.get("clientId");

        if (clientId) {
            // Stats for a specific client
            const client = await prisma.client.findFirst({
                where: {
                    id: clientId,
                    entrepriseId,
                },
                include: {
                    niveauFidelite: true,
                },
            });

            if (!client) {
                return NextResponse.json(
                    { message: "Client non trouvé" },
                    { status: 404 }
                );
            }

            // Get points history stats
            const mouvements = await prisma.mouvementPoints.groupBy({
                by: ["type"],
                where: {
                    clientId,
                    entrepriseId,
                },
                _sum: {
                    points: true,
                },
                _count: {
                    id: true,
                },
            });

            // Get points expiring soon (next 30 days)
            const now = new Date();
            const in30Days = new Date();
            in30Days.setDate(in30Days.getDate() + 30);

            const pointsExpiringSoon = await prisma.mouvementPoints.aggregate({
                where: {
                    clientId,
                    entrepriseId,
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

            return NextResponse.json({
                client: {
                    id: client.id,
                    nom: client.nom,
                    prenom: client.prenom,
                    points_solde: client.points_solde,
                    niveauFidelite: client.niveauFidelite,
                },
                mouvements,
                pointsExpiringSoon: pointsExpiringSoon._sum.points || 0,
            });
        } else {
            // Global stats for the company
            const [
                totalPoints,
                totalClients,
                clientsWithPoints,
                mouvementsStats,
                niveauxDistribution,
            ] = await Promise.all([
                // Total points distributed
                prisma.client.aggregate({
                    where: { entrepriseId },
                    _sum: {
                        points_solde: true,
                    },
                }),
                // Total clients
                prisma.client.count({
                    where: { entrepriseId },
                }),
                // Clients with points
                prisma.client.count({
                    where: {
                        entrepriseId,
                        points_solde: {
                            gt: 0,
                        },
                    },
                }),
                // Points movements stats
                prisma.mouvementPoints.groupBy({
                    by: ["type"],
                    where: {
                        entrepriseId,
                    },
                    _sum: {
                        points: true,
                    },
                    _count: {
                        id: true,
                    },
                }),
                // Distribution by loyalty level
                prisma.client.groupBy({
                    by: ["niveauFideliteId"],
                    where: {
                        entrepriseId,
                        niveauFideliteId: {
                            not: null,
                        },
                    },
                    _count: {
                        id: true,
                    },
                }),
            ]);

            // Get niveau names for distribution
            const niveauxIds = niveauxDistribution
                .map((n) => n.niveauFideliteId)
                .filter((id): id is string => id !== null);

            const niveaux = await prisma.niveauFidelite.findMany({
                where: {
                    id: { in: niveauxIds },
                    entrepriseId,
                },
                select: {
                    id: true,
                    nom: true,
                    couleur: true,
                    icone: true,
                },
            });

            const niveauxMap = new Map(niveaux.map((n) => [n.id, n]));

            const distributionWithNames = niveauxDistribution.map((dist) => ({
                niveau: dist.niveauFideliteId
                    ? niveauxMap.get(dist.niveauFideliteId)
                    : null,
                count: dist._count.id,
            }));

            return NextResponse.json({
                totalPoints: totalPoints._sum.points_solde || 0,
                totalClients,
                clientsWithPoints,
                participationRate:
                    totalClients > 0
                        ? ((clientsWithPoints / totalClients) * 100).toFixed(1)
                        : 0,
                mouvementsStats,
                niveauxDistribution: distributionWithNames,
            });
        }
    } catch (error) {
        return handleTenantError(error);
    }
}
