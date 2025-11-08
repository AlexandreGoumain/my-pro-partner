import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BankReconciliationService } from "@/lib/services/bank-reconciliation.service";

/**
 * POST /api/bank/[id]/ignore
 * Ignorer une transaction bancaire
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

    await BankReconciliationService.ignoreTransaction(params.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[IGNORE_TRANSACTION_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'opération" },
      { status: 500 }
    );
  }
}
