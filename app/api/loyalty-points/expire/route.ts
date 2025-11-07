import { prisma } from "@/lib/prisma";
import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/loyalty-points/expire
 * Expire tous les points qui ont dépassé leur date d'expiration
 * Crée un mouvement EXPIRATION pour chaque batch de points expirés
 */
export async function POST(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const now = new Date();

        // Find all GAIN movements with expired points
        const expiredMovements = await prisma.mouvementPoints.findMany({
            where: {
                entrepriseId,
                type: "GAIN",
                dateExpiration: {
                    lte: now,
                },
            },
            include: {
                client: true,
            },
        });

        if (expiredMovements.length === 0) {
            return NextResponse.json({
                message: "Aucun point expiré à traiter",
                expired: 0,
                totalPoints: 0,
            });
        }

        // Group by client to batch expiration movements
        const expirationsByClient = new Map<string, number>();

        for (const movement of expiredMovements) {
            const currentPoints = expirationsByClient.get(movement.clientId) || 0;
            expirationsByClient.set(movement.clientId, currentPoints + movement.points);
        }

        // Create expiration movements and update client balances
        const expirationOperations = [];
        let totalExpiredPoints = 0;

        for (const [clientId, pointsToExpire] of expirationsByClient) {
            const client = await prisma.client.findUnique({
                where: { id: clientId },
            });

            if (!client) continue;

            // Don't expire more points than the client has
            const actualPointsToExpire = Math.min(pointsToExpire, client.points_solde);

            if (actualPointsToExpire === 0) continue;

            totalExpiredPoints += actualPointsToExpire;

            // Create expiration movement
            expirationOperations.push(
                prisma.mouvementPoints.create({
                    data: {
                        type: "EXPIRATION",
                        points: actualPointsToExpire,
                        description: "Expiration automatique des points",
                        clientId,
                        entrepriseId,
                    },
                })
            );

            // Update client balance
            expirationOperations.push(
                prisma.client.update({
                    where: { id: clientId },
                    data: {
                        points_solde: {
                            decrement: actualPointsToExpire,
                        },
                    },
                })
            );
        }

        // Execute all operations in a transaction
        await prisma.$transaction(expirationOperations);

        return NextResponse.json({
            message: "Points expirés traités avec succès",
            expired: expirationsByClient.size,
            totalPoints: totalExpiredPoints,
        });
    } catch (error) {
        return handleTenantError(error);
    }
}
