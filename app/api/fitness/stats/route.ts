import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// GET /api/fitness/stats - Statistiques du fitness
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("abonnements_fitness");
        if (capabilityCheck) return capabilityCheck;

        const entrepriseId = session.user.entrepriseId;
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

        // Exécuter toutes les requêtes en parallèle
        const [
            // Abonnements
            totalAbonnements,
            abonnementsActifs,
            abonnementsSuspendus,
            abonnementsExpires,
            nouveauxMembresMois,

            // Cours
            totalCours,
            coursActifs,
            seancesSemaine,

            // Présences
            presencesJour,
            presencesSemaine,
            presencesMois,

            // Revenus (somme des montants payés des abonnements actifs)
            revenusData,
        ] = await Promise.all([
            // Abonnements
            prisma.abonnementFitness.count({ where: { entrepriseId } }),
            prisma.abonnementFitness.count({
                where: { entrepriseId, statut: "ACTIF" },
            }),
            prisma.abonnementFitness.count({
                where: { entrepriseId, statut: "SUSPENDU" },
            }),
            prisma.abonnementFitness.count({
                where: { entrepriseId, statut: "EXPIRE" },
            }),
            prisma.abonnementFitness.count({
                where: {
                    entrepriseId,
                    createdAt: { gte: startOfMonth },
                },
            }),

            // Cours
            prisma.coursCollectif.count({ where: { entrepriseId } }),
            prisma.coursCollectif.count({
                where: { entrepriseId, actif: true },
            }),
            prisma.seanceCours.count({
                where: {
                    entrepriseId,
                    dateHeure: { gte: startOfWeek, lt: endOfWeek },
                    statut: { not: "ANNULEE" },
                },
            }),

            // Présences
            prisma.presenceFitness.count({
                where: {
                    entrepriseId,
                    heureEntree: { gte: startOfDay },
                },
            }),
            prisma.presenceFitness.count({
                where: {
                    entrepriseId,
                    heureEntree: { gte: startOfWeek },
                },
            }),
            prisma.presenceFitness.count({
                where: {
                    entrepriseId,
                    heureEntree: { gte: startOfMonth },
                },
            }),

            // Revenus
            prisma.abonnementFitness.aggregate({
                where: {
                    entrepriseId,
                    statut: "ACTIF",
                },
                _sum: { montantPaye: true },
            }),
        ]);

        // Calculer les revenus mensuels moyens
        const revenusTotal = Number(revenusData._sum.montantPaye || 0);

        // Calculer le taux de remplissage des cours de la semaine
        const seancesAvecReservations = await prisma.seanceCours.findMany({
            where: {
                entrepriseId,
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

        // Moyenne présences par jour (sur le mois)
        const joursEcoules = now.getDate();
        const moyennePresencesJour =
            joursEcoules > 0 ? Math.round(presencesMois / joursEcoules) : 0;

        return NextResponse.json({
            // Abonnements
            totalAbonnements,
            abonnementsActifs,
            abonnementsSuspendus,
            abonnementsExpires,

            // Membres
            membresActifs: abonnementsActifs,
            nouveauxMembresMois,

            // Revenus
            revenusMensuels: revenusTotal,
            revenusAnnuels: revenusTotal * 12,

            // Cours
            totalCours,
            coursActifs,
            seancesSemaine,

            // Présences
            presencesJour,
            presencesSemaine,
            presencesMois,
            moyennePresencesJour,

            // Taux
            tauxRemplissageCours,
            tauxRetention:
                abonnementsActifs > 0
                    ? Math.round((abonnementsActifs / totalAbonnements) * 100)
                    : 0,
        });
    } catch (error) {
        console.error("Erreur GET fitness stats:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
