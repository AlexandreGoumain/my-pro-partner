import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe/stripe-config";
import { STRIPE_EVENTS, STRIPE_ERRORS } from "@/lib/stripe/stripe-constants";
import { prisma } from "@/lib/prisma";
import { centsToEuros, toNumber, calculateRemainingAmount } from "@/lib/utils/payment-utils";
import type Stripe from "stripe";

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events (payment confirmations)
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const headersList = await headers();
        const signature = headersList.get("stripe-signature");

        // Validate signature presence
        if (!signature) {
            return NextResponse.json(
                { received: false, error: "No signature found" },
                { status: 400 }
            );
        }

        // Verify webhook signature
        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            const error = err instanceof Error ? err.message : "Unknown error";
            console.error("[Stripe Webhook] Signature verification failed:", error);

            return NextResponse.json(
                { received: false, error: STRIPE_ERRORS.WEBHOOK_VERIFICATION_FAILED },
                { status: 400 }
            );
        }

        // Handle checkout.session.completed event
        if (event.type === STRIPE_EVENTS.CHECKOUT_SESSION_COMPLETED) {
            await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("[Stripe Webhook] Unexpected error:", error);

        return NextResponse.json(
            {
                received: false,
                error: error instanceof Error ? error.message : STRIPE_ERRORS.PAYMENT_PROCESSING_FAILED,
            },
            { status: 500 }
        );
    }
}

/**
 * Handle successful checkout session completion
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const documentId = session.metadata?.documentId;

    if (!documentId) {
        console.error("[Stripe Webhook] No documentId in session metadata");
        throw new Error("No documentId in session metadata");
    }

    // Fetch document
    const document = await prisma.document.findUnique({
        where: { id: documentId },
    });

    if (!document) {
        console.error("[Stripe Webhook] Document not found:", documentId);
        throw new Error(`Document not found: ${documentId}`);
    }

    // Convert amount from cents to euros
    const paidAmount = centsToEuros(session.amount_total || 0);

    // Record payment in database
    await prisma.paiement.create({
        data: {
            documentId: document.id,
            date_paiement: new Date(),
            montant: paidAmount,
            moyen_paiement: "CARTE",
            reference: session.payment_intent as string,
            notes: `Paiement Stripe - Session: ${session.id}`,
        },
    });

    // Calculate total payments
    const totalPaiements = await prisma.paiement.aggregate({
        where: { documentId: document.id },
        _sum: { montant: true },
    });

    const totalPaid = toNumber(totalPaiements._sum.montant);
    const totalAmount = toNumber(document.total_ttc);
    const remainingAmount = calculateRemainingAmount(totalAmount, totalPaid);

    // Update document status
    await prisma.document.update({
        where: { id: document.id },
        data: {
            reste_a_payer: remainingAmount,
            statut: remainingAmount <= 0 ? "PAYE" : document.statut,
        },
    });

    console.log(
        `[Stripe Webhook] Payment recorded for document ${document.numero}:`,
        `${paidAmount}€, remaining: ${remainingAmount}€`
    );
}
