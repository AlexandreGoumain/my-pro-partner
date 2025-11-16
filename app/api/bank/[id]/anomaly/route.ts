import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { BankReconciliationService } from "@/lib/services/bank-reconciliation.service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const anomalySchema = z.object({
    notes: z.string(),
});

/**
 * POST /api/bank/[id]/anomaly
 * Marquer une transaction comme anomalie
 */
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await requireTenantAuth();

        const body = await req.json();
        const validation = anomalySchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Données invalides",
                    details: validation.error.errors,
                },
                { status: 400 }
            );
        }

        await BankReconciliationService.markAsAnomaly(
            params.id,
            validation.data.notes
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return handleTenantError(error);
    }
}
