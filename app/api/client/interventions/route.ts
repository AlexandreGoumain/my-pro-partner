import { NextRequest, NextResponse } from "next/server";
import { requireClientAuth, handleClientAuthError } from "@/lib/middleware/client-auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/client/interventions
 * List all interventions for the authenticated client
 */
export async function GET(req: NextRequest) {
    try {
        const { client, entrepriseId } = await requireClientAuth(req);

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const active = searchParams.get("active") === "true";

        // Build where clause
        const where: Record<string, unknown> = {
            clientId: client.id,
            entrepriseId,
        };

        // Filter by status if provided
        if (status) {
            where.statut = status;
        }

        // Filter for active interventions (not completed/cancelled)
        if (active) {
            where.statut = {
                notIn: ["TERMINEE", "ANNULEE", "FACTUREE"],
            };
        }

        const interventions = await prisma.intervention.findMany({
            where,
            select: {
                id: true,
                numero: true,
                typeIntervention: true,
                priorite: true,
                statut: true,
                description: true,
                adresse: true,
                codePostal: true,
                ville: true,
                equipement: true,
                dateDemande: true,
                datePrevisionnelle: true,
                dateDebut: true,
                dateFin: true,
                dureeEstimeeH: true,
                devisEstime: true,
                coutTotal: true,
                diagnosticEffectue: true,
                plombier: {
                    select: {
                        id: true,
                        name: true,
                        photoUrl: true,
                    },
                },
                document: {
                    select: {
                        id: true,
                        numero: true,
                        type: true,
                        statut: true,
                        total_ttc: true,
                    },
                },
            },
            orderBy: [
                { dateDemande: "desc" },
            ],
        });

        // Transform data to match frontend expected format
        const transformedInterventions = interventions.map((intervention) => ({
            ...intervention,
            plombier: intervention.plombier
                ? {
                    id: intervention.plombier.id,
                    name: intervention.plombier.name,
                    image: intervention.plombier.photoUrl,
                }
                : null,
            document: intervention.document
                ? {
                    id: intervention.document.id,
                    numero: intervention.document.numero,
                    type: intervention.document.type,
                    statut: intervention.document.statut,
                    totalTTC: intervention.document.total_ttc,
                }
                : null,
        }));

        return NextResponse.json({ interventions: transformedInterventions });
    } catch (error) {
        return handleClientAuthError(error);
    }
}
