import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { TerminalService } from "@/lib/services/terminal.service";
import { validateRequest } from "@/lib/utils/validation-helper";
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireTenantAuth();
    const { id } = await params;

    const body = await req.json();
    const result = validateRequest(cancelSchema, body);
    if (!result.success) return result.response;

    await TerminalService.cancelPayment({
      terminalId: id,
      paymentIntentId: result.data.paymentIntentId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleTenantError(error);
  }
}
