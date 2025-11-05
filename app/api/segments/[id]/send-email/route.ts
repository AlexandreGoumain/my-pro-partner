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
import { generateUnsubscribeLink } from "@/lib/email/email-utils";
import { z } from "zod";

// Validation schema
const sendEmailSchema = z.object({
  subject: z.string().min(1, "Le sujet est requis"),
  body: z.string().min(1, "Le corps de l'email est requis"),
});

// ============================================
// POST /api/segments/[id]/send-email - Send bulk email to segment
// ============================================

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { entrepriseId } = await requireTenantAuth();
    const { id } = await params;
    const body = await req.json();

    // Validate request body
    const validation = sendEmailSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Données invalides",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { subject, body: emailBody } = validation.data;

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
    const recipients = applySegmentCriteria(
      allClients,
      segment.criteres as unknown
    ).filter((c) => c.email); // Only clients with email

    if (recipients.length === 0) {
      return NextResponse.json(
        { message: "Aucun destinataire trouvé dans ce segment" },
        { status: 400 }
      );
    }

    // Get entreprise info for email branding
    const entreprise = await prisma.entreprise.findUnique({
      where: { id: entrepriseId },
      select: { nom: true, email: true },
    });

    // Send emails to all recipients
    let successCount = 0;
    let failureCount = 0;
    const errors: string[] = [];

    for (const recipient of recipients) {
      try {
        // Generate unsubscribe link
        const unsubscribeUrl = generateUnsubscribeLink(
          recipient.id,
          entrepriseId
        );

        // Render email HTML from React template
        const emailHtml = await render(
          CampaignEmail({
            subject,
            body: emailBody,
            clientName: recipient.nom || "",
            clientFirstName: recipient.prenom || "",
            clientEmail: recipient.email,
            entrepriseName: entreprise?.nom || "MyProPartner",
            unsubscribeUrl,
          })
        );

        // Send email
        const result = await emailService.sendEmail({
          to: recipient.email,
          subject,
          html: emailHtml,
          fromName: entreprise?.nom || 'MyProPartner',
          replyTo: entreprise?.email || undefined,
        });

        if (result.success) {
          successCount++;
        } else {
          failureCount++;
          errors.push(
            `${recipient.email}: ${result.error || "Erreur inconnue"}`
          );
          console.error(
            `Failed to send email to ${recipient.email}:`,
            result.error
          );
        }

        // Add small delay to avoid rate limiting (100ms between emails)
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        failureCount++;
        const errorMsg =
          error instanceof Error ? error.message : "Erreur inconnue";
        errors.push(`${recipient.email}: ${errorMsg}`);
        console.error(`Error sending email to ${recipient.email}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      recipientsSent: successCount,
      recipientsFailed: failureCount,
      totalRecipients: recipients.length,
      message: `Email envoyé à ${successCount} destinataire(s)${failureCount > 0 ? ` (${failureCount} échec(s))` : ""}`,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    return handleTenantError(error);
  }
}
