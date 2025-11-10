import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe/stripe-config";
import { STRIPE_EVENTS, STRIPE_ERRORS } from "@/lib/stripe/stripe-constants";
import { prisma } from "@/lib/prisma";
import { centsToEuros, toNumber, calculateRemainingAmount } from "@/lib/utils/payment-utils";
import { LoyaltyService } from "@/lib/services/loyalty.service";
import { SubscriptionService } from "@/lib/services/subscription.service";
import { EmailNotificationService } from "@/lib/services/email-notification.service";
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
            return NextResponse.json(
                { received: false, error: STRIPE_ERRORS.WEBHOOK_VERIFICATION_FAILED },
                { status: 400 }
            );
        }

        // Handle events
        switch (event.type) {
            // Paiement one-shot (factures)
            case STRIPE_EVENTS.CHECKOUT_SESSION_COMPLETED: {
                const session = event.data.object as Stripe.Checkout.Session;
                // Vérifier si c'est un paiement de facture ou une souscription
                if (session.metadata?.documentId) {
                    await handleCheckoutCompleted(session);
                } else if (session.mode === "subscription") {
                    await handleSubscriptionCheckout(session);
                }
                break;
            }

            // Événements d'abonnement
            case "customer.subscription.created":
            case "customer.subscription.updated":
                await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
                break;

            case "customer.subscription.deleted":
                await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
                break;

            case "customer.subscription.trial_will_end":
                await handleTrialWillEnd(event.data.object as Stripe.Subscription);
                break;

            // Événements de paiement récurrent
            case "invoice.paid":
                await handleInvoicePaid(event.data.object as Stripe.Invoice);
                break;

            case "invoice.payment_failed":
                await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
                break;

            default:
                break;
        }

        return NextResponse.json({ received: true });
    } catch (error) {
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
        throw new Error("No documentId in session metadata");
    }

    // Fetch document with client info
    const document = await prisma.document.findUnique({
        where: { id: documentId },
        include: {
            client: true,
        },
    });

    if (!document) {
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

    // Add loyalty points to the client for this payment
    try {
        await LoyaltyService.addPoints({
            clientId: document.clientId,
            entrepriseId: document.entrepriseId,
            montant: Number(paidAmount),
            reference: document.numero,
            description: `Paiement de ${paidAmount}€ pour ${document.type === "FACTURE" ? "la facture" : "le document"} ${document.numero}`,
        });
    } catch (loyaltyError) {
        // Ignore loyalty errors - payment was successful
    }
}

/**
 * Handle subscription checkout completion
 */
async function handleSubscriptionCheckout(session: Stripe.Checkout.Session): Promise<void> {
    const entrepriseId = session.metadata?.entrepriseId;

    if (!entrepriseId) {
        return;
    }

    // Récupérer l'abonnement créé
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    // Créer l'abonnement en BDD
    const dbSubscription = await SubscriptionService.createSubscriptionFromStripe(subscription, entrepriseId);

    // Envoyer email de confirmation
    try {
        const entreprise = await prisma.entreprise.findUnique({
            where: { id: entrepriseId },
            include: { utilisateur: true },
        });

        if (entreprise?.utilisateur?.email) {
            await EmailNotificationService.sendSubscriptionConfirmation({
                email: entreprise.utilisateur.email,
                entrepriseName: entreprise.nom,
                plan: dbSubscription.plan,
                trialEnd: dbSubscription.trialEnd || undefined,
            });
        }
    } catch (error) {
        // Ignore email errors
    }
}

/**
 * Handle subscription update or creation
 */
async function handleSubscriptionUpdate(subscription: Stripe.Subscription): Promise<void> {
    try {
        // Vérifier si l'abonnement existe déjà
        const existing = await prisma.subscription.findUnique({
            where: { stripeSubscriptionId: subscription.id },
        });

        if (existing) {
            // Mettre à jour
            await SubscriptionService.updateSubscriptionFromStripe(subscription);
        } else {
            // Créer (si pas créé via checkout)
            const entrepriseId = subscription.metadata?.entrepriseId;

            if (entrepriseId) {
                await SubscriptionService.createSubscriptionFromStripe(subscription, entrepriseId);
            }
        }
    } catch (error) {
        throw error;
    }
}

/**
 * Handle subscription deletion/cancellation
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    try {
        await SubscriptionService.deleteSubscriptionFromStripe(subscription.id);
    } catch (error) {
        throw error;
    }
}

/**
 * Handle trial ending soon (3 days before)
 */
async function handleTrialWillEnd(subscription: Stripe.Subscription): Promise<void> {
    try {
        const dbSubscription = await prisma.subscription.findUnique({
            where: { stripeSubscriptionId: subscription.id },
            include: {
                entreprise: {
                    include: { utilisateur: true },
                },
            },
        });

        if (!dbSubscription) {
            return;
        }

        // Envoyer email d'alerte avant fin d'essai
        if (dbSubscription.entreprise.utilisateur?.email && dbSubscription.trialEnd) {
            const daysRemaining = Math.ceil(
                (new Date(dbSubscription.trialEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );

            await EmailNotificationService.sendTrialEndingWarning({
                email: dbSubscription.entreprise.utilisateur.email,
                entrepriseName: dbSubscription.entreprise.nom,
                daysRemaining: Math.max(1, daysRemaining),
                plan: dbSubscription.plan,
            });
        }
    } catch (error) {
        // Ne pas throw pour ne pas faire échouer le webhook
    }
}

/**
 * Handle successful invoice payment (renouvellement)
 */
async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
    try {
        // Si c'est une facture d'abonnement
        if (invoice.subscription) {
            const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
            await SubscriptionService.updateSubscriptionFromStripe(subscription);
        }
    } catch (error) {
        // Ne pas throw pour ne pas faire échouer le webhook
    }
}

/**
 * Handle failed invoice payment
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    try {
        if (invoice.subscription) {
            const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
            await SubscriptionService.updateSubscriptionFromStripe(subscription);

            const dbSubscription = await prisma.subscription.findUnique({
                where: { stripeSubscriptionId: subscription.id },
                include: {
                    entreprise: {
                        include: { utilisateur: true },
                    },
                },
            });

            if (dbSubscription) {
                // Envoyer email de paiement échoué
                if (dbSubscription.entreprise.utilisateur?.email) {
                    await EmailNotificationService.sendPaymentFailed({
                        email: dbSubscription.entreprise.utilisateur.email,
                        entrepriseName: dbSubscription.entreprise.nom,
                        amount: (invoice.amount_due || 0) / 100,
                        reason: invoice.last_finalization_error?.message,
                    });
                }
            }
        }
    } catch (error) {
        // Ne pas throw pour ne pas faire échouer le webhook
    }
}
