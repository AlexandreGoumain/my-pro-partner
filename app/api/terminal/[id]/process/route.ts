import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { TerminalService } from "@/lib/services/terminal.service";
import { validateRequest } from "@/lib/utils/validation-helper";
import { z } from "zod";

const processSchema = z.object({
  paymentIntentId: z.string(),
});

/**
 * POST /api/terminal/[id]/process
 * Traiter un paiement sur un terminal
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireTenantAuth();
    const { id } = await params;

    const body = await req.json();
    const validationResult = validateRequest(processSchema, body);
    if (!validationResult.success) return validationResult.response;

    const result = await TerminalService.processPayment({
      terminalId: id,
      paymentIntentId: validationResult.data.paymentIntentId,
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return handleTenantError(error);
  }
}
