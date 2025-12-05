import { withApiHandler } from "@/lib/api/api-handler";
import { NotFoundError, ValidationError, BusinessError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { applySegmentCriteria, SegmentCriteria } from "@/lib/types/segment";
import { emailService } from "@/lib/email/email-service";
import { render } from "@react-email/render";
import { CampaignEmail } from "@/lib/email/templates/campaign";
import { generateUnsubscribeLink } from "@/lib/email/email-utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema
const sendEmailSchema = z.object({
    subject: z.string().min(1, "Le sujet est requis"),
    body: z.string().min(1, "Le corps de l'email est requis"),
});

type RouteParams = { params: Promise<{ id: string }> };

// ============================================
// POST /api/segments/[id]/send-email - Send bulk email to segment
// ============================================

export async function POST(
    req: NextRequest,
    { params }: RouteParams
) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;
            const body = await req.json();

            const result = sendEmailSchema.safeParse(body);
            if (!result.success) {
                throw new ValidationError(result.error.errors[0].message);
            }

            const { subject, body: emailBody } = result.data;

            // Get segment
            const segment = await prisma.segment.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!segment) {
                throw new NotFoundError("Segment non trouvé");
            }

            // Get all clients
            const allClients = await prisma.client.findMany({
                where: { entrepriseId: ctx.entrepriseId },
            });

            // Apply segment criteria
            const recipients = applySegmentCriteria(
                allClients,
                segment.criteres as unknown as SegmentCriteria
            ).filter((c) => c.email); // Only clients with email

            if (recipients.length === 0) {
                throw new BusinessError("Aucun destinataire trouvé dans ce segment");
            }

            // Get entreprise info for email branding
            const entreprise = await prisma.entreprise.findUnique({
                where: { id: ctx.entrepriseId },
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
                        ctx.entrepriseId
                    );

                    // Render email HTML from React template
                    const emailHtml = await render(
                        CampaignEmail({
                            subject,
                            body: emailBody,
                            clientName: recipient.nom || "",
                            clientFirstName: recipient.prenom || "",
                            clientEmail: recipient.email || "",
                            entrepriseName: entreprise?.nom || "MyProPartner",
                            unsubscribeUrl,
                        })
                    );

                    // Send email
                    const sendResult = await emailService.sendEmail({
                        to: recipient.email || "",
                        subject,
                        html: emailHtml,
                        fromName: entreprise?.nom || "MyProPartner",
                        replyTo: entreprise?.email || undefined,
                    });

                    if (sendResult.success) {
                        successCount++;
                    } else {
                        failureCount++;
                        errors.push(
                            `${recipient.email}: ${sendResult.error || "Erreur inconnue"}`
                        );
                        console.error(
                            `Failed to send email to ${recipient.email}:`,
                            sendResult.error
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
        },
        {
            context: { resourceName: "Segment", operation: "sendEmail" },
        }
    );
}
