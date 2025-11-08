import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BankReconciliationService } from "@/lib/services/bank-reconciliation.service";

/**
 * GET /api/bank/transactions
 * Récupérer toutes les transactions bancaires
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status");

    let transactions;

    if (status === "pending") {
      transactions = await BankReconciliationService.getPendingTransactions(
        session.user.entrepriseId
      );
    } else {
      transactions = await BankReconciliationService.getAllTransactions(
        session.user.entrepriseId
      );
    }

    return NextResponse.json({ transactions });
  } catch (error: any) {
    console.error("[GET_BANK_TRANSACTIONS_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la récupération des transactions" },
      { status: 500 }
    );
  }
}
