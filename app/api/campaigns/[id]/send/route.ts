import { prisma } from "@/lib/prisma";
import {
  handleTenantError,
  requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";
import { applySegmentCriteria } from "@/lib/types/segment";
import { emailService } from "@/lib/email/email-service";
import { render } from "@react-email/render";
import { CampaignEmail } from "@/lib/email/templates/campaign";
import { generateUnsubscribeLink, getClientVariables } from "@/lib/email/email-utils";

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
    let recipients: unknown[] = [];
    if (campaign.segmentId && campaign.segment) {
      const allClients = await prisma.client.findMany({
        where: { entrepriseId },
      });

      recipients = applySegmentCriteria(
        allClients,
        campaign.segment.criteres as unknown
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

    // Get entreprise info for email branding
    const entreprise = await prisma.entreprise.findUnique({
      where: { id: entrepriseId },
      select: { nom: true, email: true },
    });

    // Send emails to all recipients
    let successCount = 0;
    let failureCount = 0;

    for (const recipient of recipients) {
      try {
        // Generate unsubscribe link
        const unsubscribeUrl = generateUnsubscribeLink(recipient.id, entrepriseId);

        // Render email HTML from React template
        const emailHtml = await render(
          CampaignEmail({
            subject: campaign.subject!,
            body: campaign.body!,
            clientName: recipient.nom || '',
            clientFirstName: recipient.prenom || '',
            clientEmail: recipient.email,
            entrepriseName: entreprise?.nom || 'MyProPartner',
            unsubscribeUrl,
          })
        );

        // Send email
        const result = await emailService.sendEmail({
          to: recipient.email,
          subject: campaign.subject!,
          html: emailHtml,
          fromName: entreprise?.nom || 'MyProPartner',
          replyTo: entreprise?.email || undefined,
        });

        if (result.success) {
          successCount++;
        } else {
          failureCount++;
          console.error(`Failed to send email to ${recipient.email}:`, result.error);
        }

        // Add small delay to avoid rate limiting (100ms between emails)
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        failureCount++;
        console.error(`Error sending email to ${recipient.email}:`, error);
      }
    }

    // Update campaign status to sent
    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        statut: "SENT",
        sentCount: successCount,
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
      recipientsSent: successCount,
      recipientsFailed: failureCount,
      totalRecipients: recipients.length,
      message: `Campagne envoyée à ${successCount} destinataire(s)${failureCount > 0 ? ` (${failureCount} échec(s))` : ''}`,
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
