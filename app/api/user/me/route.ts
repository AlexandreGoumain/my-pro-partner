import { withApiHandler } from "@/lib/api/api-handler";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/user/me
 * Get current user information
 */
export async function GET(_req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            return NextResponse.json({
                user: ctx.user,
                entreprise: ctx.entreprise,
            });
        },
        {
            context: { resourceName: "User", operation: "me" },
        }
    );
}
