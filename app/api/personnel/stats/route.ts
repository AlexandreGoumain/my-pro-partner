/**
 * API Route - Statistiques du personnel
 * GET /api/personnel/stats - Récupérer les statistiques
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPersonnelStats } from "@/lib/personnel/personnel.service";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.entrepriseId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const stats = await getPersonnelStats(session.user.entrepriseId);

    return NextResponse.json({ stats });
  } catch (error: any) {
    console.error("[GET /api/personnel/stats] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
