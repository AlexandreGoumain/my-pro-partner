import { withApiHandler } from "@/lib/api/api-handler";
import { TerminalService } from "@/lib/services/terminal.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/terminal/list-stripe
 * Lister tous les terminaux Stripe disponibles
 */
export async function GET(_req: NextRequest) {
    return withApiHandler(
        async () => {
            const terminals = await TerminalService.listStripeTerminals();
            return NextResponse.json({ terminals });
        },
        {
            anyCapability: ["pos"],
            context: { resourceName: "Terminal", operation: "listStripe" },
        }
    );
}
