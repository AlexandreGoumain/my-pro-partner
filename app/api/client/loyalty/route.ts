import { NextRequest, NextResponse } from "next/server";
import { requireClientAuth, handleClientAuthError } from "@/lib/middleware/client-auth";
import { LoyaltyService } from "@/lib/services/loyalty.service";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/client/loyalty
 * Get loyalty information for the authenticated client
 */
export async function GET(req: NextRequest) {
    try {
        const { client } = await requireClientAuth(req);

        // Get next level info
        const nextLevel = await LoyaltyService.getNextLevel(
            client.id,
            client.entrepriseId
        );

        // Get points expiring soon
        const now = new Date();
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

        // Get recent points movements
        const mouvements = await prisma.mouvementPoints.findMany({
            where: {
                clientId: client.id,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 10,
        });

        return NextResponse.json({
            client: {
                points_solde: client.points_solde,
                niveauFidelite: client.niveauFidelite,
            },
            pointsExpiringSoon: pointsExpiringSoon._sum.points || 0,
            nextLevel,
            mouvements,
        });
    } catch (error) {
        return handleClientAuthError(error);
    }
}
