import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { VisiteImmobilier, StatutVisite } from "@/lib/generated/prisma";

// Types
export interface VisiteWithRelations extends VisiteImmobilier {
    bien?: {
        id: string;
        reference: string;
        titre: string;
        typeBien: string;
        ville: string;
        adresse: string | null;
        photos: string[];
    };
    visiteur?: {
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
    mandat?: {
        id: string;
        numero: string;
    } | null;
}

export interface VisitesFilters {
    statut?: StatutVisite | "ALL";
    bienId?: string;
    agentId?: string;
    dateFrom?: string;
    dateTo?: string;
    today?: boolean;
    search?: string;
}

export interface CreateVisiteInput {
    bienId: string;
    visiteurId: string;
    mandatId?: string;
    agentId?: string;
    dateVisite: string;
    duree?: number;
    notes?: string;
}

// Query Keys
export const visitesKeys = {
    all: ["visites"] as const,
    list: (filters?: VisitesFilters) => ["visites", "list", filters] as const,
    detail: (id: string) => ["visites", "detail", id] as const,
    today: () => ["visites", "today"] as const,
};

// Hooks
export function useVisites(filters?: VisitesFilters, options?: { enabled?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.statut && filters.statut !== "ALL") {
        params.set("statut", filters.statut);
    }
    if (filters?.bienId) params.set("bienId", filters.bienId);
    if (filters?.agentId) params.set("agentId", filters.agentId);
    if (filters?.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters?.dateTo) params.set("dateTo", filters.dateTo);
    if (filters?.today) params.set("today", "true");

    const queryString = params.toString();
    const url = queryString
        ? `${ENDPOINTS.IMMOBILIER_VISITES}?${queryString}`
        : ENDPOINTS.IMMOBILIER_VISITES;

    return useQuery({
        queryKey: visitesKeys.list(filters),
        queryFn: async () => {
            const result = await api.get<{ visites: VisiteWithRelations[] }>(url);
            return result.visites;
        },
        enabled: options?.enabled !== false,
    });
}

export function useVisite(id: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: visitesKeys.detail(id),
        queryFn: async () => {
            const result = await api.get<{ visite: VisiteWithRelations }>(
                ENDPOINTS.IMMOBILIER_VISITE_BY_ID(id)
            );
            return result.visite;
        },
        enabled: !!id && options?.enabled !== false,
    });
}

export function useVisitesToday(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: visitesKeys.today(),
        queryFn: async () => {
            const result = await api.get<{ visites: VisiteWithRelations[] }>(
                `${ENDPOINTS.IMMOBILIER_VISITES}?today=true`
            );
            return result.visites;
        },
        enabled: options?.enabled !== false,
    });
}

export function useCreateVisite() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateVisiteInput) => {
            const result = await api.post<{ visite: VisiteWithRelations }>(
                ENDPOINTS.IMMOBILIER_VISITES,
                data
            );
            return result.visite;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: visitesKeys.all });
        },
    });
}

export function useUpdateVisite() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<CreateVisiteInput> & { statut?: StatutVisite; compteRendu?: string; noteSatisfaction?: number } }) => {
            const result = await api.put<{ visite: VisiteWithRelations }>(
                ENDPOINTS.IMMOBILIER_VISITE_BY_ID(id),
                data
            );
            return result.visite;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: visitesKeys.all });
            queryClient.invalidateQueries({ queryKey: visitesKeys.detail(id) });
        },
    });
}

export function useCancelVisite() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const result = await api.put<{ visite: VisiteWithRelations }>(
                ENDPOINTS.IMMOBILIER_VISITE_BY_ID(id),
                { statut: "ANNULEE" }
            );
            return result.visite;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: visitesKeys.all });
            queryClient.invalidateQueries({ queryKey: visitesKeys.detail(id) });
        },
    });
}
