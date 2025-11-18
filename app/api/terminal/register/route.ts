import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { TerminalService } from "@/lib/services/terminal.service";
import { validateRequest } from "@/lib/utils/validation-helper";
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
    const result = validateRequest(registerSchema, body);
    if (!result.success) return result.response;

    const terminal = await TerminalService.registerTerminal({
      entrepriseId,
      stripeTerminalId: result.data.stripeTerminalId,
      label: result.data.label,
      location: result.data.location,
    });

    return NextResponse.json({ terminal });
  } catch (error) {
    return handleTenantError(error);
  }
}
