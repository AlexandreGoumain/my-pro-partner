import { prisma } from "@/lib/prisma";
import {
  handleTenantError,
  requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/email/email-service";
import { render } from "@react-email/render";
import { CampaignEmail } from "@/lib/email/templates/campaign";
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
    const { entrepriseId } = await requireTenantAuth();
    const { id: clientId } = await params;
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

    // Get client
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return NextResponse.json(
        { message: "Client non trouvé" },
        { status: 404 }
      );
    }

    if (client.entrepriseId !== entrepriseId) {
      return NextResponse.json(
        { message: "Accès non autorisé" },
        { status: 403 }
      );
    }

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
      where: { id: entrepriseId },
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
    const result = await emailService.sendEmail({
      to: client.email,
      subject,
      html: emailHtml,
      fromName: entreprise?.nom || "MyProPartner",
      replyTo: entreprise?.email || undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          message: `Erreur lors de l'envoi de l'email : ${result.error}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Email envoyé avec succès à ${client.email}`,
      emailId: result.messageId,
    });
  } catch (error) {
    return handleTenantError(error);
  }
}
