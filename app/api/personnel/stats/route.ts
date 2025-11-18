/**
 * API Route - Statistiques du personnel
 * GET /api/personnel/stats - Récupérer les statistiques
 */

import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { getPersonnelStats } from "@/lib/personnel/personnel.service";

export async function GET(_req: NextRequest) {
  try {
    const { entrepriseId } = await requireTenantAuth();

    const stats = await getPersonnelStats(entrepriseId);

    return NextResponse.json({ stats });
  } catch (error) {
    return handleTenantError(error);
  }
}
