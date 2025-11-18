import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";

/**
 * GET /api/user/business-type
 * Returns the current user's business type
 */
export async function GET(_req: NextRequest) {
  try {
    const { entreprise } = await requireTenantAuth();

    return NextResponse.json({
      businessType: entreprise.businessType,
    });
  } catch (error) {
    return handleTenantError(error);
  }
}
