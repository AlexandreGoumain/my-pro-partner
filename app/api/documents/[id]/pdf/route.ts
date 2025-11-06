import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DocumentPdfRenderer } from "@/components/pdf/document-pdf-renderer";
import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET: Generate and download PDF for a document
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const { id } = await params;

        // Get user's company
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { entreprise: true },
        });

        if (!user?.entreprise) {
            return NextResponse.json(
                { message: "Entreprise non trouvée" },
                { status: 404 }
            );
        }

        // Fetch document with all details
        const document = await prisma.document.findUnique({
            where: {
                id,
                entrepriseId: user.entreprise.id,
            },
            include: {
                client: true,
                lignes: {
                    orderBy: { ordre: "asc" },
                },
            },
        });

        if (!document) {
            return NextResponse.json(
                { message: "Document non trouvé" },
                { status: 404 }
            );
        }

        // Get company settings
        let companySettings = await prisma.parametresEntreprise.findUnique({
            where: { entrepriseId: user.entreprise.id },
        });

        if (!companySettings) {
            companySettings = await prisma.parametresEntreprise.create({
                data: {
                    entrepriseId: user.entreprise.id,
                    nom_entreprise: user.entreprise.nom,
                },
            });
        }

        // Generate PDF
        const pdfBuffer = await renderToBuffer(
            DocumentPdfRenderer({
                document: {
                    ...document,
                    total_ht: Number(document.total_ht),
                    total_tva: Number(document.total_tva),
                    total_ttc: Number(document.total_ttc),
                    reste_a_payer: Number(document.reste_a_payer),
                    lignes: document.lignes.map((ligne) => ({
                        ...ligne,
                        quantite: Number(ligne.quantite),
                        prix_unitaire_ht: Number(ligne.prix_unitaire_ht),
                        tva_taux: Number(ligne.tva_taux),
                        remise_pourcent: Number(ligne.remise_pourcent),
                        montant_ht: Number(ligne.montant_ht),
                        montant_tva: Number(ligne.montant_tva),
                        montant_ttc: Number(ligne.montant_ttc),
                    })),
                },
                company: companySettings,
            })
        );

        // Generate filename
        const typeLabel = {
            DEVIS: "Devis",
            FACTURE: "Facture",
            AVOIR: "Avoir",
        }[document.type];
        const filename = `${typeLabel}_${document.numero}.pdf`;

        // Return PDF as download
        return new NextResponse(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error("Erreur lors de la génération du PDF:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
