import { prisma } from "@/lib/prisma";
import {
  handleTenantError,
  requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// POST /api/campaigns/[id]/cancel - Cancel a scheduled campaign
// ============================================

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { entrepriseId } = await requireTenantAuth();
    const { id } = await params;

    const campaign = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      return NextResponse.json(
        { message: "Campagne non trouvée" },
        { status: 404 }
      );
    }

    if (campaign.entrepriseId !== entrepriseId) {
      return NextResponse.json(
        { message: "Accès non autorisé" },
        { status: 403 }
      );
    }

    // Can only cancel scheduled campaigns
    if (campaign.statut !== "SCHEDULED") {
      return NextResponse.json(
        { message: "Seules les campagnes planifiées peuvent être annulées" },
        { status: 400 }
      );
    }

    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        statut: "CANCELLED",
        scheduledAt: null,
      },
      include: {
        segment: {
          select: {
            id: true,
            nom: true,
            nombreClients: true,
          },
        },
      },
    });

    return NextResponse.json({
      campaign: updatedCampaign,
      message: "Campagne annulée avec succès",
    });
  } catch (error) {
    return handleTenantError(error);
  }
}
