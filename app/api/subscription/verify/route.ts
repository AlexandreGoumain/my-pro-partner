import { withApiHandler } from "@/lib/api/api-handler";
import { ValidationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe/stripe-config";
import { SubscriptionService } from "@/lib/services/subscription.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/subscription/verify
 *
 * Vérifie que l'abonnement en DB est synchronisé avec Stripe
 * Stripe = source de vérité, on force la sync si nécessaire
 */
export async function POST(req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const { stripeSessionId } = await req.json();

            // 1. Récupérer la session Stripe pour obtenir le subscription ID
            let stripeSubscriptionId: string;

            if (stripeSessionId) {
                const stripeSession = await stripe.checkout.sessions.retrieve(stripeSessionId);

                if (!stripeSession.subscription) {
                    throw new ValidationError("Aucun abonnement trouvé dans cette session");
                }

                stripeSubscriptionId = stripeSession.subscription as string;
            } else {
                // Si pas de session_id, chercher l'abonnement en DB
                const dbSub = await prisma.subscription.findUnique({
                    where: { entrepriseId: ctx.entrepriseId },
                });

                if (!dbSub?.stripeSubscriptionId) {
                    return NextResponse.json({
                        status: "waiting",
                        message: "Abonnement en cours de création...",
                    });
                }

                stripeSubscriptionId = dbSub.stripeSubscriptionId;
            }

            // 2. Récupérer l'abonnement depuis Stripe (SOURCE DE VÉRITÉ)
            const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

            // 3. Récupérer l'abonnement depuis la DB
            const dbSubscription = await prisma.subscription.findUnique({
                where: { stripeSubscriptionId },
            });

            // 4. Comparer et synchroniser si nécessaire
            const needsSync =
                !dbSubscription ||
                dbSubscription.status !== mapStripeStatus(stripeSubscription.status) ||
                dbSubscription.stripePriceId !== stripeSubscription.items.data[0].price.id;

            if (needsSync) {
                // Force la synchronisation avec Stripe
                if (dbSubscription) {
                    await SubscriptionService.updateSubscriptionFromStripe(stripeSubscription);
                } else {
                    await SubscriptionService.createSubscriptionFromStripe(
                        stripeSubscription,
                        ctx.entrepriseId
                    );
                }

                return NextResponse.json({
                    status: "synced",
                    message: "Abonnement synchronisé avec succès",
                    plan: getPlanFromStripeSubscription(stripeSubscription),
                    trialEnd: stripeSubscription.trial_end
                        ? new Date(stripeSubscription.trial_end * 1000).toISOString()
                        : null,
                });
            }

            // 5. Déjà synchronisé
            return NextResponse.json({
                status: "verified",
                message: "Abonnement vérifié et à jour",
                plan: getPlanFromStripeSubscription(stripeSubscription),
                trialEnd: stripeSubscription.trial_end
                    ? new Date(stripeSubscription.trial_end * 1000).toISOString()
                    : null,
            });
        },
        {
            context: { resourceName: "Subscription", operation: "verify" },
        }
    );
}

// Helper pour mapper le statut Stripe
function mapStripeStatus(status: string): string {
    const statusMap: Record<string, string> = {
        active: "ACTIVE",
        trialing: "TRIALING",
        past_due: "PAST_DUE",
        canceled: "CANCELED",
        incomplete: "INCOMPLETE",
        incomplete_expired: "INCOMPLETE_EXPIRED",
        unpaid: "UNPAID",
        paused: "PAUSED",
    };
    return statusMap[status] || "CANCELED";
}

// Helper pour extraire le plan depuis Stripe
function getPlanFromStripeSubscription(subscription: {
    items: { data: Array<{ price: { id: string } }> };
}): string {
    const priceId = subscription.items.data[0].price.id;

    if (
        priceId === process.env.STRIPE_PRICE_STARTER_MONTHLY ||
        priceId === process.env.STRIPE_PRICE_STARTER_ANNUAL
    ) {
        return "STARTER";
    }
    if (
        priceId === process.env.STRIPE_PRICE_PRO_MONTHLY ||
        priceId === process.env.STRIPE_PRICE_PRO_ANNUAL
    ) {
        return "PRO";
    }
    if (
        priceId === process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY ||
        priceId === process.env.STRIPE_PRICE_ENTERPRISE_ANNUAL
    ) {
        return "ENTERPRISE";
    }

    return "FREE";
}
