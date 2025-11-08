import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { QRCodeService } from "@/lib/services/qr-code.service";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/documents/[id]/qr-code
 * Générer un QR code pour payer une facture
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const documentId = params.id;

    // Vérifier que le document existe et appartient à l'entreprise
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        entrepriseId: session.user.entrepriseId,
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
  } catch (error: any) {
    console.error("[QR_CODE_GENERATION_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la génération du QR code" },
      { status: 500 }
    );
  }
}
