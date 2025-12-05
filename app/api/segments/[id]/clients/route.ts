import { withApiHandler } from "@/lib/api/api-handler";
import { NotFoundError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { applySegmentCriteria, SegmentCriteria } from "@/lib/types/segment";
import {
    createPaginatedResponse,
    getPaginationParams,
} from "@/lib/utils/pagination";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

// ============================================
// GET /api/segments/[id]/clients - Get clients in segment
// ============================================

export async function GET(
    req: NextRequest,
    { params }: RouteParams
) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const segment = await prisma.segment.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!segment) {
                throw new NotFoundError("Segment non trouvé");
            }

            // Get all clients for this entreprise
            const allClients = await prisma.client.findMany({
                where: { entrepriseId: ctx.entrepriseId },
                orderBy: { createdAt: "desc" },
            });

            // Apply segment criteria
            const filteredClients = applySegmentCriteria(
                allClients,
                segment.criteres as unknown as SegmentCriteria
            );

            // Handle pagination
            const { searchParams } = new URL(req.url);
            const pagination = getPaginationParams(searchParams);

            const total = filteredClients.length;
            const paginatedClients = filteredClients.slice(
                pagination.skip,
                pagination.skip + pagination.limit
            );

            return NextResponse.json(
                createPaginatedResponse(paginatedClients, total, pagination)
            );
        },
        {
            context: { resourceName: "Segment", operation: "getClients" },
        }
    );
}
