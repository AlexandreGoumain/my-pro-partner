import { withApiHandler } from "@/lib/api/api-handler";
import { BankReconciliationService } from "@/lib/services/bank-reconciliation.service";
import { NextResponse } from "next/server";

/**
 * POST /api/bank/auto-match
 * Launch automatic matching
 */
export async function POST() {
    return withApiHandler(
        async (ctx) => {
            await BankReconciliationService.autoMatch(ctx.entrepriseId);
            return NextResponse.json({ success: true });
        },
        {
            context: { resourceName: "BankTransaction", operation: "autoMatch" },
        }
    );
}
