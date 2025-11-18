import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { SubscriptionService } from "@/lib/services/subscription.service";
import { validateRequest } from "@/lib/utils/validation-helper";
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
    const { entrepriseId } = await requireTenantAuth();

    // Parser et valider le body
    const body = await req.json();
    const result = validateRequest(checkoutSchema, body);
    if (!result.success) return result.response;

    const { plan, interval } = result.data;

    // Construire les URLs de succès et annulation
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/pricing?canceled=true`;

    // Créer la session Checkout
    const checkoutSession = await SubscriptionService.createCheckoutSession({
      entrepriseId,
      plan,
      interval,
      successUrl,
      cancelUrl,
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    return handleTenantError(error);
  }
}
