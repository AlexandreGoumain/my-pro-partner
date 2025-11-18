import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { BankReconciliationService } from "@/lib/services/bank-reconciliation.service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateRequest } from "@/lib/utils/validation-helper";

const anomalySchema = z.object({
    notes: z.string(),
});

/**
 * POST /api/bank/[id]/anomaly
 * Marquer une transaction comme anomalie
 */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await requireTenantAuth();

        const body = await req.json();
        const result = validateRequest(anomalySchema, body);
        if (!result.success) return result.response;

        await BankReconciliationService.markAsAnomaly(
            id,
            result.data.notes
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return handleTenantError(error);
    }
}
