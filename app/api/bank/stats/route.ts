import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { BankReconciliationService } from "@/lib/services/bank-reconciliation.service";
import { NextResponse } from "next/server";

/**
 * GET /api/bank/stats
 * Récupérer les statistiques de rapprochement
 */
export async function GET() {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const stats = await BankReconciliationService.getStats(entrepriseId);

        return NextResponse.json({ stats });
    } catch (error) {
        return handleTenantError(error);
    }
}
