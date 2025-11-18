import { NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { TerminalService } from "@/lib/services/terminal.service";

/**
 * GET /api/terminal/list-stripe
 * Lister tous les terminaux Stripe disponibles
 */
export async function GET() {
  try {
    await requireTenantAuth();

    const terminals = await TerminalService.listStripeTerminals();

    return NextResponse.json({ terminals });
  } catch (error) {
    return handleTenantError(error);
  }
}
