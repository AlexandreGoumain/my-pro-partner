import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/admin/clients/pending
 * Get all clients pending admin approval
 */
export async function GET(_req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const pendingClients = await prisma.client.findMany({
                where: {
                    entrepriseId: ctx.entrepriseId,
                    pendingApproval: true,
                    clientPortalEnabled: false,
                },
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    nom: true,
                    prenom: true,
                    email: true,
                    telephone: true,
                    adresse: true,
                    codePostal: true,
                    ville: true,
                    createdAt: true,
                },
            });

            return NextResponse.json({
                clients: pendingClients,
                count: pendingClients.length,
            });
        },
        {
            context: { resourceName: "Client", operation: "listPending" },
        }
    );
}
