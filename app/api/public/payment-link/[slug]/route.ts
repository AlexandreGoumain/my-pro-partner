import { NextRequest, NextResponse } from "next/server";
import { PaymentLinkService } from "@/lib/services/payment-link.service";

/**
 * GET /api/public/payment-link/[slug]
 * Récupérer un lien de paiement public (sans authentification)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const paymentLink = await PaymentLinkService.getPaymentLinkBySlug(slug);

    if (!paymentLink) {
      return NextResponse.json(
        { error: "Lien de paiement introuvable" },
        { status: 404 }
      );
    }

    // Incrémenter le compteur de vues
    await PaymentLinkService.incrementViews(paymentLink.id);

    return NextResponse.json({ paymentLink });
  } catch (error) {
    console.error("[PUBLIC_PAYMENT_LINK_ERROR]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur lors de la récupération du lien" },
      { status: 500 }
    );
  }
}
