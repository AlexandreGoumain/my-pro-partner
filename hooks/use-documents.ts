import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import type { Document, DocumentType } from "@/lib/types/document.types";

export type { DocumentType };

// Query Keys
export const documentKeys = {
    all: ["documents"] as const,
    lists: () => [...documentKeys.all, "list"] as const,
    list: (type: DocumentType) => [...documentKeys.lists(), type] as const,
    details: () => [...documentKeys.all, "detail"] as const,
    detail: (id: string) => [...documentKeys.details(), id] as const,
};

/**
 * Hook to fetch all documents of a specific type
 */
export function useDocuments(type: DocumentType) {
    return useQuery({
        queryKey: documentKeys.list(type),
        queryFn: async () => {
            const result = await api.get<{ documents: Document[] }>(`/api/documents?type=${type}`);
            return result.documents || [];
        },
    });
}

/**
 * Hook to fetch documents for a specific client
 */
export function useClientDocuments(clientId: string) {
    return useQuery({
        queryKey: [...documentKeys.all, "client", clientId] as const,
        queryFn: async () => {
            const result = await api.get<{ documents: Document[] }>(`/api/documents?clientId=${clientId}`);
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
            const result = await api.get<{ document: Document }>(`/api/documents/${id}`);
            return result.document;
        },
        enabled: !!id,
    });
}

/**
 * Hook to delete a document
 */
export function useDeleteDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => api.delete(`/api/documents/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: documentKeys.all });
        },
    });
}

/**
 * Hook to convert a quote to an invoice
 */
export function useConvertQuoteToInvoice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (quoteId: string) => {
            const result = await api.post<{ invoice: Document }>(`/api/documents/${quoteId}/convert`);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: documentKeys.all });
        },
    });
}
