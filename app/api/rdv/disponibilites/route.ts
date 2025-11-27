import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface TimeSlot {
    heure: string;
    disponible: boolean;
    employeId?: string;
}

/**
 * Parse time string to minutes
 */
function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

/**
 * Convert minutes to time string
 */
function minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

/**
 * GET /api/rdv/disponibilites
 * Get available time slots for a given date and employee
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("agenda");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const date = searchParams.get("date");
        const employeId = searchParams.get("employeId");
        const duree = parseInt(searchParams.get("duree") || "60", 10);
        const slotInterval = parseInt(searchParams.get("interval") || "30", 10);

        if (!date) {
            return NextResponse.json(
                { error: "La date est requise" },
                { status: 400 }
            );
        }

        const targetDate = new Date(date);
        const dayOfWeek = targetDate.getDay(); // 0 = Sunday

        // If no specific employee, get all active employees
        let employees;
        if (employeId) {
            const employee = await prisma.employe.findFirst({
                where: {
                    id: employeId,
                    entrepriseId: session.user.entrepriseId,
                    actif: true,
                },
                include: {
                    disponibilites: {
                        where: { jourSemaine: dayOfWeek, pause: false },
                    },
                },
            });
            employees = employee ? [employee] : [];
        } else {
            employees = await prisma.employe.findMany({
                where: {
                    entrepriseId: session.user.entrepriseId,
                    actif: true,
                },
                include: {
                    disponibilites: {
                        where: { jourSemaine: dayOfWeek, pause: false },
                    },
                },
            });
        }

        // Get existing appointments for the date
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        const existingRdv = await prisma.rendezVous.findMany({
            where: {
                entrepriseId: session.user.entrepriseId,
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                statut: {
                    notIn: ["ANNULE", "NO_SHOW"],
                },
                employeId: employeId || undefined,
            },
        });

        // Build available slots for each employee
        const slotsPerEmployee: Record<string, TimeSlot[]> = {};

        for (const employee of employees) {
            const slots: TimeSlot[] = [];

            for (const dispo of employee.disponibilites) {
                const startMinutes = timeToMinutes(dispo.heureDebut);
                const endMinutes = timeToMinutes(dispo.heureFin);

                // Generate slots
                for (
                    let time = startMinutes;
                    time + duree <= endMinutes;
                    time += slotInterval
                ) {
                    const timeStr = minutesToTime(time);

                    // Check if slot conflicts with existing rdv
                    const slotEnd = time + duree;
                    const hasConflict = existingRdv.some((rdv) => {
                        if (rdv.employeId !== employee.id) return false;
                        const rdvStart = timeToMinutes(rdv.heure);
                        const rdvEnd = rdvStart + rdv.duree;
                        // Check overlap
                        return time < rdvEnd && slotEnd > rdvStart;
                    });

                    slots.push({
                        heure: timeStr,
                        disponible: !hasConflict,
                        employeId: employee.id,
                    });
                }
            }

            slotsPerEmployee[employee.id] = slots;
        }

        // If specific employee requested, return flat array
        if (employeId && employees.length === 1) {
            return NextResponse.json({
                date: date,
                employeId: employeId,
                duree: duree,
                slots: slotsPerEmployee[employeId] || [],
            });
        }

        // Return all slots grouped by employee
        return NextResponse.json({
            date: date,
            duree: duree,
            employees: employees.map((emp) => ({
                id: emp.id,
                nom: emp.nom,
                prenom: emp.prenom,
                couleur: emp.couleur,
                slots: slotsPerEmployee[emp.id] || [],
            })),
        });
    } catch (error) {
        console.error("Error fetching disponibilites:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
