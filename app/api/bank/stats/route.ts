import { withApiHandler } from "@/lib/api/api-handler";
import { BankReconciliationService } from "@/lib/services/bank-reconciliation.service";
import { NextResponse } from "next/server";

/**
 * GET /api/bank/stats
 * Get reconciliation statistics
 */
export async function GET() {
    return withApiHandler(
        async (ctx) => {
            const stats = await BankReconciliationService.getStats(ctx.entrepriseId);
            return NextResponse.json({ stats });
        },
        {
            context: { resourceName: "BankTransaction", operation: "stats" },
        }
    );
}
