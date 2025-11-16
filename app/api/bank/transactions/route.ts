import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { BankReconciliationService } from "@/lib/services/bank-reconciliation.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/bank/transactions
 * Récupérer toutes les transactions bancaires
 */
export async function GET(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const searchParams = req.nextUrl.searchParams;
        const status = searchParams.get("status");

        let transactions;

        if (status === "pending") {
            transactions =
                await BankReconciliationService.getPendingTransactions(
                    entrepriseId
                );
        } else {
            transactions =
                await BankReconciliationService.getAllTransactions(
                    entrepriseId
                );
        }

        return NextResponse.json({ transactions });
    } catch (error) {
        return handleTenantError(error);
    }
}
