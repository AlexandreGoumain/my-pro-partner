import { NextRequest, NextResponse } from "next/server";
import { requireClientAuth, handleClientAuthError } from "@/lib/middleware/client-auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/client/dashboard/stats
 * Get dashboard statistics for the authenticated client
 */
export async function GET(req: NextRequest) {
    try {
        const { client } = await requireClientAuth(req);

        // Count documents
        const documentsCount = await prisma.document.count({
            where: {
                clientId: client.id,
            },
        });

        // Get points expiring soon (next 30 days)
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

        return NextResponse.json({
            client: {
                nom: client.nom,
                prenom: client.prenom,
                points_solde: client.points_solde,
                niveauFidelite: client.niveauFidelite,
            },
            documentsCount,
            pointsExpiringSoon: pointsExpiringSoon._sum.points || 0,
        });
    } catch (error) {
        return handleClientAuthError(error);
    }
}
