import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { TerminalService } from "@/lib/services/terminal.service";
import { z } from "zod";

const paymentIntentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("eur"),
  description: z.string().optional(),
});

/**
 * POST /api/terminal/[id]/payment-intent
 * Créer une intention de paiement pour un terminal
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireTenantAuth();

    const body = await req.json();
    const validation = paymentIntentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validation.error.errors },
        { status: 400 }
      );
    }

    const paymentIntent = await TerminalService.createPaymentIntent({
      terminalId: params.id,
      amount: validation.data.amount,
      currency: validation.data.currency,
      description: validation.data.description,
    });

    return NextResponse.json({ paymentIntent });
  } catch (error: any) {
    return handleTenantError(error);
  }
}
