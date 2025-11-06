import { useState } from "react";

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
        if (!documentId) return;

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
            }
        } catch (error) {
            // Silent fail - user can close page and contact support
            // Error is already shown in API response
            setIsRetrying(false);
        }
    };

    return {
        isRetrying,
        handleRetry,
    };
}
