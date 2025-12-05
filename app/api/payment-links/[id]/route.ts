import { withApiHandler } from "@/lib/api/api-handler";
import { NotFoundError } from "@/lib/errors";
import { PaymentLinkService } from "@/lib/services/payment-link.service";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * DELETE /api/payment-links/[id]
 * Supprimer un lien de paiement
 */
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withApiHandler(
        async (ctx) => {
            const { id: paymentLinkId } = await params;

            // Vérifier que le lien appartient à l'entreprise
            const paymentLink = await prisma.paymentLink.findFirst({
                where: {
                    id: paymentLinkId,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!paymentLink) {
                throw new NotFoundError("Lien de paiement");
            }

            await PaymentLinkService.deletePaymentLink(paymentLinkId);

            return NextResponse.json({ success: true });
        },
        {
            context: { resourceName: "PaymentLink", operation: "delete" },
        }
    );
}

/**
 * PATCH /api/payment-links/[id]
 * Désactiver/activer un lien de paiement
 */
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const body = await req.json();
            const { actif } = body;

            const paymentLink = await prisma.paymentLink.updateMany({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                data: { actif },
            });

            if (paymentLink.count === 0) {
                throw new NotFoundError("Lien de paiement");
            }

            return NextResponse.json({ success: true });
        },
        {
            context: { resourceName: "PaymentLink", operation: "update" },
        }
    );
}
