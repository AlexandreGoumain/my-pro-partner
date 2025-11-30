import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { EstimationBien } from "@/lib/generated/prisma";

// Types
export interface EstimationWithRelations extends EstimationBien {
    bien?: {
        id: string;
        reference: string;
        titre: string;
        typeBien: string;
        ville: string;
        adresse: string | null;
        surface: number | null;
        nbPieces: number | null;
        photos: string[];
    };
    agent?: {
        id: string;
        prenom: string;
        nom: string;
    } | null;
}

export interface EstimationsFilters {
    bienId?: string;
    agentId?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
}

export interface CreateEstimationInput {
    bienId: string;
    prixEstimeBas: number;
    prixEstimeHaut: number;
    prixRecommande: number;
    methode?: string;
    comparables?: Record<string, unknown>[];
    agentId?: string;
    validiteJours?: number;
    notes?: string;
}

// Query Keys
export const estimationsKeys = {
    all: ["estimations"] as const,
    list: (filters?: EstimationsFilters) => ["estimations", "list", filters] as const,
    detail: (id: string) => ["estimations", "detail", id] as const,
    byBien: (bienId: string) => ["estimations", "bien", bienId] as const,
};

// Hooks
export function useEstimations(filters?: EstimationsFilters, options?: { enabled?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.bienId) params.set("bienId", filters.bienId);
    if (filters?.agentId) params.set("agentId", filters.agentId);
    if (filters?.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters?.dateTo) params.set("dateTo", filters.dateTo);
    if (filters?.search) params.set("search", filters.search);

    const queryString = params.toString();
    const url = queryString
        ? `${ENDPOINTS.IMMOBILIER_ESTIMATIONS}?${queryString}`
        : ENDPOINTS.IMMOBILIER_ESTIMATIONS;

    return useQuery({
        queryKey: estimationsKeys.list(filters),
        queryFn: async () => {
            const result = await api.get<{ estimations: EstimationWithRelations[] }>(url);
            return result.estimations;
        },
        enabled: options?.enabled !== false,
    });
}

export function useEstimation(id: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: estimationsKeys.detail(id),
        queryFn: async () => {
            const result = await api.get<{ estimation: EstimationWithRelations }>(
                `${ENDPOINTS.IMMOBILIER_ESTIMATIONS}/${id}`
            );
            return result.estimation;
        },
        enabled: !!id && options?.enabled !== false,
    });
}

export function useEstimationsByBien(bienId: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: estimationsKeys.byBien(bienId),
        queryFn: async () => {
            const result = await api.get<{ estimations: EstimationWithRelations[] }>(
                `${ENDPOINTS.IMMOBILIER_ESTIMATIONS}?bienId=${bienId}`
            );
            return result.estimations;
        },
        enabled: !!bienId && options?.enabled !== false,
    });
}

export function useCreateEstimation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateEstimationInput) => {
            const result = await api.post<{ estimation: EstimationWithRelations }>(
                ENDPOINTS.IMMOBILIER_ESTIMATIONS,
                data
            );
            return result.estimation;
        },
        onSuccess: (estimation) => {
            queryClient.invalidateQueries({ queryKey: estimationsKeys.all });
            if (estimation.bienId) {
                queryClient.invalidateQueries({ queryKey: estimationsKeys.byBien(estimation.bienId) });
            }
        },
    });
}

export function useUpdateEstimation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<CreateEstimationInput> }) => {
            const result = await api.put<{ estimation: EstimationWithRelations }>(
                `${ENDPOINTS.IMMOBILIER_ESTIMATIONS}/${id}`,
                data
            );
            return result.estimation;
        },
        onSuccess: (estimation, { id }) => {
            queryClient.invalidateQueries({ queryKey: estimationsKeys.all });
            queryClient.invalidateQueries({ queryKey: estimationsKeys.detail(id) });
            if (estimation.bienId) {
                queryClient.invalidateQueries({ queryKey: estimationsKeys.byBien(estimation.bienId) });
            }
        },
    });
}

export function useDeleteEstimation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`${ENDPOINTS.IMMOBILIER_ESTIMATIONS}/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: estimationsKeys.all });
        },
    });
}
