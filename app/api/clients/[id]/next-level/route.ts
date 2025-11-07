import { NextRequest, NextResponse } from "next/server";
import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { LoyaltyService } from "@/lib/services/loyalty.service";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { entrepriseId } = await requireTenantAuth();
        const { id: clientId } = await params;

        const nextLevelInfo = await LoyaltyService.getNextLevel(
            clientId,
            entrepriseId
        );

        if (!nextLevelInfo) {
            return NextResponse.json(null);
        }

        return NextResponse.json(nextLevelInfo);
    } catch (error) {
        return handleTenantError(error);
    }
}
