import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const reader = await TerminalService.syncTerminalStatus(params.id);

    return NextResponse.json({ success: true, reader });
  } catch (error: any) {
    console.error("[SYNC_TERMINAL_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la synchronisation" },
      { status: 500 }
    );
  }
}
