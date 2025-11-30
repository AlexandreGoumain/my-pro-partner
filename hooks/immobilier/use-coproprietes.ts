import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { Copropriete } from "@/lib/generated/prisma";

// Types
export interface CoproprieteWithRelations extends Copropriete {
    _count?: {
        lots: number;
        appelsCharges: number;
        assemblees: number;
        travaux: number;
    };
}

export interface CoproprietesFilters {
    search?: string;
    ville?: string;
}

export interface CreateCoproprieteInput {
    nom: string;
    adresse: string;
    codePostal?: string;
    ville?: string;
    nbLots?: number;
    nbBatiments?: number;
    anneeConstruction?: number;
    dateCreationSyndic?: string;
    budgetAnnuel?: number;
    fondsReserve?: number;
    siret?: string;
    reglement?: string;
}

// Query Keys
export const coproprietesKeys = {
    all: ["coproprietes"] as const,
    list: (filters?: CoproprietesFilters) => ["coproprietes", "list", filters] as const,
    detail: (id: string) => ["coproprietes", "detail", id] as const,
};

// Hooks
export function useCoproprietes(filters?: CoproprietesFilters, options?: { enabled?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.search) params.set("search", filters.search);
    if (filters?.ville) params.set("ville", filters.ville);

    const queryString = params.toString();
    const url = queryString
        ? `${ENDPOINTS.SYNDIC_COPROPRIETES}?${queryString}`
        : ENDPOINTS.SYNDIC_COPROPRIETES;

    return useQuery({
        queryKey: coproprietesKeys.list(filters),
        queryFn: async () => {
            const result = await api.get<{ coproprietes: CoproprieteWithRelations[] }>(url);
            return result.coproprietes;
        },
        enabled: options?.enabled !== false,
    });
}

export function useCopropriete(id: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: coproprietesKeys.detail(id),
        queryFn: async () => {
            const result = await api.get<{ copropriete: CoproprieteWithRelations }>(
                ENDPOINTS.SYNDIC_COPROPRIETE_BY_ID(id)
            );
            return result.copropriete;
        },
        enabled: !!id && options?.enabled !== false,
    });
}

export function useCreateCopropriete() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateCoproprieteInput) => {
            const result = await api.post<{ copropriete: CoproprieteWithRelations }>(
                ENDPOINTS.SYNDIC_COPROPRIETES,
                data
            );
            return result.copropriete;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: coproprietesKeys.all });
        },
    });
}

export function useUpdateCopropriete() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<CreateCoproprieteInput> }) => {
            const result = await api.put<{ copropriete: CoproprieteWithRelations }>(
                ENDPOINTS.SYNDIC_COPROPRIETE_BY_ID(id),
                data
            );
            return result.copropriete;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: coproprietesKeys.all });
            queryClient.invalidateQueries({ queryKey: coproprietesKeys.detail(id) });
        },
    });
}
