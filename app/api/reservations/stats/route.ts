import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/reservations/stats
 * Get reservations statistics
 */
export async function GET() {
    return withApiHandler(
        async (ctx) => {
            // Calculate date ranges
            const now = new Date();
            const todayStart = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );
            const todayEnd = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                23,
                59,
                59,
                999
            );

            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
            weekStart.setHours(0, 0, 0, 0);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            weekEnd.setHours(23, 59, 59, 999);

            // Get all reservations for the entreprise
            const allReservations = await prisma.reservation.findMany({
                where: { entrepriseId: ctx.entrepriseId },
                select: {
                    statut: true,
                    personnes: true,
                    date: true,
                },
            });

            // Calculate global stats
            const total = allReservations.length;
            const enAttente = allReservations.filter(
                (r) => r.statut === "EN_ATTENTE"
            ).length;
            const confirmees = allReservations.filter(
                (r) => r.statut === "CONFIRMEE"
            ).length;
            const arrivees = allReservations.filter(
                (r) => r.statut === "ARRIVEE"
            ).length;
            const terminees = allReservations.filter(
                (r) => r.statut === "TERMINEE"
            ).length;
            const annulees = allReservations.filter(
                (r) => r.statut === "ANNULEE"
            ).length;
            const noShow = allReservations.filter(
                (r) => r.statut === "NO_SHOW"
            ).length;
            const couvertsTotal = allReservations.reduce(
                (sum, r) => sum + r.personnes,
                0
            );

            // Calculate today's stats
            const todayReservations = allReservations.filter((r) => {
                const reservationDate = new Date(r.date);
                return reservationDate >= todayStart && reservationDate <= todayEnd;
            });

            const aujourdhuiTotal = todayReservations.length;
            const aujourdhuiEnAttente = todayReservations.filter(
                (r) => r.statut === "EN_ATTENTE"
            ).length;
            const aujourdhuiConfirmees = todayReservations.filter(
                (r) => r.statut === "CONFIRMEE"
            ).length;
            const aujourdhuiCouverts = todayReservations.reduce(
                (sum, r) => sum + r.personnes,
                0
            );

            // Calculate week's stats
            const weekReservations = allReservations.filter((r) => {
                const reservationDate = new Date(r.date);
                return reservationDate >= weekStart && reservationDate <= weekEnd;
            });

            const semaineTotal = weekReservations.length;
            const semaineCouverts = weekReservations.reduce(
                (sum, r) => sum + r.personnes,
                0
            );

            return NextResponse.json({
                stats: {
                    total,
                    enAttente,
                    confirmees,
                    arrivees,
                    terminees,
                    annulees,
                    noShow,
                    couvertsTotal,
                    aujourdhui: {
                        total: aujourdhuiTotal,
                        enAttente: aujourdhuiEnAttente,
                        confirmees: aujourdhuiConfirmees,
                        couverts: aujourdhuiCouverts,
                    },
                    semaine: {
                        total: semaineTotal,
                        couverts: semaineCouverts,
                    },
                },
            });
        },
        {
            capability: "agenda",
            context: { resourceName: "ReservationStats", operation: "get" },
        }
    );
}
