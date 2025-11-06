import { prisma } from "@/lib/prisma";
import { generateNumeroDocument } from "@/lib/types/settings";

/**
 * Service for generating document numbers
 * Handles serie-based and fallback number generation
 */
export class DocumentNumberGeneratorService {
    /**
     * Generate a document number for invoices, quotes, or credits
     *
     * @param entrepriseId Company ID
     * @param documentType Type of document (FACTURE, DEVIS, AVOIR)
     * @returns Generated document number and serieId (if using series)
     */
    static async generateNumber(
        entrepriseId: string,
        documentType: "FACTURE" | "DEVIS" | "AVOIR"
    ): Promise<{ numero: string; serieId: string | null }> {
        // Try to find default serie for this document type
        const defaultSerie = await this.findDefaultSerie(entrepriseId, documentType);

        if (defaultSerie) {
            return this.generateWithSerie(defaultSerie, documentType);
        }

        // Fallback to old system using parametres
        return this.generateWithParametres(entrepriseId, documentType);
    }

    /**
     * Find default serie for document type
     */
    private static async findDefaultSerie(
        entrepriseId: string,
        documentType: "FACTURE" | "DEVIS" | "AVOIR"
    ) {
        const serieFilters = {
            FACTURE: { est_defaut_factures: true, pour_factures: true },
            DEVIS: { est_defaut_devis: true, pour_devis: true },
            AVOIR: { est_defaut_avoirs: true, pour_avoirs: true },
        };

        return prisma.serieDocument.findFirst({
            where: {
                entrepriseId,
                active: true,
                ...serieFilters[documentType],
            },
        });
    }

    /**
     * Generate number using serie system
     */
    private static async generateWithSerie(
        serie: any,
        documentType: "FACTURE" | "DEVIS" | "AVOIR"
    ): Promise<{ numero: string; serieId: string }> {
        // Check if counter needs to be reset
        let currentNumero = serie.prochain_numero;
        const now = new Date();
        const shouldReset = this.shouldResetCounter(serie, now);

        if (shouldReset) {
            currentNumero = 1;
        }

        // Generate numero using serie format
        const numero = generateNumeroDocument(
            serie.format_numero,
            currentNumero,
            serie.code,
            documentType
        );

        // Update serie prochain_numero and derniere_reset if needed
        await prisma.serieDocument.update({
            where: { id: serie.id },
            data: {
                prochain_numero: currentNumero + 1,
                ...(shouldReset && { derniere_reset: now }),
            },
        });

        return { numero, serieId: serie.id };
    }

    /**
     * Check if serie counter should be reset
     */
    private static shouldResetCounter(serie: any, now: Date): boolean {
        if (!serie.derniere_reset && serie.reset_compteur !== "AUCUN") {
            return true;
        }

        if (!serie.derniere_reset) {
            return false;
        }

        const lastReset = new Date(serie.derniere_reset);

        if (serie.reset_compteur === "ANNUEL") {
            return lastReset.getFullYear() !== now.getFullYear();
        }

        if (serie.reset_compteur === "MENSUEL") {
            return (
                lastReset.getFullYear() !== now.getFullYear() ||
                lastReset.getMonth() !== now.getMonth()
            );
        }

        return false;
    }

    /**
     * Generate number using old parametres system (fallback)
     */
    private static async generateWithParametres(
        entrepriseId: string,
        documentType: "FACTURE" | "DEVIS" | "AVOIR"
    ): Promise<{ numero: string; serieId: null }> {
        let parametres = await prisma.parametresEntreprise.findUnique({
            where: { entrepriseId },
        });

        // Create parametres if not exists
        if (!parametres) {
            parametres = await prisma.parametresEntreprise.create({
                data: {
                    entrepriseId,
                    nom_entreprise: "Mon Entreprise",
                },
            });
        }

        const fieldMap = {
            FACTURE: {
                prefix: "prefixe_facture",
                counter: "prochain_numero_facture",
            },
            DEVIS: {
                prefix: "prefixe_devis",
                counter: "prochain_numero_devis",
            },
            AVOIR: {
                prefix: "prefixe_avoir",
                counter: "prochain_numero_avoir",
            },
        };

        const fields = fieldMap[documentType];
        const prefixe = (parametres as any)[fields.prefix] || "DOC";
        const prochainNumero = (parametres as any)[fields.counter] || 1;
        const numero = `${prefixe}${prochainNumero.toString().padStart(5, "0")}`;

        // Update prochain numero
        await prisma.parametresEntreprise.update({
            where: { entrepriseId },
            data: { [fields.counter]: prochainNumero + 1 },
        });

        return { numero, serieId: null };
    }
}
