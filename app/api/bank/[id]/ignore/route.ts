import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { BankReconciliationService } from "@/lib/services/bank-reconciliation.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/bank/[id]/ignore
 * Ignorer une transaction bancaire
 */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await requireTenantAuth();

        await BankReconciliationService.ignoreTransaction(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        return handleTenantError(error);
    }
}
