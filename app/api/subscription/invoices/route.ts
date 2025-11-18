import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { SubscriptionService } from "@/lib/services/subscription.service";

/**
 * GET /api/subscription/invoices
 * Récupérer toutes les factures Stripe de l'abonnement
 */
export async function GET(_req: NextRequest) {
  try {
    const { entrepriseId } = await requireTenantAuth();

    const invoices = await SubscriptionService.getInvoices(entrepriseId);

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
  } catch (error) {
    return handleTenantError(error);
  }
}
