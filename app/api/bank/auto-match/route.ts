import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { BankReconciliationService } from "@/lib/services/bank-reconciliation.service";
import { NextResponse } from "next/server";

/**
 * POST /api/bank/auto-match
 * Lancer le matching automatique
 */
export async function POST() {
    try {
        const { entrepriseId } = await requireTenantAuth();

        await BankReconciliationService.autoMatch(entrepriseId);

        return NextResponse.json({ success: true });
    } catch (error) {
        return handleTenantError(error);
    }
}
