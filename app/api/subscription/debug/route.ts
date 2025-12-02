import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

/**
 * GET /api/subscription/debug
 * Afficher l'état complet de l'abonnement (DB + Stripe)
 */
export async function GET(_req: NextRequest) {
  try {
    const { entrepriseId } = await requireTenantAuth();

    // 1. Récupérer l'entreprise et son abonnement dans la DB
    const entreprise = await prisma.entreprise.findUnique({
      where: { id: entrepriseId },
      include: {
        subscription: true,
      },
    });

    if (!entreprise) {
      return NextResponse.json({ error: "Entreprise non trouvée" }, { status: 404 });
    }

    // 2. Récupérer les infos de Stripe si il y a un customer ID
    let stripeData = null;
    if (entreprise.subscription?.stripeCustomerId) {
      try {
        const customer = await stripe.customers.retrieve(entreprise.subscription.stripeCustomerId);

        // Récupérer les subscriptions actives
        const subscriptions = await stripe.subscriptions.list({
          customer: entreprise.subscription.stripeCustomerId,
          limit: 10,
        });

        stripeData = {
          customer: {
            id: customer.id,
            email: customer.deleted ? null : customer.email,
            name: customer.deleted ? null : customer.name,
          },
          subscriptions: subscriptions.data.map((sub) => {
            // Cast to any to handle API version differences in property names
            const subAny = sub as unknown as Record<string, unknown>;
            const periodEnd = subAny.current_period_end as number | null;
            return {
              id: sub.id,
              status: sub.status,
              current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
              cancel_at_period_end: sub.cancel_at_period_end,
              cancel_at: sub.cancel_at ? new Date(sub.cancel_at * 1000).toISOString() : null,
              trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
              items: sub.items.data.map((item) => ({
                price_id: item.price.id,
                product: item.price.product,
                amount: item.price.unit_amount ? item.price.unit_amount / 100 : 0,
                interval: item.price.recurring?.interval,
              })),
            };
          }),
        };
      } catch (err) {
        stripeData = { error: err instanceof Error ? err.message : 'Unknown error' };
      }
    }

    // 3. Retourner tout
    return NextResponse.json({
      database: {
        entreprise: {
          id: entreprise.id,
          nom: entreprise.nom,
          plan: entreprise.plan,
          stripeCustomerId: entreprise.subscription?.stripeCustomerId,
        },
        subscription: entreprise.subscription ? {
          id: entreprise.subscription.id,
          plan: entreprise.subscription.plan,
          status: entreprise.subscription.status,
          currentPeriodEnd: entreprise.subscription.currentPeriodEnd,
          cancelAtPeriodEnd: entreprise.subscription.cancelAtPeriodEnd,
          stripeSubscriptionId: entreprise.subscription.stripeSubscriptionId,
          stripePriceId: entreprise.subscription.stripePriceId,
        } : null,
      },
      stripe: stripeData,
      recommendations: getRecommendations(entreprise, stripeData),
    });
  } catch (error) {
    return handleTenantError(error);
  }
}

/**
 * Générer des recommandations basées sur l'état
 */
type StripeDataType = {
  customer?: unknown;
  subscriptions?: Array<{ status: string; cancel_at_period_end: boolean }>;
  error?: string;
} | null;

function getRecommendations(entreprise: { id: string; nom: string; plan: string; subscription: { plan: string; status: string; cancelAtPeriodEnd: boolean } | null }, stripeData: StripeDataType): string[] {
  const recommendations: string[] = [];

  // Vérifier si le plan DB correspond à Stripe
  const subscriptions = stripeData?.subscriptions;
  if (entreprise.subscription && subscriptions && subscriptions.length > 0) {
    const stripeSub = subscriptions[0];

    if (stripeSub.status !== entreprise.subscription.status) {
      recommendations.push(
        `⚠️ Status mismatch: DB="${entreprise.subscription.status}" vs Stripe="${stripeSub.status}"`
      );
    }

    if (stripeSub.cancel_at_period_end !== entreprise.subscription.cancelAtPeriodEnd) {
      recommendations.push(
        `⚠️ CancelAtPeriodEnd mismatch: DB="${entreprise.subscription.cancelAtPeriodEnd}" vs Stripe="${stripeSub.cancel_at_period_end}"`
      );
    }
  }

  // Vérifier si l'entreprise.plan correspond à subscription.plan
  if (entreprise.subscription && entreprise.plan !== entreprise.subscription.plan) {
    recommendations.push(
      `⚠️ Plan mismatch: entreprise.plan="${entreprise.plan}" vs subscription.plan="${entreprise.subscription.plan}"`
    );
  }

  // Si pas de subscription dans Stripe mais dans DB
  if (entreprise.subscription && (!subscriptions || subscriptions.length === 0)) {
    recommendations.push(
      `⚠️ Subscription exists in DB but not in Stripe (deleted or expired)`
    );
  }

  if (recommendations.length === 0) {
    recommendations.push("✅ Everything looks good!");
  }

  return recommendations;
}
