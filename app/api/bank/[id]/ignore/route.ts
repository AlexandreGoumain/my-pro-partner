import { withApiHandler } from "@/lib/api/api-handler";
import { BankReconciliationService } from "@/lib/services/bank-reconciliation.service";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * POST /api/bank/[id]/ignore
 * Ignore a bank transaction
 */
export async function POST(_req: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async () => {
            const { id } = await params;
            await BankReconciliationService.ignoreTransaction(id);
            return NextResponse.json({ success: true });
        },
        {
            context: { resourceName: "BankTransaction", operation: "ignore" },
        }
    );
}
