import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/fitness/stats
 * Get fitness statistics
 */
export async function GET() {
    return withApiHandler(
        async (ctx) => {
            const now = new Date();
            const startOfDay = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );
            const startOfWeek = new Date(startOfDay);
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 7);

            // Execute all queries in parallel
            const [
                // Subscriptions
                totalAbonnements,
                abonnementsActifs,
                abonnementsSuspendus,
                abonnementsExpires,
                nouveauxMembresMois,

                // Classes
                totalCours,
                coursActifs,
                seancesSemaine,

                // Attendance
                presencesJour,
                presencesSemaine,
                presencesMois,

                // Revenue
                revenusData,
            ] = await Promise.all([
                // Subscriptions
                prisma.abonnementFitness.count({
                    where: { entrepriseId: ctx.entrepriseId },
                }),
                prisma.abonnementFitness.count({
                    where: { entrepriseId: ctx.entrepriseId, statut: "ACTIF" },
                }),
                prisma.abonnementFitness.count({
                    where: { entrepriseId: ctx.entrepriseId, statut: "SUSPENDU" },
                }),
                prisma.abonnementFitness.count({
                    where: { entrepriseId: ctx.entrepriseId, statut: "EXPIRE" },
                }),
                prisma.abonnementFitness.count({
                    where: {
                        entrepriseId: ctx.entrepriseId,
                        createdAt: { gte: startOfMonth },
                    },
                }),

                // Classes
                prisma.coursCollectif.count({
                    where: { entrepriseId: ctx.entrepriseId },
                }),
                prisma.coursCollectif.count({
                    where: { entrepriseId: ctx.entrepriseId, actif: true },
                }),
                prisma.seanceCours.count({
                    where: {
                        entrepriseId: ctx.entrepriseId,
                        dateHeure: { gte: startOfWeek, lt: endOfWeek },
                        statut: { not: "ANNULEE" },
                    },
                }),

                // Attendance
                prisma.presenceFitness.count({
                    where: {
                        entrepriseId: ctx.entrepriseId,
                        heureEntree: { gte: startOfDay },
                    },
                }),
                prisma.presenceFitness.count({
                    where: {
                        entrepriseId: ctx.entrepriseId,
                        heureEntree: { gte: startOfWeek },
                    },
                }),
                prisma.presenceFitness.count({
                    where: {
                        entrepriseId: ctx.entrepriseId,
                        heureEntree: { gte: startOfMonth },
                    },
                }),

                // Revenue
                prisma.abonnementFitness.aggregate({
                    where: {
                        entrepriseId: ctx.entrepriseId,
                        statut: "ACTIF",
                    },
                    _sum: { montantPaye: true },
                }),
            ]);

            // Calculate total revenue
            const revenusTotal = Number(revenusData._sum.montantPaye || 0);

            // Calculate class fill rate for the week
            const seancesAvecReservations = await prisma.seanceCours.findMany({
                where: {
                    entrepriseId: ctx.entrepriseId,
                    dateHeure: { gte: startOfWeek, lt: endOfWeek },
                    statut: { not: "ANNULEE" },
                },
                include: {
                    cours: { select: { capaciteMax: true } },
                    _count: { select: { reservations: true } },
                },
            });

            let totalPlaces = 0;
            let totalReservations = 0;
            seancesAvecReservations.forEach((seance) => {
                const capacite = seance.capaciteMax || seance.cours.capaciteMax;
                totalPlaces += capacite;
                totalReservations += seance._count.reservations;
            });

            const tauxRemplissageCours =
                totalPlaces > 0
                    ? Math.round((totalReservations / totalPlaces) * 100)
                    : 0;

            // Average attendance per day (for the month)
            const joursEcoules = now.getDate();
            const moyennePresencesJour =
                joursEcoules > 0 ? Math.round(presencesMois / joursEcoules) : 0;

            return NextResponse.json({
                // Subscriptions
                totalAbonnements,
                abonnementsActifs,
                abonnementsSuspendus,
                abonnementsExpires,

                // Members
                membresActifs: abonnementsActifs,
                nouveauxMembresMois,

                // Revenue
                revenusMensuels: revenusTotal,
                revenusAnnuels: revenusTotal * 12,

                // Classes
                totalCours,
                coursActifs,
                seancesSemaine,

                // Attendance
                presencesJour,
                presencesSemaine,
                presencesMois,
                moyennePresencesJour,

                // Rates
                tauxRemplissageCours,
                tauxRetention:
                    abonnementsActifs > 0
                        ? Math.round((abonnementsActifs / totalAbonnements) * 100)
                        : 0,
            });
        },
        {
            capability: "abonnements_fitness",
            context: { resourceName: "FitnessStats", operation: "get" },
        }
    );
}
