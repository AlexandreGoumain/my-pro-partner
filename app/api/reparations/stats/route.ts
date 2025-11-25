import { withErrorHandling } from "@/lib/errors";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { requireTenantAuth } from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET: Get repair statistics
export async function GET(_req: NextRequest) {
    return withErrorHandling(
        async () => {
            const capabilityCheck = await requireCapability("atelier");
            if (capabilityCheck) return capabilityCheck;

            const { entrepriseId } = await requireTenantAuth();

            // Get all repairs for the company
            const reparations = await prisma.reparation.findMany({
                where: { entrepriseId },
                select: {
                    id: true,
                    statut: true,
                    priorite: true,
                    dateDepot: true,
                    dateEstimeeRetour: true,
                    dateRetourReel: true,
                    coutTotal: true,
                    technicienId: true,
                    lignesPieces: {
                        select: {
                            montant: true,
                        },
                    },
                    interventions: {
                        select: {
                            dureeMinutes: true,
                        },
                    },
                },
            });

            // Calculate statistics
            const totalReparations = reparations.length;

            // By status
            const byStatus = reparations.reduce(
                (acc, r) => {
                    acc[r.statut] = (acc[r.statut] || 0) + 1;
                    return acc;
                },
                {} as Record<string, number>
            );

            // By priority
            const byPriority = reparations.reduce(
                (acc, r) => {
                    acc[r.priorite] = (acc[r.priorite] || 0) + 1;
                    return acc;
                },
                {} as Record<string, number>
            );

            // In progress
            const enCours = reparations.filter((r) =>
                [
                    "DEPOSE",
                    "DIAGNOSTIC",
                    "DEVIS_ENVOYE",
                    "ATTENTE_PIECES",
                    "EN_COURS",
                ].includes(r.statut)
            ).length;

            // Ready for pickup
            const pretes = reparations.filter(
                (r) => r.statut === "PRETE"
            ).length;

            // Delivered this month
            const thisMonth = new Date();
            thisMonth.setDate(1);
            thisMonth.setHours(0, 0, 0, 0);

            const livreesCeMois = reparations.filter(
                (r) =>
                    r.statut === "LIVREE" &&
                    r.dateRetourReel &&
                    new Date(r.dateRetourReel) >= thisMonth
            ).length;

            // Total revenue from repairs
            const totalRevenue = reparations.reduce(
                (sum, r) => sum + Number(r.coutTotal),
                0
            );

            // Revenue this month
            const revenueCeMois = reparations
                .filter(
                    (r) =>
                        r.statut === "LIVREE" &&
                        r.dateRetourReel &&
                        new Date(r.dateRetourReel) >= thisMonth
                )
                .reduce((sum, r) => sum + Number(r.coutTotal), 0);

            // Average repair cost
            const moyenneCout =
                totalReparations > 0 ? totalRevenue / totalReparations : 0;

            // Average repair time (in days)
            const reparationsTerminees = reparations.filter(
                (r) => r.dateRetourReel && r.statut === "LIVREE"
            );

            const totalDays = reparationsTerminees.reduce((sum, r) => {
                const depot = new Date(r.dateDepot);
                const retour = new Date(r.dateRetourReel!);
                const diffTime = Math.abs(retour.getTime() - depot.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return sum + diffDays;
            }, 0);

            const moyenneDelai =
                reparationsTerminees.length > 0
                    ? totalDays / reparationsTerminees.length
                    : 0;

            // Delayed repairs
            const now = new Date();
            const enRetard = reparations.filter(
                (r) =>
                    r.dateEstimeeRetour &&
                    new Date(r.dateEstimeeRetour) < now &&
                    !["LIVREE", "ANNULEE", "ABANDONNEE"].includes(r.statut)
            ).length;

            // Urgent repairs
            const urgentes = reparations.filter(
                (r) =>
                    r.priorite === "URGENTE" &&
                    !["LIVREE", "ANNULEE", "ABANDONNEE"].includes(r.statut)
            ).length;

            const critiques = reparations.filter(
                (r) =>
                    r.priorite === "CRITIQUE" &&
                    !["LIVREE", "ANNULEE", "ABANDONNEE"].includes(r.statut)
            ).length;

            // By technician
            const byTechnicien = reparations.reduce(
                (acc, r) => {
                    if (r.technicienId) {
                        acc[r.technicienId] = (acc[r.technicienId] || 0) + 1;
                    }
                    return acc;
                },
                {} as Record<string, number>
            );

            // Total technician time (in hours)
            const totalHeuresTechnicien =
                reparations.reduce((sum, r) => {
                    const heuresReparation = r.interventions.reduce(
                        (sumInt, int) => sumInt + (int.dureeMinutes || 0),
                        0
                    );
                    return sum + heuresReparation;
                }, 0) / 60; // Convert to hours

            // Parts revenue
            const revenuePieces = reparations.reduce((sum, r) => {
                const totalPieces = r.lignesPieces.reduce(
                    (sumP, p) => sumP + Number(p.montant),
                    0
                );
                return sum + totalPieces;
            }, 0);

            return NextResponse.json({
                totalReparations,
                enCours,
                pretes,
                livreesCeMois,
                enRetard,
                urgentes,
                critiques,
                totalRevenue,
                revenueCeMois,
                revenuePieces,
                moyenneCout,
                moyenneDelai,
                totalHeuresTechnicien,
                byStatus,
                byPriority,
                byTechnicien,
            });
        },
        { resourceName: "ReparationStats", operation: "read" }
    );
}
