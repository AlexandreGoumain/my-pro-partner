import { prisma } from "@/lib/prisma";
import {
  handleTenantError,
  requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";
import { applySegmentCriteria } from "@/lib/types/segment";

// ============================================
// GET /api/segments/[id]/analytics - Get segment analytics
// ============================================

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { entrepriseId } = await requireTenantAuth();
    const { id } = await params;

    const segment = await prisma.segment.findUnique({
      where: { id },
    });

    if (!segment) {
      return NextResponse.json(
        { message: "Segment non trouvé" },
        { status: 404 }
      );
    }

    if (segment.entrepriseId !== entrepriseId) {
      return NextResponse.json(
        { message: "Accès non autorisé" },
        { status: 403 }
      );
    }

    // Get all clients
    const allClients = await prisma.client.findMany({
      where: { entrepriseId },
    });

    // Apply segment criteria
    const segmentClients = applySegmentCriteria(
      allClients,
      segment.criteres as unknown
    );

    // Calculate demographics
    const withEmail = segmentClients.filter((c) => c.email).length;
    const withPhone = segmentClients.filter((c) => c.telephone).length;
    const withAddress = segmentClients.filter((c) => c.adresse).length;
    const withLoyaltyPoints = segmentClients.filter((c) => c.points_solde > 0).length;

    // City distribution
    const cityDistribution = segmentClients.reduce((acc, client) => {
      const city = client.ville || "Non renseigné";
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCities = Object.entries(cityDistribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([city, count]) => ({ city, count }));

    // Loyalty points distribution
    const loyaltyBuckets = {
      "0": 0,
      "1-50": 0,
      "51-100": 0,
      "101-500": 0,
      "500+": 0,
    };

    segmentClients.forEach((client) => {
      const points = client.points_solde;
      if (points === 0) loyaltyBuckets["0"]++;
      else if (points <= 50) loyaltyBuckets["1-50"]++;
      else if (points <= 100) loyaltyBuckets["51-100"]++;
      else if (points <= 500) loyaltyBuckets["101-500"]++;
      else loyaltyBuckets["500+"]++;
    });

    // Calculate growth (last 30 days vs previous 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const last30Days = segmentClients.filter(
      (c) => new Date(c.createdAt) >= thirtyDaysAgo
    ).length;

    const previous30Days = segmentClients.filter(
      (c) =>
        new Date(c.createdAt) >= sixtyDaysAgo &&
        new Date(c.createdAt) < thirtyDaysAgo
    ).length;

    const growth =
      previous30Days > 0
        ? ((last30Days - previous30Days) / previous30Days) * 100
        : 0;

    // Timeline data (last 12 months)
    const monthlyData: Array<{ month: string; count: number }> = [];
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const count = segmentClients.filter((c) => {
        const createdAt = new Date(c.createdAt);
        return createdAt >= monthDate && createdAt < nextMonthDate;
      }).length;

      monthlyData.push({
        month: monthDate.toLocaleDateString("fr-FR", {
          month: "short",
          year: "numeric",
        }),
        count,
      });
    }

    // Cumulative growth over time
    const cumulativeData: Array<{ month: string; total: number }> = [];
    const cumulative = 0;
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const count = segmentClients.filter((c) => {
        const createdAt = new Date(c.createdAt);
        return createdAt < nextMonthDate;
      }).length;

      cumulativeData.push({
        month: monthDate.toLocaleDateString("fr-FR", {
          month: "short",
          year: "numeric",
        }),
        total: count,
      });
    }

    return NextResponse.json({
      segment: {
        id: segment.id,
        nom: segment.nom,
        description: segment.description,
        type: segment.type,
      },
      summary: {
        totalClients: segmentClients.length,
        percentageOfBase:
          allClients.length > 0
            ? (segmentClients.length / allClients.length) * 100
            : 0,
        growth,
        newLast30Days: last30Days,
      },
      demographics: {
        withEmail,
        withPhone,
        withAddress,
        withLoyaltyPoints,
        completionRate:
          segmentClients.length > 0
            ? (segmentClients.filter((c) => c.email && c.telephone && c.adresse)
                .length /
                segmentClients.length) *
              100
            : 0,
      },
      distribution: {
        topCities,
        loyaltyBuckets: Object.entries(loyaltyBuckets).map(([range, count]) => ({
          range,
          count,
        })),
      },
      timeline: {
        monthly: monthlyData,
        cumulative: cumulativeData,
      },
    });
  } catch (error) {
    return handleTenantError(error);
  }
}
