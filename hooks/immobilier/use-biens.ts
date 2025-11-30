import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type {
    BienImmobilier,
    TypeBien,
    StatutBien,
} from "@/lib/generated/prisma";

// Types
export interface BienWithRelations extends BienImmobilier {
    proprietaire?: {
        id: string;
        nom: string;
        prenom: string | null;
        telephone: string | null;
        email: string | null;
    } | null;
    mandats?: { statut: string }[];
    _count?: {
        visites: number;
        diffusions: number;
    };
}

export interface BiensFilters {
    typeBien?: TypeBien | "ALL";
    statut?: StatutBien | "ALL";
    ville?: string;
    search?: string;
    prixMin?: number;
    prixMax?: number;
    surfaceMin?: number;
}

export interface CreateBienInput {
    titre: string;
    description?: string;
    typeBien: TypeBien;
    statut?: StatutBien;
    adresse?: string;
    codePostal?: string;
    ville?: string;
    pays?: string;
    surface?: number;
    surfaceTerrain?: number;
    nbPieces?: number;
    nbChambres?: number;
    nbSallesBains?: number;
    etage?: number;
    nbEtages?: number;
    ascenseur?: boolean;
    balcon?: boolean;
    terrasse?: boolean;
    jardin?: boolean;
    parking?: boolean;
    garage?: boolean;
    cave?: boolean;
    piscine?: boolean;
    anneeConstruction?: number;
    dpe?: string;
    ges?: string;
    prix?: number;
    chargesMensuelles?: number;
    taxeFonciere?: number;
    proprietaireId?: string;
    photos?: string[];
}

// Query Keys
export const biensKeys = {
    all: ["biens"] as const,
    list: (filters?: BiensFilters) => ["biens", "list", filters] as const,
    detail: (id: string) => ["biens", "detail", id] as const,
};

// Hooks
export function useBiens(filters?: BiensFilters, options?: { enabled?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.typeBien && filters.typeBien !== "ALL") {
        params.set("typeBien", filters.typeBien);
    }
    if (filters?.statut && filters.statut !== "ALL") {
        params.set("statut", filters.statut);
    }
    if (filters?.ville) params.set("ville", filters.ville);
    if (filters?.search) params.set("search", filters.search);
    if (filters?.prixMin) params.set("prixMin", String(filters.prixMin));
    if (filters?.prixMax) params.set("prixMax", String(filters.prixMax));
    if (filters?.surfaceMin) params.set("surfaceMin", String(filters.surfaceMin));

    const queryString = params.toString();
    const url = queryString
        ? `${ENDPOINTS.IMMOBILIER_BIENS}?${queryString}`
        : ENDPOINTS.IMMOBILIER_BIENS;

    return useQuery({
        queryKey: biensKeys.list(filters),
        queryFn: async () => {
            const result = await api.get<{ biens: BienWithRelations[] }>(url);
            return result.biens;
        },
        enabled: options?.enabled !== false,
    });
}

export function useBien(id: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: biensKeys.detail(id),
        queryFn: async () => {
            const result = await api.get<{ bien: BienWithRelations }>(
                ENDPOINTS.IMMOBILIER_BIEN_BY_ID(id)
            );
            return result.bien;
        },
        enabled: !!id && options?.enabled !== false,
    });
}

export function useCreateBien() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateBienInput) => {
            const result = await api.post<{ bien: BienWithRelations }>(
                ENDPOINTS.IMMOBILIER_BIENS,
                data
            );
            return result.bien;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: biensKeys.all });
        },
    });
}

export function useUpdateBien() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<CreateBienInput> }) => {
            const result = await api.put<{ bien: BienWithRelations }>(
                ENDPOINTS.IMMOBILIER_BIEN_BY_ID(id),
                data
            );
            return result.bien;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: biensKeys.all });
            queryClient.invalidateQueries({ queryKey: biensKeys.detail(id) });
        },
    });
}

export function useDeleteBien() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(ENDPOINTS.IMMOBILIER_BIEN_BY_ID(id));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: biensKeys.all });
        },
    });
}
