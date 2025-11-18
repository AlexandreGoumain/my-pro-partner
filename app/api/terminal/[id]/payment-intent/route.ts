import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { TerminalService } from "@/lib/services/terminal.service";
import { validateRequest } from "@/lib/utils/validation-helper";
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireTenantAuth();
    const { id } = await params;

    const body = await req.json();
    const result = validateRequest(paymentIntentSchema, body);
    if (!result.success) return result.response;

    const paymentIntent = await TerminalService.createPaymentIntent({
      terminalId: id,
      amount: result.data.amount,
      currency: result.data.currency,
      description: result.data.description,
    });

    return NextResponse.json({ paymentIntent });
  } catch (error) {
    return handleTenantError(error);
  }
}
