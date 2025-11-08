import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TerminalService } from "@/lib/services/terminal.service";

/**
 * GET /api/terminal/list-stripe
 * Lister tous les terminaux Stripe disponibles
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const terminals = await TerminalService.listStripeTerminals();

    return NextResponse.json({ terminals });
  } catch (error: any) {
    console.error("[LIST_STRIPE_TERMINALS_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la récupération des terminaux" },
      { status: 500 }
    );
  }
}
