import { withApiHandler } from "@/lib/api/api-handler";
import { ValidationError } from "@/lib/errors";
import { TerminalService } from "@/lib/services/terminal.service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const cancelSchema = z.object({
    paymentIntentId: z.string(),
});

/**
 * POST /api/terminal/[id]/cancel
 * Annuler un paiement sur un terminal
 */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withApiHandler(
        async () => {
            const { id } = await params;

            const body = await req.json();
            const result = cancelSchema.safeParse(body);
            if (!result.success) {
                throw new ValidationError(result.error.errors[0].message);
            }

            await TerminalService.cancelPayment({
                terminalId: id,
                paymentIntentId: result.data.paymentIntentId,
            });

            return NextResponse.json({ success: true });
        },
        {
            anyCapability: ["pos"],
            context: { resourceName: "Terminal", operation: "cancelPayment" },
        }
    );
}
