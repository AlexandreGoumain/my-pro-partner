/**
 * API Routes - Gestion des horaires d'un employé
 * GET /api/personnel/[id]/schedule - Récupérer les horaires
 * POST /api/personnel/[id]/schedule - Définir les horaires
 */

import { NextRequest, NextResponse } from "next/server";
import { requireTenantAuth, handleTenantError } from "@/lib/middleware/tenant-isolation";
import { getUserSchedule, setUserSchedule } from "@/lib/personnel/personnel.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireTenantAuth();
    const { id } = await params;

    const schedule = await getUserSchedule(id);
    return NextResponse.json({ schedule });
  } catch (error) {
    return handleTenantError(error);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireTenantAuth();
    const { id } = await params;

    const body = await req.json();
    const schedule = await setUserSchedule(id, body.schedules || []);

    return NextResponse.json({ schedule });
  } catch (error) {
    return handleTenantError(error);
  }
}
