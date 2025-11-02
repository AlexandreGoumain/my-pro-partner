import { prisma } from "@/lib/prisma";
import {
  handleTenantError,
  requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";
import { applySegmentCriteria } from "@/lib/types/segment";

// ============================================
// POST /api/segments/compare - Compare multiple segments
// ============================================

export async function POST(req: NextRequest) {
  try {
    const { entrepriseId } = await requireTenantAuth();
    const body = await req.json();
    const { segmentIds } = body;

    if (!Array.isArray(segmentIds) || segmentIds.length < 2) {
      return NextResponse.json(
        { message: "Au moins 2 segments sont requis pour la comparaison" },
        { status: 400 }
      );
    }

    if (segmentIds.length > 5) {
      return NextResponse.json(
        { message: "Maximum 5 segments peuvent être comparés" },
        { status: 400 }
      );
    }

    // Fetch all segments
    const segments = await prisma.segment.findMany({
      where: {
        id: { in: segmentIds },
        entrepriseId,
      },
    });

    if (segments.length !== segmentIds.length) {
      return NextResponse.json(
        { message: "Un ou plusieurs segments n'ont pas été trouvés" },
        { status: 404 }
      );
    }

    // Get all clients
    const allClients = await prisma.client.findMany({
      where: { entrepriseId },
    });

    // Apply criteria for each segment
    const segmentResults = segments.map((segment) => {
      const clients = applySegmentCriteria(allClients, segment.criteres as any);
      return {
        id: segment.id,
        nom: segment.nom,
        clients,
        clientIds: clients.map((c) => c.id),
        count: clients.length,
      };
    });

    // Calculate overlaps
    const overlaps: Record<string, number> = {};

    // For 2 segments, calculate simple overlap
    if (segmentResults.length === 2) {
      const [seg1, seg2] = segmentResults;
      const overlap = seg1.clientIds.filter((id) => seg2.clientIds.includes(id));
      const uniqueToFirst = seg1.clientIds.filter((id) => !seg2.clientIds.includes(id));
      const uniqueToSecond = seg2.clientIds.filter((id) => !seg1.clientIds.includes(id));

      return NextResponse.json({
        segments: segmentResults.map((s) => ({
          id: s.id,
          nom: s.nom,
          count: s.count,
        })),
        overlap: overlap.length,
        overlapPercentage: seg1.count > 0 ? (overlap.length / seg1.count) * 100 : 0,
        uniqueToFirst: uniqueToFirst.length,
        uniqueToSecond: uniqueToSecond.length,
        overlapClientIds: overlap,
        uniqueToFirstIds: uniqueToFirst,
        uniqueToSecondIds: uniqueToSecond,
      });
    }

    // For multiple segments, calculate all pairwise overlaps
    const pairwiseOverlaps: Array<{
      segment1: string;
      segment2: string;
      overlap: number;
      overlapPercentage: number;
    }> = [];
    for (let i = 0; i < segmentResults.length; i++) {
      for (let j = i + 1; j < segmentResults.length; j++) {
        const seg1 = segmentResults[i];
        const seg2 = segmentResults[j];
        const overlap = seg1.clientIds.filter((id) => seg2.clientIds.includes(id));

        pairwiseOverlaps.push({
          segment1: seg1.nom,
          segment2: seg2.nom,
          overlap: overlap.length,
          overlapPercentage: seg1.count > 0 ? (overlap.length / seg1.count) * 100 : 0,
        });
      }
    }

    // Calculate clients in all segments
    const allSegmentIds = segmentResults[0].clientIds;
    const inAllSegments = allSegmentIds.filter((id) =>
      segmentResults.every((seg) => seg.clientIds.includes(id))
    );

    return NextResponse.json({
      segments: segmentResults.map((s) => ({
        id: s.id,
        nom: s.nom,
        count: s.count,
      })),
      pairwiseOverlaps,
      inAllSegments: inAllSegments.length,
      totalUniqueClients: new Set(
        segmentResults.flatMap((s) => s.clientIds)
      ).size,
    });
  } catch (error) {
    return handleTenantError(error);
  }
}
