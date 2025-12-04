import { NextRequest, NextResponse } from "next/server";
import { requireClientAuth, handleClientAuthError } from "@/lib/middleware/client-auth";
import { prisma } from "@/lib/prisma";
import { CapabilityService } from "@/lib/services/capability.service";

/**
 * GET /api/client/dashboard/stats
 * Get dashboard statistics for the authenticated client (capability-aware)
 */
export async function GET(req: NextRequest) {
    try {
        const { client, entrepriseId } = await requireClientAuth(req);

        // Get business capabilities
        const businessType = client.entreprise.businessType;
        const capabilities = CapabilityService.getCapabilitiesForType(businessType);

        // Base stats
        const documentsCount = await prisma.document.count({
            where: {
                clientId: client.id,
            },
        });

        // Get points expiring soon (next 30 days)
        const now = new Date();
        const in30Days = new Date();
        in30Days.setDate(in30Days.getDate() + 30);

        const pointsExpiringSoon = await prisma.mouvementPoints.aggregate({
            where: {
                clientId: client.id,
                type: "GAIN",
                dateExpiration: {
                    gte: now,
                    lte: in30Days,
                },
            },
            _sum: {
                points: true,
            },
        });

        // Capability-based stats
        let upcomingRdv: unknown[] = [];
        let activeInterventions: unknown[] = [];

        // Fetch upcoming RDV if business has agenda capability
        if (capabilities.includes("agenda")) {
            upcomingRdv = await prisma.rendezVous.findMany({
                where: {
                    clientId: client.id,
                    entrepriseId,
                    date: { gte: now },
                    statut: { notIn: ["ANNULE", "NO_SHOW", "TERMINE"] },
                },
                select: {
                    id: true,
                    date: true,
                    heure: true,
                    statut: true,
                    prestation: {
                        select: {
                            nom: true,
                            duree: true,
                        },
                    },
                    employe: {
                        select: {
                            prenom: true,
                            nom: true,
                        },
                    },
                },
                orderBy: [{ date: "asc" }, { heure: "asc" }],
                take: 3,
            });
        }

        // Fetch active interventions if business has intervention capabilities
        if (capabilities.includes("domicile") || capabilities.includes("atelier")) {
            activeInterventions = await prisma.intervention.findMany({
                where: {
                    clientId: client.id,
                    entrepriseId,
                    statut: { notIn: ["TERMINEE", "FACTUREE", "ANNULEE"] },
                },
                select: {
                    id: true,
                    numero: true,
                    typeIntervention: true,
                    statut: true,
                    priorite: true,
                    datePrevisionnelle: true,
                    plombier: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: { dateDemande: "desc" },
                take: 3,
            });
        }

        return NextResponse.json({
            client: {
                nom: client.nom,
                prenom: client.prenom,
                points_solde: client.points_solde,
                niveauFidelite: client.niveauFidelite,
            },
            documentsCount,
            pointsExpiringSoon: pointsExpiringSoon._sum.points || 0,
            // Capability-based data
            capabilities,
            upcomingRdv,
            activeInterventions,
        });
    } catch (error) {
        return handleClientAuthError(error);
    }
}
