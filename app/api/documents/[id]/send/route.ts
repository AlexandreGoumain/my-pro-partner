import { withApiHandler } from "@/lib/api/api-handler";
import { BusinessError, NotFoundError } from "@/lib/errors";
import { DocumentPdfRenderer } from "@/components/pdf/document-pdf-renderer";
import { emailService } from "@/lib/email/email-service";
import { InvoiceEmail } from "@/lib/email/templates/invoice";
import { prisma } from "@/lib/prisma";
import { render } from "@react-email/render";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// POST /api/documents/[id]/send - Send document by email
// ============================================

export async function POST(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const document = await prisma.document.findFirst({
                where: { id, entrepriseId: ctx.entrepriseId },
                include: {
                    client: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            email: true,
                        },
                    },
                    entreprise: {
                        select: {
                            nom: true,
                            email: true,
                        },
                    },
                    lignes: true,
                },
            });

            if (!document) {
                throw new NotFoundError("Document");
            }

            // Validate client has email
            if (!document.client.email) {
                throw new BusinessError(
                    "Le client n'a pas d'adresse email. Veuillez ajouter une adresse email au client."
                );
            }

            // Prepare email content
            const docTypeLabel =
                document.type === "FACTURE"
                    ? "Facture"
                    : document.type === "DEVIS"
                      ? "Devis"
                      : "Avoir";

            // Format dates
            const dateEmission = new Intl.DateTimeFormat("fr-FR").format(
                new Date(document.dateEmission)
            );
            const dateEcheance = document.dateEcheance
                ? new Intl.DateTimeFormat("fr-FR").format(
                      new Date(document.dateEcheance)
                  )
                : undefined;

            // Generate document view URL (if you have a public view page)
            const viewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/documents/${document.id}/view`;

            // Generate payment URL for invoices
            const paymentUrl =
                document.type === "FACTURE"
                    ? `${process.env.NEXT_PUBLIC_APP_URL}/pay/${document.id}`
                    : undefined;

            // Get company settings for PDF generation
            let companySettings = await prisma.parametresEntreprise.findUnique({
                where: { entrepriseId: ctx.entrepriseId },
            });

            if (!companySettings) {
                companySettings = await prisma.parametresEntreprise.create({
                    data: {
                        entrepriseId: ctx.entrepriseId,
                        nom_entreprise: document.entreprise.nom,
                    },
                });
            }

            // Generate PDF attachment
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

            // Render email HTML from React template
            const emailHtml = await render(
                InvoiceEmail({
                    documentType: document.type,
                    documentNumber: document.numero,
                    clientName: document.client.nom || "",
                    clientFirstName: document.client.prenom || "",
                    totalTTC: Number(document.total_ttc),
                    dateEmission,
                    dateEcheance,
                    entrepriseName: document.entreprise.nom || "MyProPartner",
                    entrepriseEmail: document.entreprise.email || undefined,
                    paymentInstructions:
                        document.conditions_paiement || undefined,
                    viewUrl,
                    paymentUrl,
                })
            );

            // Send email with PDF attachment
            const result = await emailService.sendEmail({
                to: document.client.email,
                subject: `${docTypeLabel} n°${document.numero} - ${document.entreprise.nom || "MyProPartner"}`,
                html: emailHtml,
                attachments: [
                    {
                        filename: `${docTypeLabel}_${document.numero}.pdf`,
                        content: pdfBuffer,
                    },
                ],
                fromName: document.entreprise.nom || "MyProPartner",
                replyTo: document.entreprise.email || undefined,
            });

            if (!result.success) {
                throw new BusinessError(
                    `Erreur lors de l'envoi de l'email : ${result.error}`
                );
            }

            // Update document status to ENVOYE if it was BROUILLON
            if (document.statut === "BROUILLON") {
                await prisma.document.update({
                    where: { id },
                    data: { statut: "ENVOYE" },
                });
            }

            return NextResponse.json({
                success: true,
                message: `${docTypeLabel} envoyé(e) avec succès à ${document.client.email}`,
                emailId: result.messageId,
            });
        },
        {
            context: { resourceName: "Document", operation: "send" },
        }
    );
}
