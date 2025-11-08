import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BankReconciliationService } from "@/lib/services/bank-reconciliation.service";

/**
 * GET /api/bank/stats
 * Récupérer les statistiques de rapprochement
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const stats = await BankReconciliationService.getStats(
      session.user.entrepriseId
    );

    return NextResponse.json({ stats });
  } catch (error: any) {
    console.error("[GET_BANK_STATS_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la récupération des stats" },
      { status: 500 }
    );
  }
}
