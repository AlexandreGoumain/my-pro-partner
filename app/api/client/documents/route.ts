import { NextRequest, NextResponse } from "next/server";
import { requireClientAuth, handleClientAuthError } from "@/lib/middleware/client-auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/client/documents
 * Get all documents for the authenticated client
 */
export async function GET(req: NextRequest) {
    try {
        const { client } = await requireClientAuth(req);

        const documents = await prisma.document.findMany({
            where: {
                clientId: client.id,
            },
            orderBy: {
                dateEmission: "desc",
            },
            include: {
                paiements: true,
            },
        });

        return NextResponse.json({
            documents,
        });
    } catch (error) {
        return handleClientAuthError(error);
    }
}
