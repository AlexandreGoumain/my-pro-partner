import { NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { TerminalService } from "@/lib/services/terminal.service";

/**
 * GET /api/terminal
 * Récupérer tous les terminaux d'une entreprise
 */
export async function GET() {
  try {
    const { entrepriseId } = await requireTenantAuth();

    const terminals = await TerminalService.getTerminals(entrepriseId);

    return NextResponse.json({ terminals });
  } catch (error: any) {
    return handleTenantError(error);
  }
}
