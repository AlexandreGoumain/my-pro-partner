import { withApiHandler } from "@/lib/api/api-handler";
import { ValidationError } from "@/lib/errors";
import { SubscriptionService } from "@/lib/services/subscription.service";
import { NextRequest, NextResponse } from "next/server";
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
    return withApiHandler(
        async (ctx) => {
            // Parser et valider le body
            const body = await req.json();
            const result = checkoutSchema.safeParse(body);
            if (!result.success) {
                throw new ValidationError(result.error.errors[0].message);
            }

            const { plan, interval } = result.data;

            // Construire les URLs de succès et annulation
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
            const successUrl = `${baseUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`;
            const cancelUrl = `${baseUrl}/pricing?canceled=true`;

            // Créer la session Checkout
            const checkoutSession = await SubscriptionService.createCheckoutSession({
                entrepriseId: ctx.entrepriseId,
                plan,
                interval,
                successUrl,
                cancelUrl,
            });

            return NextResponse.json({
                sessionId: checkoutSession.id,
                url: checkoutSession.url,
            });
        },
        {
            context: { resourceName: "Subscription", operation: "checkout" },
        }
    );
}
