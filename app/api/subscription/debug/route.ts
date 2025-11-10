import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

/**
 * GET /api/subscription/debug
 * Afficher l'état complet de l'abonnement (DB + Stripe)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const entrepriseId = session.user.entrepriseId;

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
    if (entreprise.stripeCustomerId) {
      try {
        const customer = await stripe.customers.retrieve(entreprise.stripeCustomerId);

        // Récupérer les subscriptions actives
        const subscriptions = await stripe.subscriptions.list({
          customer: entreprise.stripeCustomerId,
          limit: 10,
        });

        stripeData = {
          customer: {
            id: customer.id,
            email: (customer as any).email,
            name: (customer as any).name,
          },
          subscriptions: subscriptions.data.map((sub) => ({
            id: sub.id,
            status: sub.status,
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            cancel_at_period_end: sub.cancel_at_period_end,
            cancel_at: sub.cancel_at ? new Date(sub.cancel_at * 1000).toISOString() : null,
            trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
            items: sub.items.data.map((item) => ({
              price_id: item.price.id,
              product: item.price.product,
              amount: item.price.unit_amount ? item.price.unit_amount / 100 : 0,
              interval: item.price.recurring?.interval,
            })),
          })),
        };
      } catch (err: any) {
        stripeData = { error: err.message };
      }
    }

    // 3. Retourner tout
    return NextResponse.json({
      database: {
        entreprise: {
          id: entreprise.id,
          nom: entreprise.nom,
          plan: entreprise.plan,
          stripeCustomerId: entreprise.stripeCustomerId,
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
  } catch (error: any) {
    console.error("[SUBSCRIPTION_DEBUG_ERROR]", error);

    return NextResponse.json(
      { error: error.message || "Erreur lors du debug" },
      { status: 500 }
    );
  }
}

/**
 * Générer des recommandations basées sur l'état
 */
function getRecommendations(entreprise: any, stripeData: any): string[] {
  const recommendations: string[] = [];

  // Vérifier si le plan DB correspond à Stripe
  if (entreprise.subscription && stripeData?.subscriptions?.length > 0) {
    const stripeSub = stripeData.subscriptions[0];

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
  if (entreprise.subscription && !stripeData?.subscriptions?.length) {
    recommendations.push(
      `⚠️ Subscription exists in DB but not in Stripe (deleted or expired)`
    );
  }

  if (recommendations.length === 0) {
    recommendations.push("✅ Everything looks good!");
  }

  return recommendations;
}
