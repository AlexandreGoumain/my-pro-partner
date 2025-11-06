import { useState, useEffect } from "react";
import { toNumber, formatCurrency } from "@/lib/utils/payment-utils";

interface InvoiceData {
    id: string;
    numero: string;
    dateEmission: string;
    total_ttc: number;
    reste_a_payer: number;
    statut: string;
    client: {
        nom: string;
        prenom: string | null;
    };
    entreprise: {
        nom: string;
    };
}

interface UsePaymentInvoiceReturn {
    invoice: InvoiceData | null;
    isLoading: boolean;
    isProcessing: boolean;
    error: string | null;
    clientName: string;
    resteAPayer: number;
    entrepriseName: string;
    isAlreadyPaid: boolean;
    handlePayment: () => Promise<void>;
    formatAmount: (amount: number) => string;
}

/**
 * Custom hook for managing payment invoice page logic
 * Handles invoice fetching, payment processing, and state management
 *
 * @param documentId The document ID to fetch and process payment for
 * @returns Invoice data and payment handlers
 */
export function usePaymentInvoice(documentId: string): UsePaymentInvoiceReturn {
    const [invoice, setInvoice] = useState<InvoiceData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (documentId) {
            fetchInvoice();
        }
    }, [documentId]);

    const fetchInvoice = async () => {
        try {
            const response = await fetch(`/api/documents/${documentId}`);
            if (!response.ok) {
                throw new Error("Facture non trouvée");
            }
            const data = await response.json();
            setInvoice(data.document);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Impossible de charger la facture";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            const response = await fetch(`/api/documents/${documentId}/payment`, {
                method: "POST",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de la création du paiement");
            }

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors du paiement");
            setIsProcessing(false);
        }
    };

    const clientName = invoice?.client?.prenom
        ? `${invoice.client.nom} ${invoice.client.prenom}`
        : invoice?.client?.nom || "Client";

    const resteAPayer = toNumber(invoice?.reste_a_payer, toNumber(invoice?.total_ttc));
    const entrepriseName = invoice?.entreprise?.nom || "MyProPartner";
    const isAlreadyPaid = invoice?.statut === "PAYE" || resteAPayer <= 0;

    return {
        invoice,
        isLoading,
        isProcessing,
        error,
        clientName,
        resteAPayer,
        entrepriseName,
        isAlreadyPaid,
        handlePayment,
        formatAmount: formatCurrency,
    };
}
