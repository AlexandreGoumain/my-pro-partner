import { NextRequest, NextResponse } from "next/server";
import { PaymentLinkService } from "@/lib/services/payment-link.service";

/**
 * POST /api/public/payment-link/[slug]/checkout
 * Créer une session Stripe Checkout pour un lien de paiement
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const paymentLink = await PaymentLinkService.getPaymentLinkBySlug(slug);

    if (!paymentLink || !paymentLink.isValid) {
      return NextResponse.json(
        { error: "Lien de paiement invalide ou expiré" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/payment-link/${slug}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/payment-link/${slug}?canceled=true`;

    const session = await PaymentLinkService.createCheckoutSession({
      paymentLink,
      successUrl,
      cancelUrl,
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("[PAYMENT_LINK_CHECKOUT_ERROR]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur lors de la création de la session" },
      { status: 500 }
    );
  }
}
