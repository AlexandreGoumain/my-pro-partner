import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TerminalService } from "@/lib/services/terminal.service";
import { z } from "zod";

const cancelSchema = z.object({
  paymentIntentId: z.string(),
});

/**
 * POST /api/terminal/[id]/cancel
 * Annuler un paiement sur un terminal
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const validation = cancelSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validation.error.errors },
        { status: 400 }
      );
    }

    await TerminalService.cancelPayment({
      terminalId: params.id,
      paymentIntentId: validation.data.paymentIntentId,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[CANCEL_PAYMENT_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'annulation du paiement" },
      { status: 500 }
    );
  }
}
