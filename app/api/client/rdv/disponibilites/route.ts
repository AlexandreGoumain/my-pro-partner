import { NextRequest, NextResponse } from "next/server";
import { requireClientAuth, handleClientAuthError } from "@/lib/middleware/client-auth";
import { prisma } from "@/lib/prisma";

interface TimeSlot {
    heure: string;
    disponible: boolean;
    employeId?: string;
    employeNom?: string;
}

/**
 * GET /api/client/rdv/disponibilites
 * Get available time slots for a given date and prestation
 *
 * Query params:
 * - date: ISO date string (required)
 * - prestationId: ID of the prestation (required, to know duration)
 * - employeId: ID of specific employee (optional, if not provided returns all available employees)
 */
export async function GET(req: NextRequest) {
    try {
        const { entrepriseId } = await requireClientAuth(req);

        const { searchParams } = new URL(req.url);
        const dateStr = searchParams.get("date");
        const prestationId = searchParams.get("prestationId");
        const employeId = searchParams.get("employeId");

        // Validate required params
        if (!dateStr) {
            return NextResponse.json(
                { error: "Date requise" },
                { status: 400 }
            );
        }

        if (!prestationId) {
            return NextResponse.json(
                { error: "Prestation requise" },
                { status: 400 }
            );
        }

        // Parse date
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            return NextResponse.json(
                { error: "Date invalide" },
                { status: 400 }
            );
        }

        // Get day of week (0=Sunday, 1=Monday, etc.)
        const dayOfWeek = date.getDay();

        // Get prestation to know duration
        const prestation = await prisma.prestation.findFirst({
            where: {
                id: prestationId,
                entrepriseId,
                actif: true,
            },
        });

        if (!prestation) {
            return NextResponse.json(
                { error: "Prestation non trouvée" },
                { status: 404 }
            );
        }

        const duration = prestation.duree; // in minutes

        // Get employees with their availabilities for this day
        const employeWhere: Record<string, unknown> = {
            entrepriseId,
            actif: true,
        };

        if (employeId) {
            employeWhere.id = employeId;
        }

        const employes = await prisma.employe.findMany({
            where: employeWhere,
            include: {
                disponibilites: {
                    where: {
                        jourSemaine: dayOfWeek,
                    },
                },
            },
        });

        if (employes.length === 0) {
            return NextResponse.json({
                slots: [],
                message: "Aucun praticien disponible ce jour",
            });
        }

        // Get existing appointments for this date
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const existingRdv = await prisma.rendezVous.findMany({
            where: {
                entrepriseId,
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                statut: {
                    notIn: ["ANNULE", "NO_SHOW"],
                },
            },
            select: {
                heure: true,
                duree: true,
                employeId: true,
            },
        });

        // Calculate available slots for each employee
        const allSlots: TimeSlot[] = [];

        for (const employe of employes) {
            // Get working hours for this day
            const disponibilites = employe.disponibilites.filter((d) => !d.pause);
            const pauses = employe.disponibilites.filter((d) => d.pause);

            for (const dispo of disponibilites) {
                const slots = generateTimeSlots(
                    dispo.heureDebut,
                    dispo.heureFin,
                    duration,
                    pauses,
                    existingRdv.filter((rdv) => rdv.employeId === employe.id),
                    date
                );

                for (const slot of slots) {
                    allSlots.push({
                        heure: slot,
                        disponible: true,
                        employeId: employe.id,
                        employeNom: `${employe.prenom} ${employe.nom}`,
                    });
                }
            }
        }

        // Sort by time
        allSlots.sort((a, b) => a.heure.localeCompare(b.heure));

        // If looking for any employee, group slots by time and show available employees
        const groupedSlots: Record<string, TimeSlot[]> = {};
        for (const slot of allSlots) {
            if (!groupedSlots[slot.heure]) {
                groupedSlots[slot.heure] = [];
            }
            groupedSlots[slot.heure].push(slot);
        }

        // Format response
        const response = Object.entries(groupedSlots).map(([heure, slots]) => ({
            heure,
            disponible: slots.length > 0,
            employes: slots.map((s) => ({
                id: s.employeId,
                nom: s.employeNom,
            })),
        }));

        return NextResponse.json({
            date: dateStr,
            prestation: {
                id: prestation.id,
                nom: prestation.nom,
                duree: prestation.duree,
            },
            slots: response,
        });
    } catch (error) {
        console.error("Error getting disponibilites:", error);
        return handleClientAuthError(error);
    }
}

/**
 * Generate available time slots given working hours and existing appointments
 */
function generateTimeSlots(
    startTime: string,
    endTime: string,
    durationMinutes: number,
    pauses: { heureDebut: string; heureFin: string }[],
    existingRdv: { heure: string; duree: number }[],
    date: Date
): string[] {
    const slots: string[] = [];
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    // Parse start and end times
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    // Calculate start and end in minutes from midnight
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    // Generate slots every 15 minutes (or based on duration)
    const slotInterval = Math.min(15, durationMinutes);

    for (let time = startMinutes; time + durationMinutes <= endMinutes; time += slotInterval) {
        const slotHour = Math.floor(time / 60);
        const slotMin = time % 60;
        const slotTime = `${slotHour.toString().padStart(2, "0")}:${slotMin.toString().padStart(2, "0")}`;

        // Skip if in the past (for today)
        if (isToday) {
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            // Add 30 min buffer for same-day bookings
            if (time < currentMinutes + 30) {
                continue;
            }
        }

        // Check if slot overlaps with a pause
        const slotEnd = time + durationMinutes;
        const overlapsWithPause = pauses.some((pause) => {
            const [pauseStartH, pauseStartM] = pause.heureDebut.split(":").map(Number);
            const [pauseEndH, pauseEndM] = pause.heureFin.split(":").map(Number);
            const pauseStart = pauseStartH * 60 + pauseStartM;
            const pauseEnd = pauseEndH * 60 + pauseEndM;

            // Check overlap: (slot starts before pause ends) AND (slot ends after pause starts)
            return time < pauseEnd && slotEnd > pauseStart;
        });

        if (overlapsWithPause) {
            continue;
        }

        // Check if slot overlaps with existing appointment
        const overlapsWithRdv = existingRdv.some((rdv) => {
            const [rdvHour, rdvMin] = rdv.heure.split(":").map(Number);
            const rdvStart = rdvHour * 60 + rdvMin;
            const rdvEnd = rdvStart + rdv.duree;

            // Check overlap
            return time < rdvEnd && slotEnd > rdvStart;
        });

        if (overlapsWithRdv) {
            continue;
        }

        slots.push(slotTime);
    }

    return slots;
}
