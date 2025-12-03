import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { TravauxCopropriete, StatutTravauxCopro } from "@/lib/generated/prisma";

// Types
export interface TravauxWithRelations extends Omit<TravauxCopropriete, 'assembleeVote'> {
    copropriete?: {
        id: string;
        nom: string;
        adresse: string;
    };
    entreprise?: {
        id: string;
        nom: string;
        telephone: string | null;
    } | null;
    assembleeVote?: {
        id: string;
        dateAG: string;
    } | null;
}

export interface TravauxFilters {
    coproprieteId?: string;
    statut?: StatutTravauxCopro | "ALL";
    categorie?: string;
    annee?: number;
    search?: string;
}

export interface CreateTravauxInput {
    coproprieteId: string;
    titre: string;
    description?: string;
    categorie: string;
    budgetEstime?: number;
    budgetVote?: number;
    dateDebutPrevue?: string;
    dateFinPrevue?: string;
    entrepriseId?: string;
    assembleeVoteId?: string;
    notes?: string;
}

// Query Keys
export const travauxKeys = {
    all: ["travaux-copro"] as const,
    list: (filters?: TravauxFilters) => ["travaux-copro", "list", filters] as const,
    detail: (id: string) => ["travaux-copro", "detail", id] as const,
    byCopropriete: (coproprieteId: string) => ["travaux-copro", "copropriete", coproprieteId] as const,
    enCours: () => ["travaux-copro", "en-cours"] as const,
};

// Hooks
export function useTravauxCopro(filters?: TravauxFilters, options?: { enabled?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.coproprieteId) params.set("coproprieteId", filters.coproprieteId);
    if (filters?.statut && filters.statut !== "ALL") {
        params.set("statut", filters.statut);
    }
    if (filters?.categorie) params.set("categorie", filters.categorie);
    if (filters?.annee) params.set("annee", String(filters.annee));
    if (filters?.search) params.set("search", filters.search);

    const queryString = params.toString();
    const url = queryString
        ? `${ENDPOINTS.SYNDIC_TRAVAUX}?${queryString}`
        : ENDPOINTS.SYNDIC_TRAVAUX;

    return useQuery({
        queryKey: travauxKeys.list(filters),
        queryFn: async () => {
            const result = await api.get<{ travaux: TravauxWithRelations[] }>(url);
            return result.travaux;
        },
        enabled: options?.enabled !== false,
    });
}

export function useTravaux(id: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: travauxKeys.detail(id),
        queryFn: async () => {
            const result = await api.get<{ travaux: TravauxWithRelations }>(
                `${ENDPOINTS.SYNDIC_TRAVAUX}/${id}`
            );
            return result.travaux;
        },
        enabled: !!id && options?.enabled !== false,
    });
}

export function useTravauxByCopropriete(coproprieteId: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: travauxKeys.byCopropriete(coproprieteId),
        queryFn: async () => {
            const result = await api.get<{ travaux: TravauxWithRelations[] }>(
                `${ENDPOINTS.SYNDIC_TRAVAUX}?coproprieteId=${coproprieteId}`
            );
            return result.travaux;
        },
        enabled: !!coproprieteId && options?.enabled !== false,
    });
}

export function useTravauxEnCours(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: travauxKeys.enCours(),
        queryFn: async () => {
            const result = await api.get<{ travaux: TravauxWithRelations[] }>(
                `${ENDPOINTS.SYNDIC_TRAVAUX}?statut=EN_COURS`
            );
            return result.travaux;
        },
        enabled: options?.enabled !== false,
    });
}

export function useCreateTravaux() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateTravauxInput) => {
            const result = await api.post<{ travaux: TravauxWithRelations }>(
                ENDPOINTS.SYNDIC_TRAVAUX,
                data
            );
            return result.travaux;
        },
        onSuccess: (travaux) => {
            queryClient.invalidateQueries({ queryKey: travauxKeys.all });
            if (travaux.coproprieteId) {
                queryClient.invalidateQueries({ queryKey: travauxKeys.byCopropriete(travaux.coproprieteId) });
            }
        },
    });
}

export function useUpdateTravaux() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<CreateTravauxInput> & { statut?: StatutTravauxCopro; coutFinal?: number; dateDebutReelle?: string; dateFinReelle?: string } }) => {
            const result = await api.put<{ travaux: TravauxWithRelations }>(
                `${ENDPOINTS.SYNDIC_TRAVAUX}/${id}`,
                data
            );
            return result.travaux;
        },
        onSuccess: (travaux, { id }) => {
            queryClient.invalidateQueries({ queryKey: travauxKeys.all });
            queryClient.invalidateQueries({ queryKey: travauxKeys.detail(id) });
            if (travaux.coproprieteId) {
                queryClient.invalidateQueries({ queryKey: travauxKeys.byCopropriete(travaux.coproprieteId) });
            }
        },
    });
}

export function useDeleteTravaux() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`${ENDPOINTS.SYNDIC_TRAVAUX}/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: travauxKeys.all });
        },
    });
}
