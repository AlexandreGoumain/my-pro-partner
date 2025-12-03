/**
 * API Routes - Time Tracking (Pointage)
 * POST /api/personnel/time-tracking/clock-in - Pointer l'arrivée
 * POST /api/personnel/time-tracking/clock-out - Pointer la sortie
 * GET /api/personnel/time-tracking - Récupérer les entrées de temps
 */

import { withApiHandler } from "@/lib/api/api-handler";
import { ValidationError } from "@/lib/errors";
import {
    clockIn,
    clockOut,
    getTimeEntries,
    createTimeEntry,
} from "@/lib/personnel/personnel.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const { searchParams } = new URL(req.url);
            const targetUserId = searchParams.get("userId") || ctx.userId;
            const startDate = searchParams.get("startDate");
            const endDate = searchParams.get("endDate");

            if (!startDate || !endDate) {
                throw new ValidationError("startDate et endDate sont requis");
            }

            const entries = await getTimeEntries(
                targetUserId,
                new Date(startDate),
                new Date(endDate)
            );

            return NextResponse.json({ entries });
        },
        {
            context: { resourceName: "Personnel", operation: "getTimeEntries" },
        }
    );
}

export async function POST(req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await req.json();
            const { action } = body;

            if (action === "clock-in") {
                const entry = await clockIn(ctx.userId, undefined, body.notes);
                return NextResponse.json({ entry });
            }

            if (action === "clock-out") {
                const entry = await clockOut(
                    ctx.userId,
                    body.breakDuration || 0
                );
                return NextResponse.json({ entry });
            }

            if (action === "manual-entry") {
                // Création manuelle d'une entrée (pour corrections)
                if (!body.date || !body.clockIn || !body.clockOut) {
                    throw new ValidationError("date, clockIn et clockOut sont requis");
                }

                const entry = await createTimeEntry(body.userId || ctx.userId, {
                    date: new Date(body.date),
                    clockIn: new Date(body.clockIn),
                    clockOut: new Date(body.clockOut),
                    breakDuration: body.breakDuration,
                    notes: body.notes,
                    type: body.type,
                });

                return NextResponse.json({ entry });
            }

            throw new ValidationError("Action invalide. Utilisez 'clock-in', 'clock-out' ou 'manual-entry'");
        },
        {
            context: { resourceName: "Personnel", operation: "timeTracking" },
        }
    );
}
