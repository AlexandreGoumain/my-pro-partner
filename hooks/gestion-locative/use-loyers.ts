import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { AppelLoyer, StatutLoyer } from "@/lib/generated/prisma";

// Types
export interface LoyerWithRelations extends AppelLoyer {
    bail?: {
        id: string;
        reference: string;
        bien?: {
            id: string;
            reference: string;
            titre: string;
            adresse: string;
            ville: string;
        };
        locatairePrincipal?: {
            id: string;
            nom: string;
            prenom: string | null;
            telephone: string | null;
            email: string | null;
        };
        proprietaire?: {
            id: string;
            nom: string;
            prenom: string | null;
        };
    };
}

export interface LoyersFilters {
    bailId?: string;
    statut?: StatutLoyer | "ALL";
    mois?: number;
    annee?: number;
    impayes?: boolean;
}

export interface CreateLoyersInput {
    mois?: number;
    annee?: number;
    bailId?: string; // Optional: generate for specific bail only
}

export interface EnregistrerPaiementInput {
    montant: number;
    datePaiement?: string;
    modePaiement?: string;
    reference?: string;
}

// Query Keys
export const loyersKeys = {
    all: ["loyers"] as const,
    list: (filters?: LoyersFilters) => ["loyers", "list", filters] as const,
    detail: (id: string) => ["loyers", "detail", id] as const,
    impayes: () => ["loyers", "impayes"] as const,
    stats: (annee?: number) => ["loyers", "stats", annee] as const,
};

// Hooks
export function useLoyers(filters?: LoyersFilters, options?: { enabled?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.bailId) params.set("bailId", filters.bailId);
    if (filters?.statut && filters.statut !== "ALL") {
        params.set("statut", filters.statut);
    }
    if (filters?.mois) params.set("mois", filters.mois.toString());
    if (filters?.annee) params.set("annee", filters.annee.toString());
    if (filters?.impayes) params.set("impayes", "true");

    const queryString = params.toString();
    const url = queryString
        ? `${ENDPOINTS.GESTION_LOCATIVE_LOYERS}?${queryString}`
        : ENDPOINTS.GESTION_LOCATIVE_LOYERS;

    return useQuery({
        queryKey: loyersKeys.list(filters),
        queryFn: async () => {
            const result = await api.get<{ loyers: LoyerWithRelations[] }>(url);
            return result.loyers;
        },
        enabled: options?.enabled !== false,
    });
}

export function useLoyer(id: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: loyersKeys.detail(id),
        queryFn: async () => {
            const result = await api.get<{ loyer: LoyerWithRelations }>(
                `${ENDPOINTS.GESTION_LOCATIVE_LOYERS}/${id}`
            );
            return result.loyer;
        },
        enabled: !!id && options?.enabled !== false,
    });
}

export function useLoyersImpayes(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: loyersKeys.impayes(),
        queryFn: async () => {
            const result = await api.get<{ loyers: LoyerWithRelations[] }>(
                `${ENDPOINTS.GESTION_LOCATIVE_LOYERS}?impayes=true`
            );
            return result.loyers;
        },
        enabled: options?.enabled !== false,
    });
}

export function useGenerateLoyers() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateLoyersInput) => {
            const result = await api.post<{ loyers: LoyerWithRelations[]; message: string }>(
                ENDPOINTS.GESTION_LOCATIVE_LOYERS,
                data
            );
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: loyersKeys.all });
        },
    });
}

export function useEnregistrerPaiement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: EnregistrerPaiementInput }) => {
            const result = await api.patch<{ loyer: LoyerWithRelations }>(
                `${ENDPOINTS.GESTION_LOCATIVE_LOYERS}/${id}/paiement`,
                data
            );
            return result.loyer;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: loyersKeys.all });
            queryClient.invalidateQueries({ queryKey: loyersKeys.detail(id) });
        },
    });
}

export function useEnvoyerLoyer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const result = await api.patch<{ loyer: LoyerWithRelations }>(
                `${ENDPOINTS.GESTION_LOCATIVE_LOYERS}/${id}/envoyer`,
                {}
            );
            return result.loyer;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: loyersKeys.all });
            queryClient.invalidateQueries({ queryKey: loyersKeys.detail(id) });
        },
    });
}

export function useGenererQuittance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const result = await api.post<{ quittanceUrl: string }>(
                `${ENDPOINTS.GESTION_LOCATIVE_LOYERS}/${id}/quittance`,
                {}
            );
            return result.quittanceUrl;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: loyersKeys.detail(id) });
        },
    });
}
