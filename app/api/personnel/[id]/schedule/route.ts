/**
 * API Routes - Gestion des horaires d'un employé
 * GET /api/personnel/[id]/schedule - Récupérer les horaires
 * POST /api/personnel/[id]/schedule - Définir les horaires
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserSchedule, setUserSchedule } from "@/lib/personnel/personnel.service";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const schedule = await getUserSchedule(params.id);
    return NextResponse.json({ schedule });
  } catch (error: any) {
    console.error("[GET /api/personnel/:id/schedule] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const schedule = await setUserSchedule(params.id, body.schedules || []);

    return NextResponse.json({ schedule });
  } catch (error: any) {
    console.error("[POST /api/personnel/:id/schedule] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
