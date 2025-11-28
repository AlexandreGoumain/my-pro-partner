/**
 * Hook for managing Reparations (repair tickets)
 *
 * Optimized version using:
 * - buildUrl utility for URL construction
 * - useMutationWithInvalidation for mutations with toast
 * - api client for standardized fetch
 */

import { api } from "@/lib/api/fetch-client";
import { useMutationWithInvalidation } from "@/lib/hooks/mutation-helpers";
import { buildUrl } from "@/lib/utils/query-params";
import { useQuery } from "@tanstack/react-query";

// Types
export interface Reparation {
    id: string;
    numero: string;
    reference: string | null;
    clientId: string;
    technicienId: string | null;
    storeId: string | null;
    registerId: string | null;
    documentId: string | null;
    typeAppareil: string;
    marque: string | null;
    modele: string | null;
    numeroSerie: string | null;
    motAuthentification: string | null;
    panne: string;
    etatVisuel: string | null;
    accessoires: string | null;
    diagnostic: string | null;
    solutionAppliquee: string | null;
    statut: ReparationStatut;
    priorite: ReparationPriorite;
    dateDepot: Date;
    dateEstimeeRetour: Date | null;
    datePriseEnCharge: Date | null;
    dateRetour: Date | null;
    notesInternes: string | null;
    notesTechnicien: string | null;
    coutMainOeuvre: number;
    coutPieces: number;
    entrepriseId: string;
    createdAt: Date;
    updatedAt: Date;
    client: {
        id: string;
        nom: string;
        prenom: string | null;
        email: string | null;
        telephone: string | null;
    };
    technicien: {
        id: string;
        name: string | null;
        email: string | null;
        prenom: string | null;
    } | null;
    store: {
        id: string;
        nom: string;
    } | null;
    lignesPieces?: ReparationPiece[];
    historique?: ReparationHistorique[];
    _count?: {
        interventions: number;
        historique: number;
    };
}

export interface ReparationPiece {
    id: string;
    reparationId: string;
    articleId: string | null;
    ressourceAtelierId: string | null;
    designation: string;
    quantite: number;
    prixUnitaireHT: number;
    tauxTVA: number;
    article?: {
        id: string;
        nom: string;
        reference: string;
    } | null;
    ressourceAtelier?: {
        id: string;
        nom: string;
    } | null;
}

export interface ReparationHistorique {
    id: string;
    reparationId: string;
    action: string;
    description: string;
    metadata: unknown;
    createdBy: string;
    createdAt: Date;
}

export type ReparationStatut =
    | "DEPOSE"
    | "EN_ATTENTE_DIAGNOSTIC"
    | "EN_DIAGNOSTIC"
    | "DEVIS_ENVOYE"
    | "DEVIS_ACCEPTE"
    | "DEVIS_REFUSE"
    | "EN_ATTENTE_PIECES"
    | "EN_REPARATION"
    | "REPAREE"
    | "PRETE"
    | "RENDUE"
    | "IRREPARABLE"
    | "ABANDONNEE";

export type ReparationPriorite = "BASSE" | "NORMALE" | "HAUTE" | "URGENTE";

export interface ReparationsListResponse {
    items: Reparation[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ReparationCreateData {
    clientId: string;
    typeAppareil: string;
    marque?: string;
    modele?: string;
    numeroSerie?: string;
    motAuthentification?: string;
    panne: string;
    etatVisuel?: string;
    accessoires?: string;
    priorite: ReparationPriorite;
    storeId?: string;
    registerId?: string;
    notesInternes?: string;
    reference?: string;
}

export interface ReparationUpdateData {
    typeAppareil?: string;
    marque?: string;
    modele?: string;
    numeroSerie?: string;
    motAuthentification?: string;
    panne?: string;
    etatVisuel?: string;
    accessoires?: string;
    priorite?: ReparationPriorite;
    dateEstimeeRetour?: Date;
    notesInternes?: string;
    notesTechnicien?: string;
}

export interface ReparationFilters {
    page?: number;
    limit?: number;
    search?: string;
    statut?: ReparationStatut;
    priorite?: ReparationPriorite;
    clientId?: string;
    technicienId?: string;
    storeId?: string;
}

// Query keys
export const reparationKeys = {
    all: ["reparations"] as const,
    lists: () => [...reparationKeys.all, "list"] as const,
    list: (params?: ReparationFilters) =>
        [...reparationKeys.lists(), params] as const,
    details: () => [...reparationKeys.all, "detail"] as const,
    detail: (id: string) => [...reparationKeys.details(), id] as const,
    stats: () => [...reparationKeys.all, "stats"] as const,
};

// Common invalidation keys for mutations
const baseInvalidateKeys = [
    reparationKeys.all,
    reparationKeys.lists(),
    reparationKeys.stats(),
];

// ============================================================================
// QUERY HOOKS
// ============================================================================

export function useReparations(params?: ReparationFilters) {
    return useQuery({
        queryKey: reparationKeys.list(params),
        queryFn: () =>
            api.get<ReparationsListResponse>(
                buildUrl("/api/reparations", params)
            ),
    });
}

export function useReparation(id: string | null) {
    return useQuery({
        queryKey: reparationKeys.detail(id || ""),
        queryFn: () => api.get<Reparation>(`/api/reparations/${id}`),
        enabled: !!id,
    });
}

export function useReparationStats() {
    return useQuery({
        queryKey: reparationKeys.stats(),
        queryFn: () =>
            api.get<{
                total: number;
                enCours: number;
                enAttentePieces: number;
                pretes: number;
                urgentes: number;
            }>("/api/reparations/stats"),
    });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

export function useCreateReparation() {
    return useMutationWithInvalidation<Reparation, ReparationCreateData>({
        mutationFn: (data) => api.post("/api/reparations", data),
        invalidateKeys: baseInvalidateKeys,
        messages: {
            success: "Réparation créée",
            successDescription:
                "La fiche de réparation a été créée avec succès.",
        },
    });
}

export function useUpdateReparation() {
    return useMutationWithInvalidation<
        Reparation,
        { id: string; data: ReparationUpdateData }
    >({
        mutationFn: ({ id, data }) => api.put(`/api/reparations/${id}`, data),
        invalidateKeys: baseInvalidateKeys,
        messages: {
            success: "Réparation mise à jour",
            successDescription: "Les modifications ont été enregistrées.",
        },
    });
}

export function useUpdateReparationStatus() {
    return useMutationWithInvalidation<
        Reparation,
        { id: string; statut: ReparationStatut; notes?: string }
    >({
        mutationFn: ({ id, statut, notes }) =>
            api.post(`/api/reparations/${id}/status`, { statut, notes }),
        invalidateKeys: baseInvalidateKeys,
        messages: {
            success: "Statut mis à jour",
            successDescription: "Le statut de la réparation a été modifié.",
        },
    });
}

export function useAssignTechnician() {
    return useMutationWithInvalidation<
        Reparation,
        { id: string; technicienId: string }
    >({
        mutationFn: ({ id, technicienId }) =>
            api.post(`/api/reparations/${id}/assign`, { technicienId }),
        invalidateKeys: baseInvalidateKeys,
        messages: {
            success: "Technicien assigné",
            successDescription: "Le technicien a été assigné à la réparation.",
        },
    });
}

export function useAddDiagnostic() {
    return useMutationWithInvalidation<
        Reparation,
        { id: string; diagnostic: string; coutEstime?: number }
    >({
        mutationFn: ({ id, diagnostic, coutEstime }) =>
            api.post(`/api/reparations/${id}/diagnostic`, {
                diagnostic,
                coutEstime,
            }),
        invalidateKeys: baseInvalidateKeys,
        messages: {
            success: "Diagnostic enregistré",
            successDescription: "Le diagnostic a été ajouté à la réparation.",
        },
    });
}

export function useDeleteReparation() {
    return useMutationWithInvalidation<void, string>({
        mutationFn: (id) => api.delete(`/api/reparations/${id}`),
        invalidateKeys: baseInvalidateKeys,
        messages: {
            success: "Réparation supprimée",
            successDescription: "La réparation a été supprimée avec succès.",
        },
    });
}

// ============================================================================
// PIECES MUTATION HOOKS
// ============================================================================

interface AddPieceData {
    reparationId: string;
    data: {
        articleId?: string;
        ressourceAtelierId?: string;
        designation: string;
        quantite: number;
        prixUnitaireHT: number;
        tauxTVA: number;
    };
}

export function useAddPiece() {
    return useMutationWithInvalidation<ReparationPiece, AddPieceData>({
        mutationFn: ({ reparationId, data }) =>
            api.post(`/api/reparations/${reparationId}/pieces`, data),
        invalidateKeys: [reparationKeys.all],
        messages: {
            success: "Pièce ajoutée",
            successDescription: "La pièce a été ajoutée à la réparation.",
        },
    });
}

export function useDeletePiece() {
    return useMutationWithInvalidation<
        void,
        { reparationId: string; pieceId: string }
    >({
        mutationFn: ({ reparationId, pieceId }) =>
            api.delete(`/api/reparations/${reparationId}/pieces/${pieceId}`),
        invalidateKeys: [reparationKeys.all],
        messages: {
            success: "Pièce retirée",
            successDescription: "La pièce a été retirée de la réparation.",
        },
    });
}
