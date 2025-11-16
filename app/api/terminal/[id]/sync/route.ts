import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { TerminalService } from "@/lib/services/terminal.service";

/**
 * POST /api/terminal/[id]/sync
 * Synchroniser le statut d'un terminal
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireTenantAuth();

    const reader = await TerminalService.syncTerminalStatus(params.id);

    return NextResponse.json({ success: true, reader });
  } catch (error: any) {
    return handleTenantError(error);
  }
}
