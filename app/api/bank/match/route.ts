import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { BankReconciliationService } from "@/lib/services/bank-reconciliation.service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateRequest } from "@/lib/utils/validation-helper";

const matchSchema = z.object({
    transactionId: z.string(),
    documentId: z.string(),
});

/**
 * POST /api/bank/match
 * Rapprocher manuellement une transaction avec une facture
 */
export async function POST(req: NextRequest) {
    try {
        await requireTenantAuth();

        const body = await req.json();
        const result = validateRequest(matchSchema, body);
        if (!result.success) return result.response;

        await BankReconciliationService.manualMatch({
            transactionId: result.data.transactionId,
            documentId: result.data.documentId,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return handleTenantError(error);
    }
}
