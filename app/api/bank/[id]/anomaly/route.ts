import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BankReconciliationService } from "@/lib/services/bank-reconciliation.service";
import { z } from "zod";

const anomalySchema = z.object({
  notes: z.string(),
});

/**
 * POST /api/bank/[id]/anomaly
 * Marquer une transaction comme anomalie
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

    const body = await req.json();
    const validation = anomalySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validation.error.errors },
        { status: 400 }
      );
    }

    await BankReconciliationService.markAsAnomaly(
      params.id,
      validation.data.notes
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[MARK_ANOMALY_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'opération" },
      { status: 500 }
    );
  }
}
