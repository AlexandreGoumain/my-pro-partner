import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { TerminalService } from "@/lib/services/terminal.service";
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
  { params }: { params: { id: string } }
) {
  try {
    await requireTenantAuth();

    const body = await req.json();
    const validation = processSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validation.error.errors },
        { status: 400 }
      );
    }

    const result = await TerminalService.processPayment({
      terminalId: params.id,
      paymentIntentId: validation.data.paymentIntentId,
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return handleTenantError(error);
  }
}
