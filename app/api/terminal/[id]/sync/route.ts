import { withApiHandler } from "@/lib/api/api-handler";
import { TerminalService } from "@/lib/services/terminal.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/terminal/[id]/sync
 * Synchroniser le statut d'un terminal
 */
export async function POST(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withApiHandler(
        async () => {
            const { id } = await params;

            const reader = await TerminalService.syncTerminalStatus(id);

            return NextResponse.json({ success: true, reader });
        },
        {
            anyCapability: ["pos"],
            context: { resourceName: "Terminal", operation: "sync" },
        }
    );
}
