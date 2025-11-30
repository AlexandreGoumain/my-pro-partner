import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { DiffusionAnnonce, PortailDiffusion, StatutDiffusion, TypeAnnonce } from "@/lib/generated/prisma";

// Types
export interface DiffusionWithRelations extends DiffusionAnnonce {
    bien?: {
        id: string;
        reference: string;
        titre: string;
        typeBien: string;
        ville: string;
        prixVente: number | null;
        photos: string[];
    };
    _count?: {
        leads: number;
    };
}

export interface DiffusionsFilters {
    bienId?: string;
    portail?: PortailDiffusion | "ALL";
    statut?: StatutDiffusion | "ALL";
    search?: string;
}

export interface CreateDiffusionInput {
    bienId: string;
    portails: PortailDiffusion[];
    typeAnnonce?: TypeAnnonce;
    titre?: string;
    description?: string;
    photos?: string[];
}

export interface DiffusionStats {
    total: number;
    active: number;
    enAttente: number;
    expiree: number;
    portailsUtilises: number;
    totalLeads: number;
}

// Query Keys
export const diffusionsKeys = {
    all: ["diffusions"] as const,
    list: (filters?: DiffusionsFilters) => ["diffusions", "list", filters] as const,
    detail: (id: string) => ["diffusions", "detail", id] as const,
    byBien: (bienId: string) => ["diffusions", "bien", bienId] as const,
    stats: () => ["diffusions", "stats"] as const,
};

// Hooks
export function useDiffusions(filters?: DiffusionsFilters, options?: { enabled?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.bienId) params.set("bienId", filters.bienId);
    if (filters?.portail && filters.portail !== "ALL") {
        params.set("portail", filters.portail);
    }
    if (filters?.statut && filters.statut !== "ALL") {
        params.set("statut", filters.statut);
    }

    const queryString = params.toString();
    const url = queryString
        ? `${ENDPOINTS.IMMOBILIER_DIFFUSION}?${queryString}`
        : ENDPOINTS.IMMOBILIER_DIFFUSION;

    return useQuery({
        queryKey: diffusionsKeys.list(filters),
        queryFn: async () => {
            const result = await api.get<{ diffusions: DiffusionWithRelations[] }>(url);
            return result.diffusions;
        },
        enabled: options?.enabled !== false,
    });
}

export function useDiffusion(id: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: diffusionsKeys.detail(id),
        queryFn: async () => {
            const result = await api.get<{ diffusion: DiffusionWithRelations }>(
                `${ENDPOINTS.IMMOBILIER_DIFFUSION}/${id}`
            );
            return result.diffusion;
        },
        enabled: !!id && options?.enabled !== false,
    });
}

export function useDiffusionsByBien(bienId: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: diffusionsKeys.byBien(bienId),
        queryFn: async () => {
            const result = await api.get<{ diffusions: DiffusionWithRelations[] }>(
                `${ENDPOINTS.IMMOBILIER_DIFFUSION}?bienId=${bienId}`
            );
            return result.diffusions;
        },
        enabled: !!bienId && options?.enabled !== false,
    });
}

export function useDiffusionStats(options?: { enabled?: boolean }) {
    const { data: diffusions = [] } = useDiffusions(undefined, options);

    const stats: DiffusionStats = {
        total: diffusions.length,
        active: diffusions.filter(d => d.statut === "ACTIVE").length,
        enAttente: diffusions.filter(d => d.statut === "EN_ATTENTE").length,
        expiree: diffusions.filter(d => d.statut === "EXPIREE").length,
        portailsUtilises: new Set(diffusions.map(d => d.portail)).size,
        totalLeads: diffusions.reduce((acc, d) => acc + (d._count?.leads || 0), 0),
    };

    return stats;
}

export function useCreateDiffusion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateDiffusionInput) => {
            const result = await api.post<{ diffusions: DiffusionWithRelations[] }>(
                ENDPOINTS.IMMOBILIER_DIFFUSION,
                data
            );
            return result.diffusions;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: diffusionsKeys.all });
        },
    });
}

export function useSyncDiffusion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const result = await api.post<{ diffusion: DiffusionWithRelations }>(
                `${ENDPOINTS.IMMOBILIER_DIFFUSION}/${id}/sync`,
                {}
            );
            return result.diffusion;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: diffusionsKeys.all });
            queryClient.invalidateQueries({ queryKey: diffusionsKeys.detail(id) });
        },
    });
}

export function useDepublishDiffusion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const result = await api.put<{ diffusion: DiffusionWithRelations }>(
                `${ENDPOINTS.IMMOBILIER_DIFFUSION}/${id}`,
                { statut: "RETIREE" }
            );
            return result.diffusion;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: diffusionsKeys.all });
            queryClient.invalidateQueries({ queryKey: diffusionsKeys.detail(id) });
        },
    });
}
