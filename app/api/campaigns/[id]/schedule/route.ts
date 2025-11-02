import { prisma } from "@/lib/prisma";
import {
  handleTenantError,
  requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const scheduleSchema = z.object({
  scheduledAt: z.string().datetime(),
});

// ============================================
// POST /api/campaigns/[id]/schedule - Schedule a campaign
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

    // Can only schedule draft campaigns
    if (campaign.statut !== "DRAFT") {
      return NextResponse.json(
        { message: "Seules les campagnes en brouillon peuvent être planifiées" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validation = scheduleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Données invalides",
          errors: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const scheduledAt = new Date(validation.data.scheduledAt);

    // Cannot schedule in the past
    if (scheduledAt <= new Date()) {
      return NextResponse.json(
        { message: "La date de planification doit être dans le futur" },
        { status: 400 }
      );
    }

    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        scheduledAt,
        statut: "SCHEDULED",
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

    return NextResponse.json(updatedCampaign);
  } catch (error) {
    return handleTenantError(error);
  }
}
