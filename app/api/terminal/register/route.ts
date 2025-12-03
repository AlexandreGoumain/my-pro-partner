import { withApiHandler } from "@/lib/api/api-handler";
import { ValidationError } from "@/lib/errors";
import { TerminalService } from "@/lib/services/terminal.service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
    stripeTerminalId: z.string(),
    label: z.string().min(1),
    location: z.string().optional(),
});

/**
 * POST /api/terminal/register
 * Enregistrer un nouveau terminal
 */
export async function POST(req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await req.json();
            const result = registerSchema.safeParse(body);
            if (!result.success) {
                throw new ValidationError(result.error.errors[0].message);
            }

            const terminal = await TerminalService.registerTerminal({
                entrepriseId: ctx.entrepriseId,
                stripeTerminalId: result.data.stripeTerminalId,
                label: result.data.label,
                location: result.data.location,
            });

            return NextResponse.json({ terminal });
        },
        {
            anyCapability: ["pos"],
            context: { resourceName: "Terminal", operation: "register" },
        }
    );
}
