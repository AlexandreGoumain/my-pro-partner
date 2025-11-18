import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { TerminalService } from "@/lib/services/terminal.service";

/**
 * POST /api/terminal/[id]/sync
 * Synchroniser le statut d'un terminal
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireTenantAuth();
    const { id } = await params;

    const reader = await TerminalService.syncTerminalStatus(id);

    return NextResponse.json({ success: true, reader });
  } catch (error) {
    return handleTenantError(error);
  }
}
