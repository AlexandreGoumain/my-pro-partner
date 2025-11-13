import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Quote } from "@/lib/types/document.types";

interface UseQuoteConvertReturn {
    convertToInvoice: (quote: Quote) => Promise<void>;
}

/**
 * Custom hook for converting quotes to invoices
 * Handles the API call and navigation after successful conversion
 *
 * @returns Conversion handler
 */
export function useQuoteConvert(): UseQuoteConvertReturn {
    const router = useRouter();

    const convertToInvoice = async (quote: Quote) => {
        try {
            const response = await fetch(`/api/documents/${quote.id}/convert`, {
                method: "POST",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Erreur lors de la conversion"
                );
            }

            const data = await response.json();
            toast.success("Devis converti en facture avec succès");
            router.push(`/dashboard/documents/invoices/${data.invoice.id}`);
        } catch (error) {
            console.error("Error converting quote:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Impossible de convertir le devis"
            );
        }
    };

    return {
        convertToInvoice,
    };
}
