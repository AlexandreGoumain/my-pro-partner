import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { useToast } from "./use-toast";

// Types
export type TypeRessource =
    | "ECRAN"
    | "BATTERIE"
    | "CARTE_MERE"
    | "CAMERA"
    | "HAUT_PARLEUR"
    | "CONNECTEUR_CHARGE"
    | "VITRE"
    | "CHASSIS"
    | "MEMOIRE_RAM"
    | "DISQUE_DUR"
    | "ALIMENTATION"
    | "VENTILATEUR"
    | "CLAVIER"
    | "TRACKPAD"
    | "AUTRE";

export type EtatPiece =
    | "COMME_NEUF"
    | "TRES_BON"
    | "BON"
    | "CORRECT"
    | "POUR_PIECES";

export interface RessourceInput {
    typeRessource: TypeRessource;
    nom: string;
    description?: string;
    etat: EtatPiece;
    quantite: number;
    marque?: string;
    modele?: string;
    reference?: string;
    notes?: string;
}

export interface ArticlePiece {
    id: string;
    reference: string;
    nom: string;
    description: string | null;
    type: string;
    prix_ht: number;
    tva_taux: number;
    stock_actuel: number;
    typePiece: TypeRessource | null;
    etatPiece: EtatPiece | null;
    marque: string | null;
    modele: string | null;
    valeurEstimee: number | null;
    createdAt: Date;
}

export interface ArticleSource {
    id: string;
    reference: string;
    nom: string;
    description: string | null;
    type: string;
    prix_ht: number;
    categorie: {
        id: string;
        nom: string;
    } | null;
    piecesDetachees: ArticlePiece[];
    rachat: {
        id: string;
        prixRachat: number;
        notes: string | null;
    } | null;
}

export interface Demontage {
    id: string;
    articleSourceId: string;
    motif: string | null;
    notes: string | null;
    dateDemontage: Date;
    entrepriseId: string;
    createdAt: Date;
    updatedAt: Date;
    articleSource: ArticleSource;
}

export interface DemontagesListResponse {
    items: Demontage[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface DemontageCreateData {
    articleSourceId: string;
    motif?: string;
    notes?: string;
    ressources: RessourceInput[];
}

export interface DemontageFilters {
    page?: number;
    limit?: number;
}

// Query keys
export const demontageKeys = {
    all: ["demontages"] as const,
    lists: () => [...demontageKeys.all, "list"] as const,
    list: (params?: DemontageFilters) =>
        [...demontageKeys.lists(), params] as const,
    details: () => [...demontageKeys.all, "detail"] as const,
    detail: (id: string) => [...demontageKeys.details(), id] as const,
};

// Build query params from filters
function buildQueryParams(params?: DemontageFilters): string {
    if (!params) return "";
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    return queryParams.toString();
}

// Hook to fetch all demontages with pagination
export function useDemontages(params?: DemontageFilters) {
    return useQuery({
        queryKey: demontageKeys.list(params),
        queryFn: async () => {
            const queryString = buildQueryParams(params);
            return api.get<DemontagesListResponse>(
                `/api/demontage${queryString ? `?${queryString}` : ""}`
            );
        },
    });
}

// Hook to fetch a single demontage by ID
export function useDemontage(id: string | null) {
    return useQuery({
        queryKey: demontageKeys.detail(id || ""),
        queryFn: async () => {
            if (!id) throw new Error("ID is required");
            return api.get<Demontage>(`/api/demontage/${id}`);
        },
        enabled: !!id,
    });
}

// Hook to create a new demontage
export function useCreateDemontage() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (data: DemontageCreateData) =>
            api.post<{ demontage: Demontage; pieces: ArticlePiece[] }>(
                "/api/demontage",
                data
            ),
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: demontageKeys.lists() });
            // Invalidate articles as well since pieces are created as articles
            queryClient.invalidateQueries({ queryKey: ["articles"] });
            toast({
                title: "Démontage créé",
                description: `${result.pieces.length} pièce(s) détachée(s) créée(s) avec succès.`,
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Erreur",
                description:
                    error.message || "Impossible de créer le démontage",
                variant: "destructive",
            });
        },
    });
}

// Hook to delete a demontage
export function useDeleteDemontage() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (id: string) => api.delete(`/api/demontage/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: demontageKeys.lists() });
            // Invalidate articles as well since pieces are deleted and source restored
            queryClient.invalidateQueries({ queryKey: ["articles"] });
            toast({
                title: "Démontage supprimé",
                description:
                    "Le démontage a été annulé et l'article source restauré.",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Erreur",
                description:
                    error.message || "Impossible de supprimer le démontage",
                variant: "destructive",
            });
        },
    });
}
