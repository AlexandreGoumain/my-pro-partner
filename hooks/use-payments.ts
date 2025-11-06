import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import type { Payment } from "@/lib/types/payment.types";

/**
 * React Query keys for payment data
 * Used to cache and invalidate payment queries
 */
export const paymentKeys = {
    all: ["payments"] as const,
    byDocument: (documentId: string) => [...paymentKeys.all, "document", documentId] as const,
};

/**
 * Fetch all payments for a specific document
 *
 * @param documentId The document ID to fetch payments for
 * @returns Query result with payment array
 */
export function usePayments(documentId: string) {
    return useQuery({
        queryKey: paymentKeys.byDocument(documentId),
        queryFn: async () => {
            const result = await api.get<{ payments: Payment[] }>(`/api/documents/${documentId}/payments`);
            return result.payments || [];
        },
        enabled: !!documentId,
        staleTime: 30000, // Cache for 30 seconds
    });
}
