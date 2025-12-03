import { withApiHandler } from "@/lib/api/api-handler";
import { TerminalService } from "@/lib/services/terminal.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * DELETE /api/terminal/[id]
 * Supprimer un terminal
 */
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withApiHandler(
        async () => {
            const { id } = await params;

            await TerminalService.deleteTerminal(id);

            return NextResponse.json({ success: true });
        },
        {
            anyCapability: ["pos"],
            context: { resourceName: "Terminal", operation: "delete" },
        }
    );
}
