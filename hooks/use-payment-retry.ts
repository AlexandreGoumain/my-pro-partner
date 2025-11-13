import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface UsePaymentRetryReturn {
    isRetrying: boolean;
    handleRetry: () => Promise<void>;
}

/**
 * Custom hook for handling payment retry logic
 * Used when a payment is cancelled and user wants to try again
 *
 * @param documentId The document ID to retry payment for
 * @returns Retry state and handler
 */
export function usePaymentRetry(documentId: string | null): UsePaymentRetryReturn {
    const [isRetrying, setIsRetrying] = useState(false);

    const handleRetry = async () => {
        if (!documentId) {
            toast({
                title: "Erreur",
                description: "Aucun document associé à ce paiement.",
                variant: "destructive",
            });
            return;
        }

        setIsRetrying(true);
        try {
            const response = await fetch(`/api/documents/${documentId}/payment`, {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Impossible de créer une session de paiement");
            }

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("URL de paiement non reçue");
            }
        } catch (error) {
            toast({
                title: "Erreur",
                description:
                    error instanceof Error
                        ? error.message
                        : "Impossible de créer une session de paiement. Veuillez contacter le support.",
                variant: "destructive",
            });
            setIsRetrying(false);
        }
    };

    return {
        isRetrying,
        handleRetry,
    };
}
