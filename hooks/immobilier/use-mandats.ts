import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type {
    MandatImmobilier,
    TypeMandat,
    StatutMandat,
} from "@/lib/generated/prisma";

// Types
export interface MandatWithRelations extends MandatImmobilier {
    bien?: {
        id: string;
        reference: string;
        titre: string;
        typeBien: string;
        ville: string;
        prix: number | null;
        photos: string[];
    };
    mandant?: {
        id: string;
        nom: string;
        prenom: string | null;
        telephone: string | null;
        email: string | null;
    };
    agent?: {
        id: string;
        prenom: string;
        nom: string;
    } | null;
}

export interface MandatsFilters {
    typeMandat?: TypeMandat | "ALL";
    statut?: StatutMandat | "ALL";
    bienId?: string;
    search?: string;
    expiresSoon?: boolean;
}

export interface CreateMandatInput {
    bienId: string;
    mandantId: string;
    typeMandat?: TypeMandat;
    dateDebut?: string;
    dureeMois?: number;
    prixMandat?: number;
    honorairesVendeur?: number;
    honorairesAcquereur?: number;
    agentId?: string;
    notes?: string;
}

// Query Keys
export const mandatsKeys = {
    all: ["mandats"] as const,
    list: (filters?: MandatsFilters) => ["mandats", "list", filters] as const,
    detail: (id: string) => ["mandats", "detail", id] as const,
    expiring: () => ["mandats", "expiring"] as const,
};

// Hooks
export function useMandats(filters?: MandatsFilters, options?: { enabled?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.typeMandat && filters.typeMandat !== "ALL") {
        params.set("typeMandat", filters.typeMandat);
    }
    if (filters?.statut && filters.statut !== "ALL") {
        params.set("statut", filters.statut);
    }
    if (filters?.bienId) params.set("bienId", filters.bienId);
    if (filters?.search) params.set("search", filters.search);
    if (filters?.expiresSoon) params.set("expiresSoon", "true");

    const queryString = params.toString();
    const url = queryString
        ? `${ENDPOINTS.IMMOBILIER_MANDATS}?${queryString}`
        : ENDPOINTS.IMMOBILIER_MANDATS;

    return useQuery({
        queryKey: mandatsKeys.list(filters),
        queryFn: async () => {
            const result = await api.get<{ mandats: MandatWithRelations[] }>(url);
            return result.mandats;
        },
        enabled: options?.enabled !== false,
    });
}

export function useMandat(id: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: mandatsKeys.detail(id),
        queryFn: async () => {
            const result = await api.get<{ mandat: MandatWithRelations }>(
                ENDPOINTS.IMMOBILIER_MANDAT_BY_ID(id)
            );
            return result.mandat;
        },
        enabled: !!id && options?.enabled !== false,
    });
}

export function useMandatsExpiring(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: mandatsKeys.expiring(),
        queryFn: async () => {
            const result = await api.get<{ mandats: MandatWithRelations[] }>(
                `${ENDPOINTS.IMMOBILIER_MANDATS}?expiresSoon=true`
            );
            return result.mandats;
        },
        enabled: options?.enabled !== false,
    });
}

export function useCreateMandat() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateMandatInput) => {
            const result = await api.post<{ mandat: MandatWithRelations }>(
                ENDPOINTS.IMMOBILIER_MANDATS,
                data
            );
            return result.mandat;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: mandatsKeys.all });
        },
    });
}

export function useUpdateMandat() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<CreateMandatInput> }) => {
            const result = await api.put<{ mandat: MandatWithRelations }>(
                ENDPOINTS.IMMOBILIER_MANDAT_BY_ID(id),
                data
            );
            return result.mandat;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: mandatsKeys.all });
            queryClient.invalidateQueries({ queryKey: mandatsKeys.detail(id) });
        },
    });
}
