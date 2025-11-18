import { emailService } from "@/lib/email/email-service";
import { CampaignEmail } from "@/lib/email/templates/campaign";
import {
    handleTenantError,
    verifyResourceAccess,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/utils/validation-helper";
import { render } from "@react-email/render";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema
const sendEmailSchema = z.object({
    subject: z.string().min(1, "Le sujet est requis"),
    body: z.string().min(1, "Le corps de l'email est requis"),
});

// ============================================
// POST /api/clients/[id]/send-email - Send email to specific client
// ============================================

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: clientId } = await params;
        const body = await req.json();

        const validationResult = validateRequest(sendEmailSchema, body);
        if (!validationResult.success) return validationResult.response;

        const { subject, body: emailBody } = validationResult.data;

        const { resource: client, context } = await verifyResourceAccess(
            clientId,
            (id) => prisma.client.findUnique({ where: { id } }),
            "Client"
        );

        // Validate client has email
        if (!client.email) {
            return NextResponse.json(
                {
                    message:
                        "Le client n'a pas d'adresse email. Veuillez ajouter une adresse email au client.",
                },
                { status: 400 }
            );
        }

        // Get entreprise info for email branding
        const entreprise = await prisma.entreprise.findUnique({
            where: { id: context.entrepriseId },
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
            return NextResponse.json(
                {
                    message: `Erreur lors de l'envoi de l'email : ${sendResult.error}`,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Email envoyé avec succès à ${client.email}`,
            emailId: sendResult.messageId,
        });
    } catch (error) {
        return handleTenantError(error);
    }
}
