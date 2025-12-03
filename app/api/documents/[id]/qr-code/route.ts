import { withApiHandler } from "@/lib/api/api-handler";
import { NotFoundError } from "@/lib/errors";
import { QRCodeService } from "@/lib/services/qr-code.service";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/documents/[id]/qr-code
 * Générer un QR code pour payer une facture
 */
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withApiHandler(
        async (ctx) => {
            const { id: documentId } = await params;

            // Vérifier que le document existe et appartient à l'entreprise
            const document = await prisma.document.findFirst({
                where: {
                    id: documentId,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!document) {
                throw new NotFoundError("Document");
            }

            // Générer le QR code
            const baseUrl =
                process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
            const qrCodeDataURL = await QRCodeService.generatePaymentQRCode(
                documentId,
                baseUrl
            );

            // Retourner le QR code en base64
            return NextResponse.json({
                qrCode: qrCodeDataURL,
                paymentUrl: `${baseUrl}/pay/${documentId}`,
            });
        },
        {
            context: { resourceName: "Document", operation: "generateQRCode" },
        }
    );
}
