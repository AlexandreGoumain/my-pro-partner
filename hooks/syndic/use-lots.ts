import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { LotCopropriete, TypeLot } from "@/lib/generated/prisma";

// Types
export interface LotWithRelations extends LotCopropriete {
    copropriete?: {
        id: string;
        nom: string;
        adresse: string;
    };
    coproprietaire?: {
        id: string;
        nom: string;
        prenom: string | null;
        telephone: string | null;
        email: string | null;
    } | null;
    locataire?: {
        id: string;
        nom: string;
        prenom: string | null;
        telephone: string | null;
    } | null;
}

export interface LotsFilters {
    coproprieteId?: string;
    typeLot?: TypeLot | "ALL";
    search?: string;
}

export interface CreateLotInput {
    coproprieteId: string;
    numero: string;
    typeLot?: TypeLot;
    etage?: number;
    batiment?: string;
    surface?: number;
    tantiemesGeneraux: number;
    tantiemesParticuliers?: Record<string, number>;
    coproprietaireId?: string;
    locataireId?: string;
    estLoue?: boolean;
    notes?: string;
}

// Query Keys
export const lotsKeys = {
    all: ["lots"] as const,
    list: (filters?: LotsFilters) => ["lots", "list", filters] as const,
    detail: (id: string) => ["lots", "detail", id] as const,
    byCopropriete: (coproprieteId: string) => ["lots", "copropriete", coproprieteId] as const,
};

// Hooks
export function useLots(filters?: LotsFilters, options?: { enabled?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.coproprieteId) params.set("coproprieteId", filters.coproprieteId);
    if (filters?.typeLot && filters.typeLot !== "ALL") {
        params.set("typeLot", filters.typeLot);
    }
    if (filters?.search) params.set("search", filters.search);

    const queryString = params.toString();
    const url = queryString
        ? `${ENDPOINTS.SYNDIC_LOTS}?${queryString}`
        : ENDPOINTS.SYNDIC_LOTS;

    return useQuery({
        queryKey: lotsKeys.list(filters),
        queryFn: async () => {
            const result = await api.get<{ lots: LotWithRelations[] }>(url);
            return result.lots;
        },
        enabled: options?.enabled !== false,
    });
}

export function useLot(id: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: lotsKeys.detail(id),
        queryFn: async () => {
            const result = await api.get<{ lot: LotWithRelations }>(
                `${ENDPOINTS.SYNDIC_LOTS}/${id}`
            );
            return result.lot;
        },
        enabled: !!id && options?.enabled !== false,
    });
}

export function useLotsByCopropriete(coproprieteId: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: lotsKeys.byCopropriete(coproprieteId),
        queryFn: async () => {
            const result = await api.get<{ lots: LotWithRelations[] }>(
                `${ENDPOINTS.SYNDIC_LOTS}?coproprieteId=${coproprieteId}`
            );
            return result.lots;
        },
        enabled: !!coproprieteId && options?.enabled !== false,
    });
}

export function useCreateLot() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateLotInput) => {
            const result = await api.post<{ lot: LotWithRelations }>(
                ENDPOINTS.SYNDIC_LOTS,
                data
            );
            return result.lot;
        },
        onSuccess: (lot) => {
            queryClient.invalidateQueries({ queryKey: lotsKeys.all });
            if (lot.coproprieteId) {
                queryClient.invalidateQueries({ queryKey: lotsKeys.byCopropriete(lot.coproprieteId) });
            }
        },
    });
}

export function useUpdateLot() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<CreateLotInput> }) => {
            const result = await api.put<{ lot: LotWithRelations }>(
                `${ENDPOINTS.SYNDIC_LOTS}/${id}`,
                data
            );
            return result.lot;
        },
        onSuccess: (lot, { id }) => {
            queryClient.invalidateQueries({ queryKey: lotsKeys.all });
            queryClient.invalidateQueries({ queryKey: lotsKeys.detail(id) });
            if (lot.coproprieteId) {
                queryClient.invalidateQueries({ queryKey: lotsKeys.byCopropriete(lot.coproprieteId) });
            }
        },
    });
}

export function useDeleteLot() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`${ENDPOINTS.SYNDIC_LOTS}/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lotsKeys.all });
        },
    });
}
