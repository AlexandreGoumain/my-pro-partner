import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TerminalService } from "@/lib/services/terminal.service";
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validation.error.errors },
        { status: 400 }
      );
    }

    const terminal = await TerminalService.registerTerminal({
      entrepriseId: session.user.entrepriseId,
      stripeTerminalId: validation.data.stripeTerminalId,
      label: validation.data.label,
      location: validation.data.location,
    });

    return NextResponse.json({ terminal });
  } catch (error: any) {
    console.error("[REGISTER_TERMINAL_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'enregistrement du terminal" },
      { status: 500 }
    );
  }
}
