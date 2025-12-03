import { withApiHandler } from "@/lib/api/api-handler";
import { ValidationError } from "@/lib/errors";
import { TerminalService } from "@/lib/services/terminal.service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const paymentIntentSchema = z.object({
    amount: z.number().positive(),
    currency: z.string().default("eur"),
    description: z.string().optional(),
});

/**
 * POST /api/terminal/[id]/payment-intent
 * Créer une intention de paiement pour un terminal
 */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withApiHandler(
        async () => {
            const { id } = await params;

            const body = await req.json();
            const result = paymentIntentSchema.safeParse(body);
            if (!result.success) {
                throw new ValidationError(result.error.errors[0].message);
            }

            const paymentIntent = await TerminalService.createPaymentIntent({
                terminalId: id,
                amount: result.data.amount,
                currency: result.data.currency,
                description: result.data.description,
            });

            return NextResponse.json({ paymentIntent });
        },
        {
            anyCapability: ["pos"],
            context: { resourceName: "Terminal", operation: "createPaymentIntent" },
        }
    );
}
