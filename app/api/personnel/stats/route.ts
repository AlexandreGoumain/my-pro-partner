/**
 * API Route - Statistiques du personnel
 * GET /api/personnel/stats - Récupérer les statistiques
 */

import { withApiHandler } from "@/lib/api/api-handler";
import { getPersonnelStats } from "@/lib/personnel/personnel.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const stats = await getPersonnelStats(ctx.entrepriseId);
            return NextResponse.json({ stats });
        },
        {
            context: { resourceName: "Personnel", operation: "stats" },
        }
    );
}
