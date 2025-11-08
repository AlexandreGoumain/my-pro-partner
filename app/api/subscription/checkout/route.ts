import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SubscriptionService } from "@/lib/services/subscription.service";
import { z } from "zod";

const checkoutSchema = z.object({
  plan: z.enum(["STARTER", "PRO", "ENTERPRISE"]),
  interval: z.enum(["month", "year"]),
});

/**
 * POST /api/subscription/checkout
 * Créer une session Stripe Checkout pour souscrire à un plan
 */
export async function POST(req: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Parser et valider le body
    const body = await req.json();
    const validation = checkoutSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { plan, interval } = validation.data;

    // Construire les URLs de succès et annulation
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/pricing?canceled=true`;

    // Créer la session Checkout
    const checkoutSession = await SubscriptionService.createCheckoutSession({
      entrepriseId: session.user.entrepriseId,
      plan,
      interval,
      successUrl,
      cancelUrl,
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error: any) {
    console.error("[SUBSCRIPTION_CHECKOUT_ERROR]", error);

    return NextResponse.json(
      { error: error.message || "Erreur lors de la création de la session checkout" },
      { status: 500 }
    );
  }
}
