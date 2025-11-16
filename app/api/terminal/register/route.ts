import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { TerminalService } from "@/lib/services/terminal.service";
import { z } from "zod";

const registerSchema = z.object({
  stripeTerminalId: z.string(),
  label: z.string().min(1),
  location: z.string().optional(),
});

/**
 * POST /api/terminal/register
 * Enregistrer un nouveau terminal
 */
export async function POST(req: NextRequest) {
  try {
    const { entrepriseId } = await requireTenantAuth();

    const body = await req.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validation.error.errors },
        { status: 400 }
      );
    }

    const terminal = await TerminalService.registerTerminal({
      entrepriseId,
      stripeTerminalId: validation.data.stripeTerminalId,
      label: validation.data.label,
      location: validation.data.location,
    });

    return NextResponse.json({ terminal });
  } catch (error: any) {
    return handleTenantError(error);
  }
}
