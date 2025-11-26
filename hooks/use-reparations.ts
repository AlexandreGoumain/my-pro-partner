import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { useToast } from "./use-toast";

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

// Build query params from filters
function buildQueryParams(params?: ReparationFilters): string {
    if (!params) return "";
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.statut) queryParams.append("statut", params.statut);
    if (params.priorite) queryParams.append("priorite", params.priorite);
    if (params.clientId) queryParams.append("clientId", params.clientId);
    if (params.technicienId)
        queryParams.append("technicienId", params.technicienId);
    if (params.storeId) queryParams.append("storeId", params.storeId);
    return queryParams.toString();
}

// Hook to fetch all reparations with pagination and filters
export function useReparations(params?: ReparationFilters) {
    return useQuery({
        queryKey: reparationKeys.list(params),
        queryFn: async () => {
            const queryString = buildQueryParams(params);
            return api.get<ReparationsListResponse>(
                `/api/reparations${queryString ? `?${queryString}` : ""}`
            );
        },
    });
}

// Hook to fetch a single reparation by ID
export function useReparation(id: string | null) {
    return useQuery({
        queryKey: reparationKeys.detail(id || ""),
        queryFn: async () => {
            if (!id) throw new Error("ID is required");
            return api.get<Reparation>(`/api/reparations/${id}`);
        },
        enabled: !!id,
    });
}

// Hook to fetch reparation stats
export function useReparationStats() {
    return useQuery({
        queryKey: reparationKeys.stats(),
        queryFn: async () => {
            return api.get<{
                total: number;
                enCours: number;
                enAttentePieces: number;
                pretes: number;
                urgentes: number;
            }>("/api/reparations/stats");
        },
    });
}

// Hook to create a new reparation
export function useCreateReparation() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (data: ReparationCreateData) =>
            api.post<Reparation>("/api/reparations", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reparationKeys.lists() });
            queryClient.invalidateQueries({ queryKey: reparationKeys.stats() });
            toast({
                title: "Réparation créée",
                description: "La fiche de réparation a été créée avec succès.",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Erreur",
                description:
                    error.message || "Impossible de créer la réparation",
                variant: "destructive",
            });
        },
    });
}

// Hook to update a reparation
export function useUpdateReparation() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: ReparationUpdateData;
        }) => api.put<Reparation>(`/api/reparations/${id}`, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: reparationKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: reparationKeys.detail(id),
            });
            toast({
                title: "Réparation mise à jour",
                description: "Les modifications ont été enregistrées.",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Erreur",
                description:
                    error.message || "Impossible de mettre à jour la réparation",
                variant: "destructive",
            });
        },
    });
}

// Hook to update reparation status
export function useUpdateReparationStatus() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({
            id,
            statut,
            notes,
        }: {
            id: string;
            statut: ReparationStatut;
            notes?: string;
        }) =>
            api.post<Reparation>(`/api/reparations/${id}/status`, {
                statut,
                notes,
            }),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: reparationKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: reparationKeys.detail(id),
            });
            queryClient.invalidateQueries({ queryKey: reparationKeys.stats() });
            toast({
                title: "Statut mis à jour",
                description: "Le statut de la réparation a été modifié.",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Erreur",
                description:
                    error.message || "Impossible de modifier le statut",
                variant: "destructive",
            });
        },
    });
}

// Hook to assign a technician
export function useAssignTechnician() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({
            id,
            technicienId,
        }: {
            id: string;
            technicienId: string;
        }) =>
            api.post<Reparation>(`/api/reparations/${id}/assign`, {
                technicienId,
            }),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: reparationKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: reparationKeys.detail(id),
            });
            toast({
                title: "Technicien assigné",
                description: "Le technicien a été assigné à la réparation.",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Erreur",
                description:
                    error.message || "Impossible d'assigner le technicien",
                variant: "destructive",
            });
        },
    });
}

// Hook to add diagnostic
export function useAddDiagnostic() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({
            id,
            diagnostic,
            coutEstime,
        }: {
            id: string;
            diagnostic: string;
            coutEstime?: number;
        }) =>
            api.post<Reparation>(`/api/reparations/${id}/diagnostic`, {
                diagnostic,
                coutEstime,
            }),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: reparationKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: reparationKeys.detail(id),
            });
            toast({
                title: "Diagnostic enregistré",
                description: "Le diagnostic a été ajouté à la réparation.",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Erreur",
                description:
                    error.message || "Impossible d'enregistrer le diagnostic",
                variant: "destructive",
            });
        },
    });
}

// Hook to delete a reparation
export function useDeleteReparation() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (id: string) => api.delete(`/api/reparations/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reparationKeys.lists() });
            queryClient.invalidateQueries({ queryKey: reparationKeys.stats() });
            toast({
                title: "Réparation supprimée",
                description: "La réparation a été supprimée avec succès.",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Erreur",
                description:
                    error.message || "Impossible de supprimer la réparation",
                variant: "destructive",
            });
        },
    });
}

// Hook to manage pieces
export function useAddPiece() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({
            reparationId,
            data,
        }: {
            reparationId: string;
            data: {
                articleId?: string;
                ressourceAtelierId?: string;
                designation: string;
                quantite: number;
                prixUnitaireHT: number;
                tauxTVA: number;
            };
        }) =>
            api.post<ReparationPiece>(
                `/api/reparations/${reparationId}/pieces`,
                data
            ),
        onSuccess: (_, { reparationId }) => {
            queryClient.invalidateQueries({
                queryKey: reparationKeys.detail(reparationId),
            });
            toast({
                title: "Pièce ajoutée",
                description: "La pièce a été ajoutée à la réparation.",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Erreur",
                description: error.message || "Impossible d'ajouter la pièce",
                variant: "destructive",
            });
        },
    });
}

export function useDeletePiece() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({
            reparationId,
            pieceId,
        }: {
            reparationId: string;
            pieceId: string;
        }) => api.delete(`/api/reparations/${reparationId}/pieces/${pieceId}`),
        onSuccess: (_, { reparationId }) => {
            queryClient.invalidateQueries({
                queryKey: reparationKeys.detail(reparationId),
            });
            toast({
                title: "Pièce retirée",
                description: "La pièce a été retirée de la réparation.",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Erreur",
                description: error.message || "Impossible de retirer la pièce",
                variant: "destructive",
            });
        },
    });
}
