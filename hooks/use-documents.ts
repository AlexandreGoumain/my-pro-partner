import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";

export type DocumentType = "FACTURE" | "DEVIS";
export type DocumentStatus = "BROUILLON" | "ENVOYE" | "ACCEPTE" | "PAYE" | "ANNULE";

export interface Document {
    id: string;
    numero: string;
    type: DocumentType;
    dateEmission: Date;
    dateEcheance: Date | null;
    statut: DocumentStatus;
    client: {
        nom: string;
        prenom: string | null;
        email: string | null;
        telephone: string | null;
        adresse: string | null;
    };
    total_ht: number;
    total_tva: number;
    total_ttc: number;
    notes: string | null;
    conditions_paiement: string | null;
    validite_jours: number;
    lignes: Array<{
        id: string;
        designation: string;
        description: string | null;
        quantite: number;
        prix_unitaire_ht: number;
        tva_taux: number;
        remise_pourcent: number;
        montant_ht: number;
        montant_tva: number;
        montant_ttc: number;
    }>;
}

// Query Keys
export const documentKeys = {
    all: ["documents"] as const,
    lists: () => [...documentKeys.all, "list"] as const,
    list: (type: DocumentType) => [...documentKeys.lists(), type] as const,
    details: () => [...documentKeys.all, "detail"] as const,
    detail: (id: string) => [...documentKeys.details(), id] as const,
};

// Hook pour récupérer tous les documents d'un type
export function useDocuments(type: DocumentType) {
    return useQuery({
        queryKey: documentKeys.list(type),
        queryFn: async () => {
            const result = await api.get<{ documents: Document[] }>(`/api/documents?type=${type}`);
            return result.documents || [];
        },
    });
}

// Hook pour récupérer un document par ID
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

// Hook pour supprimer un document
export function useDeleteDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => api.delete(`/api/documents/${id}`),
        onSuccess: () => {
            // Invalide tous les documents et détails
            queryClient.invalidateQueries({ queryKey: documentKeys.all });
        },
    });
}

// Hook pour convertir un devis en facture
export function useConvertQuoteToInvoice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (quoteId: string) => {
            const result = await api.post<{ invoice: Document }>(`/api/documents/${quoteId}/convert`);
            return result;
        },
        onSuccess: () => {
            // Invalide tous les documents
            queryClient.invalidateQueries({ queryKey: documentKeys.all });
        },
    });
}
