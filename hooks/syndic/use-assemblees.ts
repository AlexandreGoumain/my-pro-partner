import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { AssembleeGenerale, TypeAG, StatutAG } from "@/lib/generated/prisma";

// Types
export interface AssembleeWithRelations extends AssembleeGenerale {
    copropriete?: {
        id: string;
        nom: string;
        adresse: string;
    };
    resolutions?: {
        id: string;
        numero: number;
        titre: string;
        typeVote: string;
        resultat: string | null;
    }[];
}

export interface AssembleesFilters {
    coproprieteId?: string;
    typeAG?: TypeAG | "ALL";
    statut?: StatutAG | "ALL";
    annee?: number;
    search?: string;
}

export interface CreateAssembleeInput {
    coproprieteId: string;
    typeAG?: TypeAG;
    dateAG: string;
    heureDebut: string;
    lieu: string;
    ordreJour?: Record<string, unknown>[];
    dateConvocation?: string;
    delaiConvocation?: number;
    notes?: string;
}

// Query Keys
export const assembleesKeys = {
    all: ["assemblees"] as const,
    list: (filters?: AssembleesFilters) => ["assemblees", "list", filters] as const,
    detail: (id: string) => ["assemblees", "detail", id] as const,
    byCopropriete: (coproprieteId: string) => ["assemblees", "copropriete", coproprieteId] as const,
    prochaines: () => ["assemblees", "prochaines"] as const,
};

// Hooks
export function useAssemblees(filters?: AssembleesFilters, options?: { enabled?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.coproprieteId) params.set("coproprieteId", filters.coproprieteId);
    if (filters?.typeAG && filters.typeAG !== "ALL") {
        params.set("typeAG", filters.typeAG);
    }
    if (filters?.statut && filters.statut !== "ALL") {
        params.set("statut", filters.statut);
    }
    if (filters?.annee) params.set("annee", String(filters.annee));
    if (filters?.search) params.set("search", filters.search);

    const queryString = params.toString();
    const url = queryString
        ? `${ENDPOINTS.SYNDIC_AG}?${queryString}`
        : ENDPOINTS.SYNDIC_AG;

    return useQuery({
        queryKey: assembleesKeys.list(filters),
        queryFn: async () => {
            const result = await api.get<{ assemblees: AssembleeWithRelations[] }>(url);
            return result.assemblees;
        },
        enabled: options?.enabled !== false,
    });
}

export function useAssemblee(id: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: assembleesKeys.detail(id),
        queryFn: async () => {
            const result = await api.get<{ assemblee: AssembleeWithRelations }>(
                `${ENDPOINTS.SYNDIC_AG}/${id}`
            );
            return result.assemblee;
        },
        enabled: !!id && options?.enabled !== false,
    });
}

export function useAssembleesByCopropriete(coproprieteId: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: assembleesKeys.byCopropriete(coproprieteId),
        queryFn: async () => {
            const result = await api.get<{ assemblees: AssembleeWithRelations[] }>(
                `${ENDPOINTS.SYNDIC_AG}?coproprieteId=${coproprieteId}`
            );
            return result.assemblees;
        },
        enabled: !!coproprieteId && options?.enabled !== false,
    });
}

export function useAssembleesProchaines(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: assembleesKeys.prochaines(),
        queryFn: async () => {
            const result = await api.get<{ assemblees: AssembleeWithRelations[] }>(
                `${ENDPOINTS.SYNDIC_AG}?statut=PLANIFIEE`
            );
            return result.assemblees;
        },
        enabled: options?.enabled !== false,
    });
}

export function useCreateAssemblee() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateAssembleeInput) => {
            const result = await api.post<{ assemblee: AssembleeWithRelations }>(
                ENDPOINTS.SYNDIC_AG,
                data
            );
            return result.assemblee;
        },
        onSuccess: (assemblee) => {
            queryClient.invalidateQueries({ queryKey: assembleesKeys.all });
            if (assemblee.coproprieteId) {
                queryClient.invalidateQueries({ queryKey: assembleesKeys.byCopropriete(assemblee.coproprieteId) });
            }
        },
    });
}

export function useUpdateAssemblee() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<CreateAssembleeInput> & { statut?: StatutAG } }) => {
            const result = await api.put<{ assemblee: AssembleeWithRelations }>(
                `${ENDPOINTS.SYNDIC_AG}/${id}`,
                data
            );
            return result.assemblee;
        },
        onSuccess: (assemblee, { id }) => {
            queryClient.invalidateQueries({ queryKey: assembleesKeys.all });
            queryClient.invalidateQueries({ queryKey: assembleesKeys.detail(id) });
            if (assemblee.coproprieteId) {
                queryClient.invalidateQueries({ queryKey: assembleesKeys.byCopropriete(assemblee.coproprieteId) });
            }
        },
    });
}

export function useEnvoyerConvocations() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const result = await api.post<{ assemblee: AssembleeWithRelations }>(
                `${ENDPOINTS.SYNDIC_AG}/${id}/convoquer`,
                {}
            );
            return result.assemblee;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: assembleesKeys.all });
            queryClient.invalidateQueries({ queryKey: assembleesKeys.detail(id) });
        },
    });
}

export function useCloturerAssemblee() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: { nbPresents: number; nbRepresentes: number; tantièmesPresents: number } }) => {
            const result = await api.put<{ assemblee: AssembleeWithRelations }>(
                `${ENDPOINTS.SYNDIC_AG}/${id}`,
                { ...data, statut: "TERMINEE" }
            );
            return result.assemblee;
        },
        onSuccess: (assemblee, { id }) => {
            queryClient.invalidateQueries({ queryKey: assembleesKeys.all });
            queryClient.invalidateQueries({ queryKey: assembleesKeys.detail(id) });
            if (assemblee.coproprieteId) {
                queryClient.invalidateQueries({ queryKey: assembleesKeys.byCopropriete(assemblee.coproprieteId) });
            }
        },
    });
}
