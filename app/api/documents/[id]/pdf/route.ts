import { withApiHandler } from "@/lib/api/api-handler";
import { NotFoundError } from "@/lib/errors";
import { DocumentPdfRenderer } from "@/components/pdf/document-pdf-renderer";
import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";

// GET: Generate and download PDF for a document
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            // Fetch document with all details
            const document = await prisma.document.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    client: true,
                    lignes: {
                        orderBy: { ordre: "asc" },
                    },
                },
            });

            if (!document) {
                throw new NotFoundError("Document");
            }

            // Get company settings
            let companySettings = await prisma.parametresEntreprise.findUnique({
                where: { entrepriseId: ctx.entrepriseId },
            });

            if (!companySettings) {
                const entreprise = await prisma.entreprise.findUnique({
                    where: { id: ctx.entrepriseId },
                });
                companySettings = await prisma.parametresEntreprise.create({
                    data: {
                        entrepriseId: ctx.entrepriseId,
                        nom_entreprise: entreprise?.nom || "Mon Entreprise",
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
                        acompte_montant: Number(document.acompte_montant),
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
            return new NextResponse(new Uint8Array(pdfBuffer), {
                headers: {
                    "Content-Type": "application/pdf",
                    "Content-Disposition": `attachment; filename="${filename}"`,
                },
            });
        },
        {
            context: { resourceName: "Document", operation: "downloadPDF" },
        }
    );
}
