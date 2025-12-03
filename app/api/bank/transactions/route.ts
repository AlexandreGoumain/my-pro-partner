import { withApiHandler } from "@/lib/api/api-handler";
import { BankReconciliationService } from "@/lib/services/bank-reconciliation.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/bank/transactions
 * Get all bank transactions
 */
export async function GET(req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const searchParams = req.nextUrl.searchParams;
            const status = searchParams.get("status");

            let transactions;

            if (status === "pending") {
                transactions = await BankReconciliationService.getPendingTransactions(
                    ctx.entrepriseId
                );
            } else {
                transactions = await BankReconciliationService.getAllTransactions(
                    ctx.entrepriseId
                );
            }

            return NextResponse.json({ transactions });
        },
        {
            context: { resourceName: "BankTransaction", operation: "list" },
        }
    );
}
