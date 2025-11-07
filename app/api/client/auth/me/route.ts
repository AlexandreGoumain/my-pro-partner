import { NextRequest, NextResponse } from "next/server";
import { requireClientAuth, handleClientAuthError } from "@/lib/middleware/client-auth";

/**
 * GET /api/client/auth/me
 * Get current authenticated client info
 */
export async function GET(req: NextRequest) {
    try {
        const { client } = await requireClientAuth(req);

        // Remove password from response
        const { password, ...clientWithoutPassword } = client;

        return NextResponse.json({
            client: clientWithoutPassword,
        });
    } catch (error) {
        return handleClientAuthError(error);
    }
}
