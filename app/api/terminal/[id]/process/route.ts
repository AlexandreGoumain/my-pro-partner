import { withApiHandler } from "@/lib/api/api-handler";
import { ValidationError } from "@/lib/errors";
import { TerminalService } from "@/lib/services/terminal.service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const processSchema = z.object({
    paymentIntentId: z.string(),
});

/**
 * POST /api/terminal/[id]/process
 * Traiter un paiement sur un terminal
 */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withApiHandler(
        async () => {
            const { id } = await params;

            const body = await req.json();
            const validationResult = processSchema.safeParse(body);
            if (!validationResult.success) {
                throw new ValidationError(validationResult.error.errors[0].message);
            }

            const result = await TerminalService.processPayment({
                terminalId: id,
                paymentIntentId: validationResult.data.paymentIntentId,
            });

            return NextResponse.json({ success: true, result });
        },
        {
            anyCapability: ["pos"],
            context: { resourceName: "Terminal", operation: "processPayment" },
        }
    );
}
