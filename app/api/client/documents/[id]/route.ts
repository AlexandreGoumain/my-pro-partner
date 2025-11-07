import { NextRequest, NextResponse } from "next/server";
import { requireClientAuth, ensureClientOwnership } from "@/lib/middleware/client-auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/client/documents/[id]
 * Get detailed information about a specific document
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { client } = await requireClientAuth(req);
        const { id: documentId } = await params;

        const document = await prisma.document.findUnique({
            where: { id: documentId },
            include: {
                lignes: {
                    orderBy: { ordre: "asc" },
                },
                paiements: {
                    orderBy: { date_paiement: "desc" },
                },
                devis: true, // If this document is a facture from a devis
            },
        });

        if (!document) {
            return NextResponse.json(
                { message: "Document non trouvé" },
                { status: 404 }
            );
        }

        // Ensure client owns this document
        ensureClientOwnership(client.id, document.clientId);

        return NextResponse.json({ document });
    } catch (error) {
        console.error("[Client Document Detail API] Error:", error);

        if (
            error instanceof Error &&
            error.message.includes("Access denied")
        ) {
            return NextResponse.json(
                { message: "Accès refusé" },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { message: "Erreur lors de la récupération du document" },
            { status: 500 }
        );
    }
}
