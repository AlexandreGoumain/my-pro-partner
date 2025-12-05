import { NextRequest, NextResponse } from "next/server";
import { requireClientAuth, handleClientAuthError } from "@/lib/middleware/client-auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/client/rdv/employes
 * Get available employees/practitioners for booking
 */
export async function GET(req: NextRequest) {
    try {
        const { entrepriseId } = await requireClientAuth(req);

        const employes = await prisma.employe.findMany({
            where: {
                entrepriseId,
                actif: true,
            },
            select: {
                id: true,
                nom: true,
                prenom: true,
                couleur: true,
                bio: true,
                specialites: true,
                certifications: true,
            },
            orderBy: [
                { nom: "asc" },
                { prenom: "asc" },
            ],
        });

        return NextResponse.json({ employes });
    } catch (error) {
        return handleClientAuthError(error);
    }
}
