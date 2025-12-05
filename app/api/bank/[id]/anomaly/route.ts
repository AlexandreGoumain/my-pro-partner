import { withApiHandler } from "@/lib/api/api-handler";
import { ValidationError } from "@/lib/errors";
import { BankReconciliationService } from "@/lib/services/bank-reconciliation.service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type RouteParams = { params: Promise<{ id: string }> };

const anomalySchema = z.object({
    notes: z.string(),
});

/**
 * POST /api/bank/[id]/anomaly
 * Mark a transaction as anomaly
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async () => {
            const { id } = await params;
            const body = await req.json();
            const result = anomalySchema.safeParse(body);

            if (!result.success) {
                throw new ValidationError(result.error.errors[0].message);
            }

            await BankReconciliationService.markAsAnomaly(id, result.data.notes);

            return NextResponse.json({ success: true });
        },
        {
            context: { resourceName: "BankTransaction", operation: "markAsAnomaly" },
        }
    );
}
