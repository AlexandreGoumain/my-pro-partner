import { withApiHandler } from "@/lib/api/api-handler";
import { NotFoundError, ValidationError, BusinessError } from "@/lib/errors";
import { emailService } from "@/lib/email/email-service";
import { CampaignEmail } from "@/lib/email/templates/campaign";
import { prisma } from "@/lib/prisma";
import { render } from "@react-email/render";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema
const sendEmailSchema = z.object({
    subject: z.string().min(1, "Le sujet est requis"),
    body: z.string().min(1, "Le corps de l'email est requis"),
});

type RouteParams = { params: Promise<{ id: string }> };

// ============================================
// POST /api/clients/[id]/send-email - Send email to specific client
// ============================================

export async function POST(
    req: NextRequest,
    { params }: RouteParams
) {
    return withApiHandler(
        async (ctx) => {
            const { id: clientId } = await params;
            const body = await req.json();

            const result = sendEmailSchema.safeParse(body);
            if (!result.success) {
                throw new ValidationError(result.error.errors[0].message);
            }

            const { subject, body: emailBody } = result.data;

            // Get client with tenant isolation
            const client = await prisma.client.findFirst({
                where: {
                    id: clientId,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!client) {
                throw new NotFoundError("Client non trouvé");
            }

            // Validate client has email
            if (!client.email) {
                throw new BusinessError(
                    "Le client n'a pas d'adresse email. Veuillez ajouter une adresse email au client."
                );
            }

            // Get entreprise info for email branding
            const entreprise = await prisma.entreprise.findUnique({
                where: { id: ctx.entrepriseId },
                select: { nom: true, email: true },
            });

            // Render email HTML from React template
            const emailHtml = await render(
                CampaignEmail({
                    subject,
                    body: emailBody,
                    clientName: client.nom || "",
                    clientFirstName: client.prenom || "",
                    clientEmail: client.email,
                    entrepriseName: entreprise?.nom || "MyProPartner",
                })
            );

            // Send email
            const sendResult = await emailService.sendEmail({
                to: client.email,
                subject,
                html: emailHtml,
                fromName: entreprise?.nom || "MyProPartner",
                replyTo: entreprise?.email || undefined,
            });

            if (!sendResult.success) {
                throw new BusinessError(`Erreur lors de l'envoi de l'email : ${sendResult.error}`);
            }

            return NextResponse.json({
                success: true,
                message: `Email envoyé avec succès à ${client.email}`,
                emailId: sendResult.messageId,
            });
        },
        {
            context: { resourceName: "Client", operation: "sendEmail" },
        }
    );
}
