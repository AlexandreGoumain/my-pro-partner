import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { TerminalService } from "@/lib/services/terminal.service";

/**
 * DELETE /api/terminal/[id]
 * Supprimer un terminal
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireTenantAuth();
    const { id } = await params;

    await TerminalService.deleteTerminal(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleTenantError(error);
  }
}
