import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PaymentLinkService } from "@/lib/services/payment-link.service";
import { prisma } from "@/lib/prisma";

/**
 * DELETE /api/payment-links/[id]
 * Supprimer un lien de paiement
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const paymentLinkId = params.id;

    // Vérifier que le lien appartient à l'entreprise
    const paymentLink = await prisma.paymentLink.findFirst({
      where: {
        id: paymentLinkId,
        entrepriseId: session.user.entrepriseId,
      },
    });

    if (!paymentLink) {
      return NextResponse.json({ error: "Lien introuvable" }, { status: 404 });
    }

    await PaymentLinkService.deletePaymentLink(paymentLinkId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[PAYMENT_LINK_DELETE_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/payment-links/[id]
 * Désactiver/activer un lien de paiement
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const { actif } = body;

    const paymentLink = await prisma.paymentLink.updateMany({
      where: {
        id: params.id,
        entrepriseId: session.user.entrepriseId,
      },
      data: { actif },
    });

    if (paymentLink.count === 0) {
      return NextResponse.json({ error: "Lien introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[PAYMENT_LINK_UPDATE_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
