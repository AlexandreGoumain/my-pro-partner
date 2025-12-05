import { withApiHandler } from "@/lib/api/api-handler";
import { LoyaltyService } from "@/lib/services/loyalty.service";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(
    _req: NextRequest,
    { params }: RouteParams
) {
    return withApiHandler(
        async (ctx) => {
            const { id: clientId } = await params;

            const nextLevelInfo = await LoyaltyService.getNextLevel(
                clientId,
                ctx.entrepriseId
            );

            if (!nextLevelInfo) {
                return NextResponse.json(null);
            }

            return NextResponse.json(nextLevelInfo);
        },
        {
            context: { resourceName: "Client", operation: "nextLevel" },
        }
    );
}
