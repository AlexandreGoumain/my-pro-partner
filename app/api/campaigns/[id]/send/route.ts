import { prisma } from "@/lib/prisma";
import {
  handleTenantError,
  requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";
import { applySegmentCriteria } from "@/lib/types/segment";

// ============================================
// POST /api/campaigns/[id]/send - Send campaign immediately
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
      include: {
        segment: true,
      },
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

    // Can only send draft or scheduled campaigns
    if (campaign.statut !== "DRAFT" && campaign.statut !== "SCHEDULED") {
      return NextResponse.json(
        { message: "Cette campagne ne peut pas être envoyée" },
        { status: 400 }
      );
    }

    // Validate campaign has required fields
    if (!campaign.subject || !campaign.body) {
      return NextResponse.json(
        { message: "La campagne doit avoir un sujet et un corps" },
        { status: 400 }
      );
    }

    // Get recipients
    let recipients: any[] = [];
    if (campaign.segmentId && campaign.segment) {
      const allClients = await prisma.client.findMany({
        where: { entrepriseId },
      });

      recipients = applySegmentCriteria(
        allClients,
        campaign.segment.criteres as any
      );
    } else {
      recipients = await prisma.client.findMany({
        where: { entrepriseId },
      });
    }

    // Filter recipients based on campaign type
    if (campaign.type === "EMAIL") {
      recipients = recipients.filter((c) => c.email);
    } else if (campaign.type === "SMS") {
      recipients = recipients.filter((c) => c.telephone);
    }

    // Update campaign status to sending
    await prisma.campaign.update({
      where: { id },
      data: {
        statut: "SENDING",
        sentAt: new Date(),
      },
    });

    // TODO: Implement actual sending logic here
    // For now, we'll just simulate it
    // In production, you would:
    // 1. Queue the messages in a job queue (Bull, BullMQ, etc.)
    // 2. Use email service (SendGrid, AWS SES, etc.)
    // 3. Use SMS service (Twilio, etc.)

    // Simulate sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update campaign status to sent
    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        statut: "SENT",
        sentCount: recipients.length,
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
      recipientsSent: recipients.length,
      message: `Campagne envoyée à ${recipients.length} destinataire(s)`,
    });
  } catch (error) {
    // If error occurs, mark campaign as failed
    const { id } = await params;
    await prisma.campaign.update({
      where: { id },
      data: {
        statut: "CANCELLED",
      },
    });

    return handleTenantError(error);
  }
}
