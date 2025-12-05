import { NextRequest, NextResponse } from "next/server";
import { requireClientAuth, handleClientAuthError, ensureClientOwnership } from "@/lib/middleware/client-auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
    params: Promise<{ id: string }>;
}

/**
 * GET /api/client/interventions/[id]
 * Get a specific intervention detail with history
 */
export async function GET(req: NextRequest, context: RouteContext) {
    try {
        const { client, entrepriseId } = await requireClientAuth(req);
        const { id } = await context.params;

        const intervention = await prisma.intervention.findFirst({
            where: {
                id,
                entrepriseId,
            },
            include: {
                plombier: {
                    select: {
                        id: true,
                        name: true,
                        photoUrl: true,
                        telephone: true,
                    },
                },
                document: {
                    select: {
                        id: true,
                        numero: true,
                        type: true,
                        statut: true,
                        total_ttc: true,
                        dateEmission: true,
                    },
                },
                historique: {
                    select: {
                        id: true,
                        action: true,
                        description: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 20, // Limit history entries
                },
                materielUtilise: {
                    select: {
                        id: true,
                        designation: true,
                        quantite: true,
                        montant: true,
                    },
                },
            },
        });

        if (!intervention) {
            return NextResponse.json(
                { error: "Intervention non trouvée" },
                { status: 404 }
            );
        }

        // Ensure client can only access their own interventions
        ensureClientOwnership(client.id, intervention.clientId);

        // Format response with relevant fields for client
        const response = {
            id: intervention.id,
            numero: intervention.numero,
            reference: intervention.reference,
            typeIntervention: intervention.typeIntervention,
            priorite: intervention.priorite,
            statut: intervention.statut,
            description: intervention.description,

            // Location
            adresse: intervention.adresse,
            complementAdresse: intervention.complementAdresse,
            codePostal: intervention.codePostal,
            ville: intervention.ville,

            // Equipment
            equipement: intervention.equipement,
            marqueEquipement: intervention.marqueEquipement,
            modeleEquipement: intervention.modeleEquipement,

            // Diagnostic
            diagnosticEffectue: intervention.diagnosticEffectue,
            diagnosticDetail: intervention.diagnosticDetail,
            diagnosticDate: intervention.diagnosticDate,
            photosAvant: intervention.photosAvant,

            // Dates
            dateDemande: intervention.dateDemande,
            datePrevisionnelle: intervention.datePrevisionnelle,
            dateDebut: intervention.dateDebut,
            dateFin: intervention.dateFin,
            dureeEstimeeH: intervention.dureeEstimeeH,
            dureeReelleH: intervention.dureeReelleH,

            // Costs (only show estimate and total, not internal costs)
            devisEstime: intervention.devisEstime,
            coutTotal: intervention.coutTotal,

            // Warranty
            garantieMois: intervention.garantieMois,
            dateFinGarantie: intervention.dateFinGarantie,

            // Work done (using notesPlombier as work description)
            travailEffectue: intervention.notesPlombier,
            photosApres: intervention.photosApres,

            // Assigned technician (map photoUrl to image for frontend)
            plombier: intervention.plombier ? {
                id: intervention.plombier.id,
                name: intervention.plombier.name,
                image: intervention.plombier.photoUrl,
                telephone: intervention.plombier.telephone,
            } : null,

            // Linked document (quote/invoice - map total_ttc to totalTTC)
            document: intervention.document ? {
                id: intervention.document.id,
                numero: intervention.document.numero,
                type: intervention.document.type,
                statut: intervention.document.statut,
                totalTTC: intervention.document.total_ttc,
                dateEmission: intervention.document.dateEmission,
            } : null,

            // History timeline
            historique: intervention.historique.map((h) => ({
                id: h.id,
                action: h.action,
                description: h.description,
                date: h.createdAt,
            })),

            // Materials used (for transparency)
            materielUtilise: intervention.materielUtilise,

            createdAt: intervention.createdAt,
            updatedAt: intervention.updatedAt,
        };

        return NextResponse.json({ intervention: response });
    } catch (error) {
        if (error instanceof Error && error.message.includes("Access denied")) {
            return NextResponse.json(
                { error: "Vous n'avez pas accès à cette intervention" },
                { status: 403 }
            );
        }
        return handleClientAuthError(error);
    }
}
