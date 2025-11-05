import { prisma } from "@/lib/prisma";
import {
  handleTenantError,
  requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/email/email-service";
import { render } from "@react-email/render";
import { InvoiceEmail } from "@/lib/email/templates/invoice";

// ============================================
// POST /api/documents/[id]/send - Send document by email
// ============================================

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { entrepriseId } = await requireTenantAuth();
    const { id } = await params;

    // Get document with full details
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
          },
        },
        entreprise: {
          select: {
            nom: true,
            email: true,
          },
        },
        lignes: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { message: "Document non trouvé" },
        { status: 404 }
      );
    }

    if (document.entrepriseId !== entrepriseId) {
      return NextResponse.json(
        { message: "Accès non autorisé" },
        { status: 403 }
      );
    }

    // Validate client has email
    if (!document.client.email) {
      return NextResponse.json(
        {
          message:
            "Le client n'a pas d'adresse email. Veuillez ajouter une adresse email au client.",
        },
        { status: 400 }
      );
    }

    // Prepare email content
    const docTypeLabel =
      document.type === "FACTURE"
        ? "Facture"
        : document.type === "DEVIS"
        ? "Devis"
        : "Avoir";

    // Format dates
    const dateEmission = new Intl.DateTimeFormat("fr-FR").format(
      new Date(document.dateEmission)
    );
    const dateEcheance = document.dateEcheance
      ? new Intl.DateTimeFormat("fr-FR").format(new Date(document.dateEcheance))
      : undefined;

    // Generate document view URL (if you have a public view page)
    const viewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/documents/${document.id}/view`;

    // Render email HTML from React template
    const emailHtml = await render(
      InvoiceEmail({
        documentType: document.type,
        documentNumber: document.numero,
        clientName: document.client.nom || "",
        clientFirstName: document.client.prenom || "",
        totalTTC: Number(document.total_ttc),
        dateEmission,
        dateEcheance,
        entrepriseName: document.entreprise.nom || "MyProPartner",
        entrepriseEmail: document.entreprise.email || undefined,
        paymentInstructions: document.conditions_paiement || undefined,
        viewUrl,
      })
    );

    // Send email
    const result = await emailService.sendEmail({
      to: document.client.email,
      subject: `${docTypeLabel} n°${document.numero} - ${document.entreprise.nom || "MyProPartner"}`,
      html: emailHtml,
      // TODO: Add PDF attachment when PDF generation is implemented
      // attachments: [{
      //   filename: `${docTypeLabel}-${document.numero}.pdf`,
      //   content: pdfBuffer,
      // }],
      fromName: document.entreprise.nom || 'MyProPartner',
      replyTo: document.entreprise.email || undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          message: `Erreur lors de l'envoi de l'email : ${result.error}`,
        },
        { status: 500 }
      );
    }

    // Update document status to ENVOYE if it was BROUILLON
    if (document.statut === "BROUILLON") {
      await prisma.document.update({
        where: { id },
        data: { statut: "ENVOYE" },
      });
    }

    return NextResponse.json({
      success: true,
      message: `${docTypeLabel} envoyé(e) avec succès à ${document.client.email}`,
      emailId: result.messageId,
    });
  } catch (error) {
    return handleTenantError(error);
  }
}
