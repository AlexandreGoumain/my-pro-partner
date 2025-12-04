import { NextRequest, NextResponse } from "next/server";
import { requireClientAuth, handleClientAuthError } from "@/lib/middleware/client-auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/client/rdv/prestations
 * Get available services/prestations for booking
 */
export async function GET(req: NextRequest) {
    try {
        const { entrepriseId } = await requireClientAuth(req);

        const { searchParams } = new URL(req.url);
        const categorie = searchParams.get("categorie");

        // Build where clause
        const where: Record<string, unknown> = {
            entrepriseId,
            actif: true,
        };

        if (categorie) {
            where.categorie = categorie;
        }

        const prestations = await prisma.prestation.findMany({
            where,
            select: {
                id: true,
                nom: true,
                description: true,
                duree: true,
                prix: true,
                categorie: true,
            },
            orderBy: [
                { ordre: "asc" },
                { nom: "asc" },
            ],
        });

        // Group by category for easier display
        const categories = [...new Set(prestations.map((p) => p.categorie).filter(Boolean))];

        return NextResponse.json({
            prestations,
            categories,
        });
    } catch (error) {
        return handleClientAuthError(error);
    }
}
