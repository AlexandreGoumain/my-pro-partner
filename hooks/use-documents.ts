/**
 * Documents hooks
 *
 * Optimized version using:
 * - api client for standardized fetch
 * - buildUrl utility for URL construction
 * - useMutationWithInvalidation for mutations
 */

import { api } from "@/lib/api/fetch-client";
import { useMutationWithInvalidation } from "@/lib/hooks/mutation-helpers";
import type { Document, DocumentType } from "@/lib/types/document.types";
import { buildUrl } from "@/lib/utils/query-params";
import { useQuery } from "@tanstack/react-query";

export type { Document, DocumentType };

// Query Keys
export const documentKeys = {
    all: ["documents"] as const,
    lists: () => [...documentKeys.all, "list"] as const,
    list: (type: DocumentType) => [...documentKeys.lists(), type] as const,
    listByClient: (clientId: string) =>
        [...documentKeys.all, "client", clientId] as const,
    details: () => [...documentKeys.all, "detail"] as const,
    detail: (id: string) => [...documentKeys.details(), id] as const,
};

// Common invalidation keys
const baseInvalidateKeys = [documentKeys.all];

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Hook to fetch all documents of a specific type
 */
export function useDocuments(type: DocumentType) {
    return useQuery({
        queryKey: documentKeys.list(type),
        queryFn: async () => {
            const result = await api.get<{ documents: Document[] }>(
                buildUrl("/api/documents", { type })
            );
            return result.documents || [];
        },
    });
}

/**
 * Hook to fetch documents for a specific client
 */
export function useClientDocuments(clientId: string) {
    return useQuery({
        queryKey: documentKeys.listByClient(clientId),
        queryFn: async () => {
            const result = await api.get<{ documents: Document[] }>(
                buildUrl("/api/documents", { clientId })
            );
            return result.documents || [];
        },
        enabled: !!clientId,
    });
}

/**
 * Hook to fetch a single document by ID
 */
export function useDocument(id: string) {
    return useQuery({
        queryKey: documentKeys.detail(id),
        queryFn: async () => {
            const result = await api.get<{ document: Document }>(
                `/api/documents/${id}`
            );
            return result.document;
        },
        enabled: !!id,
    });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Hook to delete a document
 */
export function useDeleteDocument() {
    return useMutationWithInvalidation<void, string>({
        mutationFn: (id) => api.delete(`/api/documents/${id}`),
        invalidateKeys: baseInvalidateKeys,
        messages: {
            success: "Document supprimé",
            successDescription: "Le document a été supprimé avec succès.",
        },
    });
}

/**
 * Hook to convert a quote to an invoice
 */
export function useConvertQuoteToInvoice() {
    return useMutationWithInvalidation<{ invoice: Document }, string>({
        mutationFn: (quoteId) => api.post(`/api/documents/${quoteId}/convert`),
        invalidateKeys: baseInvalidateKeys,
        messages: {
            success: "Devis converti",
            successDescription: "Le devis a été converti en facture.",
        },
    });
}
