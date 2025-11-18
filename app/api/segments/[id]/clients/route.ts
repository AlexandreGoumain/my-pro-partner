import {
    handleTenantError,
    verifyResourceAccess,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { applySegmentCriteria } from "@/lib/types/segment";
import {
    createPaginatedResponse,
    getPaginationParams,
} from "@/lib/utils/pagination";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// GET /api/segments/[id]/clients - Get clients in segment
// ============================================

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const { resource: segment, context } = await verifyResourceAccess(
            id,
            (id) => prisma.segment.findUnique({ where: { id } }),
            "Segment"
        );

        // Get all clients for this entreprise
        const allClients = await prisma.client.findMany({
            where: { entrepriseId: context.entrepriseId },
            orderBy: { createdAt: "desc" },
        });

        // Apply segment criteria
        const filteredClients = applySegmentCriteria(
            allClients,
            segment.criteres as Record<string, unknown>
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
    } catch (error) {
        return handleTenantError(error);
    }
}
