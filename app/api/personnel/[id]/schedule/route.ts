/**
 * API Routes - Gestion des horaires d'un employé
 * GET /api/personnel/[id]/schedule - Récupérer les horaires
 * POST /api/personnel/[id]/schedule - Définir les horaires
 */

import { withApiHandler } from "@/lib/api/api-handler";
import { getUserSchedule, setUserSchedule } from "@/lib/personnel/personnel.service";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(
    _req: NextRequest,
    { params }: RouteParams
) {
    return withApiHandler(
        async () => {
            const { id } = await params;
            const schedule = await getUserSchedule(id);
            return NextResponse.json({ schedule });
        },
        {
            context: { resourceName: "Personnel", operation: "getSchedule" },
        }
    );
}

export async function POST(
    req: NextRequest,
    { params }: RouteParams
) {
    return withApiHandler(
        async () => {
            const { id } = await params;
            const body = await req.json();
            const schedule = await setUserSchedule(id, body.schedules || []);
            return NextResponse.json({ schedule });
        },
        {
            context: { resourceName: "Personnel", operation: "setSchedule" },
        }
    );
}
