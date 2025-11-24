import { prisma } from "@/lib/prisma";

/**
 * Service for generating document numbers
 * Uses company parameters for number generation
 */
export class DocumentNumberGeneratorService {
    /**
     * Generate a document number for invoices, quotes, or credits
     *
     * @param entrepriseId Company ID
     * @param documentType Type of document (FACTURE, DEVIS, AVOIR)
     * @returns Generated document number
     */
    static async generateNumber(
        entrepriseId: string,
        documentType: "FACTURE" | "DEVIS" | "AVOIR"
    ): Promise<{ numero: string }> {
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

        // Get prefix and counter with proper typing
        type ParametresKey = keyof typeof parametres;
        const prefixe =
            (parametres[fields.prefix as ParametresKey] as string | null) ||
            "DOC";
        const prochainNumero =
            (parametres[fields.counter as ParametresKey] as number | null) || 1;
        const numero = `${prefixe}${prochainNumero.toString().padStart(5, "0")}`;

        // Update prochain numero
        await prisma.parametresEntreprise.update({
            where: { entrepriseId },
            data: { [fields.counter]: prochainNumero + 1 },
        });

        return { numero };
    }
}
