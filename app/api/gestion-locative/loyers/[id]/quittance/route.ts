import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, BusinessError } from "@/lib/errors";
import { QuittancePdfRenderer } from "@/components/pdf/quittance-pdf-renderer";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * POST /api/gestion-locative/loyers/[id]/quittance
 * Generate quittance
 */
export async function POST(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const loyer = await prisma.appelLoyer.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    bail: {
                        include: {
                            bien: {
                                select: {
                                    id: true,
                                    reference: true,
                                    titre: true,
                                    adresse: true,
                                    codePostal: true,
                                    ville: true,
                                },
                            },
                            locatairePrincipal: {
                                select: {
                                    id: true,
                                    nom: true,
                                    prenom: true,
                                    adresse: true,
                                    codePostal: true,
                                    ville: true,
                                },
                            },
                            proprietaire: {
                                select: {
                                    id: true,
                                    nom: true,
                                    prenom: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!loyer) {
                throw new NotFoundError("Loyer non trouvé");
            }

            const montantPaye = Number(loyer.montantPaye) || 0;
            if (montantPaye <= 0) {
                throw new BusinessError(
                    "Aucun paiement enregistré pour ce loyer"
                );
            }

            const parametres = await prisma.parametresEntreprise.findUnique({
                where: { entrepriseId: ctx.entrepriseId },
                select: {
                    nom_entreprise: true,
                    adresse: true,
                    code_postal: true,
                    ville: true,
                    siret: true,
                },
            });

            const quittanceData = {
                numero: `QUIT-${loyer.numero}`,
                dateGeneration: new Date().toISOString(),
                periode: {
                    mois: loyer.mois,
                    annee: loyer.annee,
                },
                bien: loyer.bail?.bien,
                locataire: loyer.bail?.locatairePrincipal,
                proprietaire: loyer.bail?.proprietaire,
                bailleur: parametres,
                montants: {
                    loyerHC: Number(loyer.loyerHC),
                    provisions: Number(loyer.provisions),
                    totalDu: Number(loyer.totalDu),
                    montantPaye: montantPaye,
                },
                datePaiement: loyer.datePaiement,
            };

            const quittanceUrl = `/api/gestion-locative/loyers/${id}/quittance`;

            await prisma.appelLoyer.update({
                where: { id },
                data: {
                    quittanceGeneree: true,
                    quittanceUrl,
                },
            });

            return NextResponse.json({
                quittanceUrl,
                quittanceData,
                message: "Quittance générée avec succès",
            });
        },
        {
            anyCapability: ["loyers"],
            context: { resourceName: "AppelLoyer", operation: "generateQuittance" },
        }
    );
}

/**
 * GET /api/gestion-locative/loyers/[id]/quittance
 * Download quittance PDF
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const loyer = await prisma.appelLoyer.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    bail: {
                        include: {
                            bien: {
                                select: {
                                    reference: true,
                                    titre: true,
                                    adresse: true,
                                    codePostal: true,
                                    ville: true,
                                },
                            },
                            locatairePrincipal: {
                                select: {
                                    nom: true,
                                    prenom: true,
                                    adresse: true,
                                    codePostal: true,
                                    ville: true,
                                },
                            },
                            proprietaire: {
                                select: {
                                    nom: true,
                                    prenom: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!loyer) {
                throw new NotFoundError("Loyer non trouvé");
            }

            if (!loyer.quittanceGeneree) {
                throw new BusinessError(
                    "Quittance non générée. Veuillez d'abord générer la quittance."
                );
            }

            const parametres = await prisma.parametresEntreprise.findUnique({
                where: { entrepriseId: ctx.entrepriseId },
                select: {
                    nom_entreprise: true,
                    siret: true,
                    adresse: true,
                    code_postal: true,
                    ville: true,
                },
            });

            const quittanceData = {
                numero: `QUIT-${loyer.numero}`,
                dateGeneration: new Date().toISOString(),
                periode: {
                    mois: loyer.mois,
                    annee: loyer.annee,
                },
                bien: loyer.bail?.bien,
                locataire: loyer.bail?.locatairePrincipal,
                proprietaire: loyer.bail?.proprietaire,
                montants: {
                    loyerHC: Number(loyer.loyerHC),
                    provisions: Number(loyer.provisions),
                    totalDu: Number(loyer.totalDu),
                    montantPaye: Number(loyer.montantPaye) || 0,
                },
                datePaiement: loyer.datePaiement,
            };

            const pdfBuffer = await renderToBuffer(
                QuittancePdfRenderer({
                    quittance: quittanceData,
                    company: parametres,
                })
            );

            const filename = `Quittance_${loyer.numero}_${loyer.mois}-${loyer.annee}.pdf`;

            return new NextResponse(new Uint8Array(pdfBuffer), {
                headers: {
                    "Content-Type": "application/pdf",
                    "Content-Disposition": `attachment; filename="${filename}"`,
                },
            });
        },
        {
            anyCapability: ["loyers"],
            context: { resourceName: "AppelLoyer", operation: "downloadQuittance" },
        }
    );
}
