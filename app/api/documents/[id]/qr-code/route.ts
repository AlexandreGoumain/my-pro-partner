import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { QRCodeService } from "@/lib/services/qr-code.service";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/documents/[id]/qr-code
 * Générer un QR code pour payer une facture
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { entrepriseId } = await requireTenantAuth();
    const { id: documentId } = await params;

    // Vérifier que le document existe et appartient à l'entreprise
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        entrepriseId,
      },
    });

    if (!document) {
      return NextResponse.json({ error: "Document introuvable" }, { status: 404 });
    }

    // Générer le QR code
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const qrCodeDataURL = await QRCodeService.generatePaymentQRCode(documentId, baseUrl);

    // Retourner le QR code en base64
    return NextResponse.json({
      qrCode: qrCodeDataURL,
      paymentUrl: `${baseUrl}/pay/${documentId}`,
    });
  } catch (error: unknown) {
    return handleTenantError(error);
  }
}
