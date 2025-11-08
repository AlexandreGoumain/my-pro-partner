import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BankReconciliationService } from "@/lib/services/bank-reconciliation.service";
import { z } from "zod";

const matchSchema = z.object({
  transactionId: z.string(),
  documentId: z.string(),
});

/**
 * POST /api/bank/match
 * Rapprocher manuellement une transaction avec une facture
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const validation = matchSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validation.error.errors },
        { status: 400 }
      );
    }

    await BankReconciliationService.manualMatch({
      transactionId: validation.data.transactionId,
      documentId: validation.data.documentId,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[MANUAL_MATCH_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors du rapprochement" },
      { status: 500 }
    );
  }
}
