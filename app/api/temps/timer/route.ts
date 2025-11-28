import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/temps/timer - Get active timer for current user
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId || !session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("temps_passe");
        if (capabilityCheck) return capabilityCheck;

        // Find active timer (entry with timerStart but no timerEnd)
        const activeTimer = await prisma.entreeTemps.findFirst({
            where: {
                entrepriseId: session.user.entrepriseId,
                userId: session.user.id,
                timerStart: { not: null },
                timerEnd: null,
            },
            include: {
                mission: {
                    select: {
                        id: true,
                        numero: true,
                        nom: true,
                        client: {
                            select: {
                                id: true,
                                nom: true,
                            },
                        },
                    },
                },
            },
        });

        if (!activeTimer) {
            return NextResponse.json({ timer: null });
        }

        // Convert Decimal fields
        const formattedTimer = {
            ...activeTimer,
            tauxHoraire: Number(activeTimer.tauxHoraire),
            montant: Number(activeTimer.montant),
        };

        return NextResponse.json({ timer: formattedTimer });
    } catch (error) {
        console.error("Error fetching timer:", error);
        return NextResponse.json(
            { error: "Failed to fetch timer" },
            { status: 500 }
        );
    }
}

// POST /api/temps/timer - Start or stop timer
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId || !session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("temps_passe");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();
        const { action, missionId, description, entreeTempsId } = body;

        if (action === "start") {
            // Validate missionId
            if (!missionId) {
                return NextResponse.json(
                    { error: "La mission est requise pour démarrer le timer" },
                    { status: 400 }
                );
            }

            // Check no active timer
            const existingTimer = await prisma.entreeTemps.findFirst({
                where: {
                    entrepriseId: session.user.entrepriseId,
                    userId: session.user.id,
                    timerStart: { not: null },
                    timerEnd: null,
                },
            });

            if (existingTimer) {
                return NextResponse.json(
                    { error: "Un timer est déjà actif. Arrêtez-le d'abord." },
                    { status: 400 }
                );
            }

            // Verify mission exists
            const mission = await prisma.mission.findFirst({
                where: {
                    id: missionId,
                    entrepriseId: session.user.entrepriseId,
                },
            });

            if (!mission) {
                return NextResponse.json(
                    { error: "Mission introuvable" },
                    { status: 404 }
                );
            }

            // Get taux horaire
            const tauxHoraire = mission.tauxHoraire
                ? Number(mission.tauxHoraire)
                : 80;

            // Create entry with timer
            const entree = await prisma.entreeTemps.create({
                data: {
                    missionId,
                    userId: session.user.id,
                    entrepriseId: session.user.entrepriseId,
                    date: new Date(),
                    duree: 0, // Will be calculated when stopped
                    description: description || "En cours...",
                    facturable: true,
                    tauxHoraire,
                    montant: 0, // Will be calculated when stopped
                    timerStart: new Date(),
                },
                include: {
                    mission: {
                        select: {
                            id: true,
                            numero: true,
                            nom: true,
                            client: {
                                select: {
                                    id: true,
                                    nom: true,
                                },
                            },
                        },
                    },
                },
            });

            const formattedEntree = {
                ...entree,
                tauxHoraire: Number(entree.tauxHoraire),
                montant: Number(entree.montant),
            };

            return NextResponse.json(
                { timer: formattedEntree },
                { status: 201 }
            );
        } else if (action === "stop") {
            // Find the active timer
            let timer;

            if (entreeTempsId) {
                timer = await prisma.entreeTemps.findFirst({
                    where: {
                        id: entreeTempsId,
                        entrepriseId: session.user.entrepriseId,
                        userId: session.user.id,
                        timerStart: { not: null },
                        timerEnd: null,
                    },
                });
            } else {
                timer = await prisma.entreeTemps.findFirst({
                    where: {
                        entrepriseId: session.user.entrepriseId,
                        userId: session.user.id,
                        timerStart: { not: null },
                        timerEnd: null,
                    },
                });
            }

            if (!timer) {
                return NextResponse.json(
                    { error: "Aucun timer actif trouvé" },
                    { status: 404 }
                );
            }

            // Calculate duration
            const timerEnd = new Date();
            const timerStart = new Date(timer.timerStart!);
            const durationMs = timerEnd.getTime() - timerStart.getTime();
            const duree = Math.ceil(durationMs / 60000); // Convert to minutes, round up

            // Calculate montant
            const tauxHoraire = Number(timer.tauxHoraire);
            const montant = (duree / 60) * tauxHoraire;

            // Update the entry
            const entree = await prisma.entreeTemps.update({
                where: { id: timer.id },
                data: {
                    timerEnd,
                    duree,
                    montant,
                    ...(description && { description: description.trim() }),
                },
                include: {
                    mission: {
                        select: {
                            id: true,
                            numero: true,
                            nom: true,
                            client: {
                                select: {
                                    id: true,
                                    nom: true,
                                },
                            },
                        },
                    },
                },
            });

            // Update mission totals
            await updateMissionTotals(entree.missionId);

            const formattedEntree = {
                ...entree,
                tauxHoraire: Number(entree.tauxHoraire),
                montant: Number(entree.montant),
            };

            return NextResponse.json({ timer: formattedEntree });
        } else if (action === "cancel") {
            // Cancel/delete the active timer without saving
            const timer = await prisma.entreeTemps.findFirst({
                where: {
                    entrepriseId: session.user.entrepriseId,
                    userId: session.user.id,
                    timerStart: { not: null },
                    timerEnd: null,
                },
            });

            if (!timer) {
                return NextResponse.json(
                    { error: "Aucun timer actif trouvé" },
                    { status: 404 }
                );
            }

            await prisma.entreeTemps.delete({
                where: { id: timer.id },
            });

            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json(
                {
                    error: "Action invalide. Utilisez 'start', 'stop', ou 'cancel'",
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error with timer:", error);
        return NextResponse.json(
            { error: "Failed to process timer action" },
            { status: 500 }
        );
    }
}

// Helper to update mission totals after time entry changes
async function updateMissionTotals(missionId: string) {
    const result = await prisma.entreeTemps.aggregate({
        where: { missionId },
        _sum: {
            duree: true,
            montant: true,
        },
    });

    const facturableResult = await prisma.entreeTemps.aggregate({
        where: { missionId, facturable: true },
        _sum: {
            duree: true,
        },
    });

    await prisma.mission.update({
        where: { id: missionId },
        data: {
            totalHeures: result._sum.duree || 0,
            totalFacturable: facturableResult._sum.duree || 0,
            totalMontant: result._sum.montant || 0,
        },
    });
}
