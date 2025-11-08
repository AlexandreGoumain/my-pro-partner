import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BankReconciliationService } from "@/lib/services/bank-reconciliation.service";

/**
 * POST /api/bank/auto-match
 * Lancer le matching automatique
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    await BankReconciliationService.autoMatch(session.user.entrepriseId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[AUTO_MATCH_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors du matching automatique" },
      { status: 500 }
    );
  }
}
