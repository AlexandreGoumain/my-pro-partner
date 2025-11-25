import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("contrats");
        if (capabilityCheck) return capabilityCheck;

        const entrepriseId = session.user.entrepriseId;

        // Total contrats
        const total = await prisma.contratEntretien.count({
            where: { entrepriseId },
        });

        // Contrats actifs
        const actifs = await prisma.contratEntretien.count({
            where: {
                entrepriseId,
                statut: "ACTIF",
            },
        });

        // Révisions à planifier ce mois
        const now = new Date();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const revisionsDuMois = await prisma.contratEntretien.count({
            where: {
                entrepriseId,
                statut: "ACTIF",
                prochaineRevision: {
                    gte: now,
                    lte: endOfMonth,
                },
            },
        });

        // Revenus récurrents mensuels (MRR)
        const contratsActifs = await prisma.contratEntretien.findMany({
            where: {
                entrepriseId,
                statut: "ACTIF",
            },
            select: {
                montantTTC: true,
                periodicite: true,
            },
        });

        const revenusRecurrents = contratsActifs.reduce((sum, contrat) => {
            let montantMensuel = Number(contrat.montantTTC);

            // Convert to monthly amount based on periodicite
            switch (contrat.periodicite) {
                case "ANNUEL":
                    montantMensuel = montantMensuel / 12;
                    break;
                case "SEMESTRIEL":
                    montantMensuel = montantMensuel / 6;
                    break;
                case "TRIMESTRIEL":
                    montantMensuel = montantMensuel / 3;
                    break;
                case "MENSUEL":
                    // Already monthly
                    break;
            }

            return sum + montantMensuel;
        }, 0);

        return NextResponse.json({
            total,
            actifs,
            revisionsDuMois,
            revenusRecurrents,
        });
    } catch (error) {
        console.error("Error fetching contrat stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}
