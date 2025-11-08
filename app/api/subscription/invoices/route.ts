import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SubscriptionService } from "@/lib/services/subscription.service";

/**
 * GET /api/subscription/invoices
 * Récupérer toutes les factures Stripe de l'abonnement
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const invoices = await SubscriptionService.getInvoices(session.user.entrepriseId);

    // Formater les factures pour le frontend
    const formattedInvoices = invoices.map((invoice) => ({
      id: invoice.id,
      number: invoice.number,
      amount: invoice.amount_paid / 100, // Convertir centimes en euros
      currency: invoice.currency,
      status: invoice.status,
      paid: invoice.paid,
      date: new Date(invoice.created * 1000).toLocaleDateString("fr-FR"),
      pdfUrl: invoice.invoice_pdf,
      hostedUrl: invoice.hosted_invoice_url,
    }));

    return NextResponse.json({ invoices: formattedInvoices });
  } catch (error: any) {
    console.error("[SUBSCRIPTION_INVOICES_ERROR]", error);

    return NextResponse.json(
      { error: error.message || "Erreur lors de la récupération des factures" },
      { status: 500 }
    );
  }
}
