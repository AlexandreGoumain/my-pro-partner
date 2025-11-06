import { prisma } from "@/lib/prisma";
import { DocumentNumberGeneratorService } from "./document-number-generator.service";

interface ConvertQuoteToInvoiceOptions {
    quoteId: string;
    entrepriseId: string;
}

/**
 * Service for converting documents between types
 * Currently handles quote to invoice conversion
 */
export class DocumentConverterService {
    /**
     * Convert a quote (DEVIS) to an invoice (FACTURE)
     *
     * @param options Quote ID and company ID
     * @returns Created invoice
     * @throws Error if quote not found, not accepted, or already converted
     */
    static async convertQuoteToInvoice(options: ConvertQuoteToInvoiceOptions) {
        const { quoteId, entrepriseId } = options;

        // Fetch the quote with details
        const devis = await prisma.document.findUnique({
            where: { id: quoteId },
            include: {
                lignes: {
                    orderBy: { ordre: "asc" },
                },
                client: true,
            },
        });

        // Validate quote exists
        if (!devis) {
            throw new Error("Devis non trouvé");
        }

        // Validate it's a quote
        if (devis.type !== "DEVIS") {
            throw new Error("Ce document n'est pas un devis");
        }

        // Validate quote is accepted
        if (devis.statut !== "ACCEPTE") {
            throw new Error("Seuls les devis acceptés peuvent être convertis en facture");
        }

        // Check if already converted
        const existingInvoice = await prisma.document.findFirst({
            where: { devisId: devis.id },
        });

        if (existingInvoice) {
            throw new Error("Ce devis a déjà été converti en facture");
        }

        // Generate invoice number
        const { numero, serieId } = await DocumentNumberGeneratorService.generateNumber(
            entrepriseId,
            "FACTURE"
        );

        // Create invoice from quote
        const invoice = await prisma.document.create({
            data: {
                numero,
                type: "FACTURE",
                clientId: devis.clientId,
                entrepriseId: devis.entrepriseId,
                serieId,
                dateEmission: new Date(),
                dateEcheance: devis.dateEcheance || null,
                statut: "ENVOYE",
                notes: devis.notes,
                conditions_paiement: devis.conditions_paiement,
                validite_jours: devis.validite_jours,
                total_ht: devis.total_ht,
                total_tva: devis.total_tva,
                total_ttc: devis.total_ttc,
                reste_a_payer: devis.total_ttc,
                acompte_montant: 0,
                devisId: devis.id,
                lignes: {
                    create: devis.lignes.map((ligne) => ({
                        ordre: ligne.ordre,
                        articleId: ligne.articleId,
                        designation: ligne.designation,
                        description: ligne.description,
                        quantite: ligne.quantite,
                        prix_unitaire_ht: ligne.prix_unitaire_ht,
                        tva_taux: ligne.tva_taux,
                        remise_pourcent: ligne.remise_pourcent,
                        montant_ht: ligne.montant_ht,
                        montant_tva: ligne.montant_tva,
                        montant_ttc: ligne.montant_ttc,
                    })),
                },
            },
            include: {
                client: true,
                lignes: true,
            },
        });

        return invoice;
    }
}
