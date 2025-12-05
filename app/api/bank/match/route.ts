import { withApiHandler } from "@/lib/api/api-handler";
import { ValidationError } from "@/lib/errors";
import { BankReconciliationService } from "@/lib/services/bank-reconciliation.service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const matchSchema = z.object({
    transactionId: z.string(),
    documentId: z.string(),
});

/**
 * POST /api/bank/match
 * Manually match a transaction with an invoice
 */
export async function POST(req: NextRequest) {
    return withApiHandler(
        async () => {
            const body = await req.json();
            const result = matchSchema.safeParse(body);

            if (!result.success) {
                throw new ValidationError(result.error.errors[0].message);
            }

            await BankReconciliationService.manualMatch({
                transactionId: result.data.transactionId,
                documentId: result.data.documentId,
            });

            return NextResponse.json({ success: true });
        },
        {
            context: { resourceName: "BankTransaction", operation: "manualMatch" },
        }
    );
}
