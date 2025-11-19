import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/user/me
 * Get current user information
 */
export async function GET(_req: NextRequest) {
    try {
        const { user, entreprise } = await requireTenantAuth();

        return NextResponse.json({
            user,
            entreprise,
        });
    } catch (error) {
        return handleTenantError(error);
    }
}
