import { prisma } from "@/lib/prisma";
import {
  handleTenantError,
  requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/email/email-service";
import { render } from "@react-email/render";
import { PaymentReminderEmail } from "@/lib/email/templates/payment-reminder";

// ============================================
// POST /api/clients/[id]/send-reminder - Send payment reminder to client
// ============================================

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { entrepriseId } = await requireTenantAuth();
    const { id: clientId } = await params;

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

    // Get all unpaid invoices for this client
    const unpaidInvoices = await prisma.document.findMany({
      where: {
        entrepriseId,
        clientId,
        type: "FACTURE",
        statut: {
          in: ["ENVOYE", "EN_RETARD"],
        },
        reste_a_payer: {
          gt: 0,
        },
      },
      orderBy: {
        dateEcheance: "asc",
      },
    });

    if (unpaidInvoices.length === 0) {
      return NextResponse.json(
        { message: "Ce client n'a pas de factures impayées" },
        { status: 400 }
      );
    }

    // Get entreprise info
    const entreprise = await prisma.entreprise.findUnique({
      where: { id: entrepriseId },
      select: {
        nom: true,
        email: true,
        telephone: true,
      },
    });

    // Calculate total due and format invoices for email
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const formattedInvoices = unpaidInvoices.map((invoice) => {
      const dateEcheance = new Date(invoice.dateEcheance || invoice.dateEmission);
      const timeDiff = today.getTime() - dateEcheance.getTime();
      const joursRetard = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));

      return {
        numero: invoice.numero,
        dateEmission: new Intl.DateTimeFormat("fr-FR").format(
          new Date(invoice.dateEmission)
        ),
        dateEcheance: new Intl.DateTimeFormat("fr-FR").format(dateEcheance),
        montant: Number(invoice.reste_a_payer),
        joursRetard,
      };
    });

    const totalDue = unpaidInvoices.reduce(
      (sum, inv) => sum + Number(inv.reste_a_payer),
      0
    );

    // Get default payment instructions from any invoice (they should be similar)
    const paymentInstructions = unpaidInvoices[0].conditions_paiement || undefined;

    // Render email HTML from React template
    const emailHtml = await render(
      PaymentReminderEmail({
        clientName: client.nom || "",
        clientFirstName: client.prenom || "",
        unpaidInvoices: formattedInvoices,
        totalDue,
        entrepriseName: entreprise?.nom || "MyProPartner",
        entrepriseEmail: entreprise?.email || undefined,
        entreprisePhone: entreprise?.telephone || undefined,
        paymentInstructions,
      })
    );

    // Send email
    const result = await emailService.sendEmail({
      to: client.email,
      subject: `Rappel de paiement - ${entreprise?.nom || "MyProPartner"}`,
      html: emailHtml,
      fromName: entreprise?.nom || 'MyProPartner',
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
      message: `Rappel de paiement envoyé avec succès à ${client.email}`,
      invoiceCount: unpaidInvoices.length,
      totalDue,
      emailId: result.messageId,
    });
  } catch (error) {
    return handleTenantError(error);
  }
}
