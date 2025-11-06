import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/documents/[id]/payments
 * Fetch all payments for a specific document
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const payments = await prisma.paiement.findMany({
            where: {
                documentId: id,
            },
            orderBy: {
                date_paiement: "desc",
            },
        });

        return NextResponse.json({ payments });
    } catch (error) {
        console.error("[Payments API] Error fetching payments:", error);
        return NextResponse.json(
            { message: "Erreur lors de la récupération des paiements" },
            { status: 500 }
        );
    }
}
