import { NextRequest, NextResponse } from "next/server";
import { PaymentLinkService } from "@/lib/services/payment-link.service";

/**
 * GET /api/public/payment-link/[slug]
 * Récupérer un lien de paiement public (sans authentification)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const paymentLink = await PaymentLinkService.getPaymentLinkBySlug(params.slug);

    if (!paymentLink) {
      return NextResponse.json(
        { error: "Lien de paiement introuvable" },
        { status: 404 }
      );
    }

    // Incrémenter le compteur de vues
    await PaymentLinkService.incrementViews(paymentLink.id);

    return NextResponse.json({ paymentLink });
  } catch (error: any) {
    console.error("[PUBLIC_PAYMENT_LINK_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la récupération du lien" },
      { status: 500 }
    );
  }
}
