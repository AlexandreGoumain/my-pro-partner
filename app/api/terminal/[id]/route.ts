import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { TerminalService } from "@/lib/services/terminal.service";

/**
 * DELETE /api/terminal/[id]
 * Supprimer un terminal
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireTenantAuth();

    await TerminalService.deleteTerminal(params.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return handleTenantError(error);
  }
}
