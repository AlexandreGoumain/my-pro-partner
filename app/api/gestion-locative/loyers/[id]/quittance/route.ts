import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { QuittancePdfRenderer } from "@/components/pdf/quittance-pdf-renderer";
import { renderToBuffer } from "@react-pdf/renderer";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// POST /api/gestion-locative/loyers/[id]/quittance - Generate quittance
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("loyers");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Verify loyer exists and belongs to entreprise
        const loyer = await prisma.appelLoyer.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
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
            return NextResponse.json(
                { error: "Loyer non trouvé" },
                { status: 404 }
            );
        }

        // Check if loyer is paid (at least partially)
        const montantPaye = Number(loyer.montantPaye) || 0;
        if (montantPaye <= 0) {
            return NextResponse.json(
                { error: "Aucun paiement enregistré pour ce loyer" },
                { status: 400 }
            );
        }

        // Get entreprise info for the quittance
        const parametres = await prisma.parametresEntreprise.findUnique({
            where: { entrepriseId: session.user.entrepriseId },
            select: {
                nom_entreprise: true,
                adresse: true,
                code_postal: true,
                ville: true,
                siret: true,
            },
        });

        // Generate quittance data (to be used by a PDF generator)
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

        // Mark quittance as generated
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
    } catch (error) {
        console.error("Error generating quittance:", error);
        return NextResponse.json(
            { error: "Failed to generate quittance" },
            { status: 500 }
        );
    }
}

// GET /api/gestion-locative/loyers/[id]/quittance - Download quittance PDF
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const loyer = await prisma.appelLoyer.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
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
            return NextResponse.json(
                { error: "Loyer non trouvé" },
                { status: 404 }
            );
        }

        if (!loyer.quittanceGeneree) {
            return NextResponse.json(
                { error: "Quittance non générée. Veuillez d'abord générer la quittance." },
                { status: 400 }
            );
        }

        // Get entreprise info
        const parametres = await prisma.parametresEntreprise.findUnique({
            where: { entrepriseId: session.user.entrepriseId },
            select: {
                nom_entreprise: true,
                siret: true,
                adresse: true,
                code_postal: true,
                ville: true,
            },
        });

        // Prepare quittance data for PDF
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

        // Generate PDF
        const pdfBuffer = await renderToBuffer(
            QuittancePdfRenderer({
                quittance: quittanceData,
                company: parametres,
            })
        );

        // Generate filename
        const filename = `Quittance_${loyer.numero}_${loyer.mois}-${loyer.annee}.pdf`;

        // Return PDF as download
        return new NextResponse(new Uint8Array(pdfBuffer), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error("Error downloading quittance:", error);
        return NextResponse.json(
            { error: "Failed to download quittance" },
            { status: 500 }
        );
    }
}
