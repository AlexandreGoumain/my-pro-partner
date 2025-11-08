/**
 * API Routes - Time Tracking (Pointage)
 * POST /api/personnel/time-tracking/clock-in - Pointer l'arrivée
 * POST /api/personnel/time-tracking/clock-out - Pointer la sortie
 * GET /api/personnel/time-tracking - Récupérer les entrées de temps
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  clockIn,
  clockOut,
  getTimeEntries,
  createTimeEntry,
} from "@/lib/personnel/personnel.service";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || session.user.id;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "startDate et endDate sont requis" },
        { status: 400 }
      );
    }

    const entries = await getTimeEntries(
      userId,
      new Date(startDate),
      new Date(endDate)
    );

    return NextResponse.json({ entries });
  } catch (error: any) {
    console.error("[GET /api/personnel/time-tracking] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    if (action === "clock-in") {
      const entry = await clockIn(session.user.id, undefined, body.notes);
      return NextResponse.json({ entry });
    }

    if (action === "clock-out") {
      const entry = await clockOut(
        session.user.id,
        body.breakDuration || 0
      );
      return NextResponse.json({ entry });
    }

    if (action === "manual-entry") {
      // Création manuelle d'une entrée (pour corrections)
      if (!body.date || !body.clockIn || !body.clockOut) {
        return NextResponse.json(
          { error: "date, clockIn et clockOut sont requis" },
          { status: 400 }
        );
      }

      const entry = await createTimeEntry(body.userId || session.user.id, {
        date: new Date(body.date),
        clockIn: new Date(body.clockIn),
        clockOut: new Date(body.clockOut),
        breakDuration: body.breakDuration,
        notes: body.notes,
        type: body.type,
      });

      return NextResponse.json({ entry });
    }

    return NextResponse.json(
      { error: "Action invalide. Utilisez 'clock-in', 'clock-out' ou 'manual-entry'" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("[POST /api/personnel/time-tracking] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
