import { withApiHandler } from "@/lib/api/api-handler";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/user/business-type
 * Returns the current user's business type
 */
export async function GET(_req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            return NextResponse.json({
                businessType: ctx.entreprise.businessType,
            });
        },
        {
            context: { resourceName: "User", operation: "businessType" },
        }
    );
}
