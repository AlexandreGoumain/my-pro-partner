import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// POST /api/missions/[id]/invoice - Create invoice from mission time entries
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("projets");
        if (capabilityCheck) return capabilityCheck;

        const { id: missionId } = await params;
        const body = await request.json();
        const { entryIds } = body as { entryIds?: string[] };

        // Get mission with time entries
        const mission = await prisma.mission.findFirst({
            where: {
                id: missionId,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                client: true,
                entreesTemps: {
                    where: entryIds
                        ? {
                              id: { in: entryIds },
                              facturee: false,
                              facturable: true,
                          }
                        : { facturee: false, facturable: true },
                },
            },
        });

        if (!mission) {
            return NextResponse.json(
                { error: "Mission introuvable" },
                { status: 404 }
            );
        }

        if (mission.entreesTemps.length === 0) {
            return NextResponse.json(
                { error: "Aucune entrée de temps à facturer" },
                { status: 400 }
            );
        }

        // Calculate totals
        const totalHT = mission.entreesTemps.reduce(
            (sum, e) => sum + Number(e.montant),
            0
        );
        const tvaTaux = 20; // Default TVA rate
        const totalTVA = totalHT * (tvaTaux / 100);
        const totalTTC = totalHT + totalTVA;

        // Get parametres for invoice number
        let parametres = await prisma.parametresEntreprise.findUnique({
            where: { entrepriseId: session.user.entrepriseId },
        });

        if (!parametres) {
            parametres = await prisma.parametresEntreprise.create({
                data: {
                    entrepriseId: session.user.entrepriseId,
                    nom_entreprise: "Mon Entreprise",
                },
            });
        }

        const prefixe = parametres.prefixe_facture;
        const prochainNumero = parametres.prochain_numero_facture;
        const numero = `${prefixe}${prochainNumero.toString().padStart(5, "0")}`;

        // Create invoice in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Update invoice counter
            await tx.parametresEntreprise.update({
                where: { entrepriseId: session.user.entrepriseId },
                data: { prochain_numero_facture: prochainNumero + 1 },
            });

            // Create invoice
            const facture = await tx.document.create({
                data: {
                    numero,
                    type: "FACTURE",
                    clientId: mission.clientId,
                    entrepriseId: session.user.entrepriseId,
                    dateEmission: new Date(),
                    dateEcheance: new Date(
                        Date.now() + 30 * 24 * 60 * 60 * 1000
                    ), // +30 days
                    statut: "BROUILLON",
                    notes: `Facture pour mission ${mission.numero} - ${mission.nom}`,
                    total_ht: totalHT,
                    total_tva: totalTVA,
                    total_ttc: totalTTC,
                    reste_a_payer: totalTTC,
                    lignes: {
                        create: mission.entreesTemps.map((entry, index) => {
                            const dureeHeures = entry.duree / 60;
                            const prixHT = Number(entry.montant);
                            const montantTVA = prixHT * (tvaTaux / 100);

                            return {
                                ordre: index + 1,
                                designation: `${new Date(entry.date).toLocaleDateString("fr-FR")} - ${entry.description}`,
                                description: `Mission: ${mission.nom}`,
                                quantite: dureeHeures,
                                prix_unitaire_ht: Number(entry.tauxHoraire),
                                tva_taux: tvaTaux,
                                remise_pourcent: 0,
                                montant_ht: prixHT,
                                montant_tva: montantTVA,
                                montant_ttc: prixHT + montantTVA,
                            };
                        }),
                    },
                },
                include: {
                    client: true,
                    lignes: true,
                },
            });

            // Mark time entries as invoiced
            await tx.entreeTemps.updateMany({
                where: {
                    id: { in: mission.entreesTemps.map((e) => e.id) },
                },
                data: {
                    facturee: true,
                    factureId: facture.id,
                },
            });

            // Link invoice to mission
            await tx.mission.update({
                where: { id: missionId },
                data: {
                    factures: {
                        connect: { id: facture.id },
                    },
                },
            });

            return facture;
        });

        // Format response
        const formattedFacture = {
            ...result,
            total_ht: Number(result.total_ht),
            total_tva: Number(result.total_tva),
            total_ttc: Number(result.total_ttc),
            reste_a_payer: Number(result.reste_a_payer),
            lignes: result.lignes.map((l) => ({
                ...l,
                prix_unitaire_ht: Number(l.prix_unitaire_ht),
                montant_ht: Number(l.montant_ht),
                montant_tva: Number(l.montant_tva),
                montant_ttc: Number(l.montant_ttc),
            })),
        };

        return NextResponse.json(
            { facture: formattedFacture },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating invoice from mission:", error);
        return NextResponse.json(
            { error: "Failed to create invoice" },
            { status: 500 }
        );
    }
}
