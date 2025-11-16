import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
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
    const { entrepriseId } = await requireTenantAuth();

    const paymentLinkId = params.id;

    // Vérifier que le lien appartient à l'entreprise
    const paymentLink = await prisma.paymentLink.findFirst({
      where: {
        id: paymentLinkId,
        entrepriseId,
      },
    });

    if (!paymentLink) {
      return NextResponse.json({ error: "Lien introuvable" }, { status: 404 });
    }

    await PaymentLinkService.deletePaymentLink(paymentLinkId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleTenantError(error);
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
    const { entrepriseId } = await requireTenantAuth();

    const body = await req.json();
    const { actif } = body;

    const paymentLink = await prisma.paymentLink.updateMany({
      where: {
        id: params.id,
        entrepriseId,
      },
      data: { actif },
    });

    if (paymentLink.count === 0) {
      return NextResponse.json({ error: "Lien introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleTenantError(error);
  }
}
