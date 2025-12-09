import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe/stripe-config";
import { STRIPE_CONFIG, STRIPE_URLS, STRIPE_ERRORS } from "@/lib/stripe/stripe-constants";
import { eurosToCents, toNumber, calculateRemainingAmount } from "@/lib/utils/payment-utils";
import { withApiHandler } from "@/lib/api/api-handler";
import { verifyResourceAccess } from "@/lib/middleware/tenant-isolation";

/**
 * POST /api/documents/[id]/payment
 * Create a Stripe checkout session for invoice payment
 * SECURED: Requires authentication and verifies document ownership
 */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withApiHandler(async (ctx) => {
        const { id } = await params;

        // Verify document belongs to the authenticated user's business
        const { resource: document } = await verifyResourceAccess(
            id,
            (docId) => prisma.document.findUnique({
                where: { id: docId },
                include: {
                    client: true,
                    entreprise: true,
                },
            }),
            "Document"
        );

        // Validate document type
        if (document.type !== "FACTURE") {
            return NextResponse.json(
                { message: "Seules les factures peuvent être payées" },
                { status: 400 }
            );
        }

        // Check if already paid
        if (document.statut === "PAYE") {
            return NextResponse.json(
                { message: "Cette facture est déjà payée" },
                { status: 400 }
            );
        }

        // Calculate remaining amount safely
        const totalAmount = toNumber(document.total_ttc);
        const paidAmount = totalAmount - toNumber(document.reste_a_payer, totalAmount);
        const remainingAmount = calculateRemainingAmount(totalAmount, paidAmount);

        if (remainingAmount <= 0) {
            return NextResponse.json(
                { message: "Cette facture est déjà payée" },
                { status: 400 }
            );
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: [...STRIPE_CONFIG.PAYMENT_METHODS],
            line_items: [
                {
                    price_data: {
                        currency: STRIPE_CONFIG.CURRENCY,
                        product_data: {
                            name: `${document.type} ${document.numero}`,
                            description: `Paiement pour ${document.entreprise?.nom || "MyProPartner"}`,
                        },
                        unit_amount: eurosToCents(remainingAmount),
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: STRIPE_URLS.success(document.id),
            cancel_url: STRIPE_URLS.cancel(document.id),
            metadata: {
                documentId: document.id,
                documentType: document.type,
                documentNumero: document.numero,
            },
            customer_email: document.client.email || undefined,
        });

        return NextResponse.json({
            success: true,
            sessionId: session.id,
            url: session.url,
        });
    });
}
