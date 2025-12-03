import { withApiHandler } from "@/lib/api/api-handler";
import { SubscriptionService } from "@/lib/services/subscription.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/subscription/invoices
 * Récupérer toutes les factures Stripe de l'abonnement
 */
export async function GET(_req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const invoices = await SubscriptionService.getInvoices(ctx.entrepriseId);

            // Formater les factures pour le frontend
            const formattedInvoices = invoices.map((invoice) => ({
                id: invoice.id,
                number: invoice.number,
                amount: invoice.amount_paid / 100, // Convertir centimes en euros
                currency: invoice.currency,
                status: invoice.status,
                paid: invoice.status === "paid",
                date: new Date(invoice.created * 1000).toLocaleDateString("fr-FR"),
                pdfUrl: invoice.invoice_pdf,
                hostedUrl: invoice.hosted_invoice_url,
            }));

            return NextResponse.json({ invoices: formattedInvoices });
        },
        {
            context: { resourceName: "Subscription", operation: "invoices" },
        }
    );
}
