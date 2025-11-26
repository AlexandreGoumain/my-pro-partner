import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/equipements-clients/stats - Get equipment statistics
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const entrepriseId = session.user.entrepriseId;
        const now = new Date();
        const dans30Jours = new Date();
        dans30Jours.setDate(dans30Jours.getDate() + 30);

        const [
            total,
            enService,
            enPanne,
            aRemplacer,
            controlesAVenir,
            controlesEnRetard,
            certificatsExpires,
        ] = await Promise.all([
            // Total équipements
            prisma.equipementClient.count({
                where: { entrepriseId },
            }),
            // En service
            prisma.equipementClient.count({
                where: { entrepriseId, statut: "EN_SERVICE" },
            }),
            // En panne
            prisma.equipementClient.count({
                where: { entrepriseId, statut: "EN_PANNE" },
            }),
            // À remplacer
            prisma.equipementClient.count({
                where: { entrepriseId, statut: "A_REMPLACER" },
            }),
            // Contrôles à venir (dans les 30 prochains jours)
            prisma.equipementClient.count({
                where: {
                    entrepriseId,
                    controleObligatoire: true,
                    prochainControleAnnuel: {
                        gte: now,
                        lte: dans30Jours,
                    },
                },
            }),
            // Contrôles en retard
            prisma.equipementClient.count({
                where: {
                    entrepriseId,
                    controleObligatoire: true,
                    prochainControleAnnuel: {
                        lt: now,
                    },
                },
            }),
            // Certificats expirés
            prisma.equipementClient.count({
                where: {
                    entrepriseId,
                    controleObligatoire: true,
                    certificatValide: false,
                },
            }),
        ]);

        return NextResponse.json({
            total,
            enService,
            enPanne,
            aRemplacer,
            controlesAVenir,
            controlesEnRetard,
            certificatsExpires,
        });
    } catch (error) {
        console.error("Error fetching equipement stats:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des statistiques" },
            { status: 500 }
        );
    }
}
