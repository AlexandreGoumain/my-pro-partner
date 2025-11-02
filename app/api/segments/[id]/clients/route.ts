import { prisma } from "@/lib/prisma";
import {
  createPaginatedResponse,
  getPaginationParams,
} from "@/lib/utils/pagination";
import {
  handleTenantError,
  requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";
import { applySegmentCriteria } from "@/lib/types/segment";

// ============================================
// GET /api/segments/[id]/clients - Get clients in segment
// ============================================

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { entrepriseId } = await requireTenantAuth();
    const { id } = await params;

    // Get segment
    const segment = await prisma.segment.findUnique({
      where: { id },
    });

    if (!segment) {
      return NextResponse.json(
        { message: "Segment non trouvé" },
        { status: 404 }
      );
    }

    // Verify tenant access
    if (segment.entrepriseId !== entrepriseId) {
      return NextResponse.json(
        { message: "Accès non autorisé" },
        { status: 403 }
      );
    }

    // Get all clients for this entreprise
    const allClients = await prisma.client.findMany({
      where: { entrepriseId },
      orderBy: { createdAt: "desc" },
    });

    // Apply segment criteria
    const filteredClients = applySegmentCriteria(
      allClients,
      segment.criteres as any
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
