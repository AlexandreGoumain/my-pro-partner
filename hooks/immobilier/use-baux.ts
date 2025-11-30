import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { BailLocatif, TypeBail, StatutBail } from "@/lib/generated/prisma";

// Types
export interface BailWithRelations extends BailLocatif {
    bien?: {
        id: string;
        reference: string;
        titre: string;
        typeBien: string;
        adresse: string;
        ville: string;
        photos: string[];
    };
    locataire?: {
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
    _count?: {
        appelsLoyers: number;
    };
}

export interface BauxFilters {
    typeBail?: TypeBail | "ALL";
    statut?: StatutBail | "ALL";
    bienId?: string;
    locataireId?: string;
    search?: string;
    expiresSoon?: boolean;
}

export interface CreateBailInput {
    bienId: string;
    locataireId: string;
    proprietaireId: string;
    typeBail?: TypeBail;
    dateDebut?: string;
    dureeMois?: number;
    loyerHC: number;
    charges?: number;
    depotGarantie?: number;
    jourPaiement?: number;
    indiceReference?: string;
    dateRevision?: string;
    clausesParticulieres?: string;
}

// Query Keys
export const bauxKeys = {
    all: ["baux"] as const,
    list: (filters?: BauxFilters) => ["baux", "list", filters] as const,
    detail: (id: string) => ["baux", "detail", id] as const,
    expiring: () => ["baux", "expiring"] as const,
};

// Hooks
export function useBaux(filters?: BauxFilters, options?: { enabled?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.typeBail && filters.typeBail !== "ALL") {
        params.set("typeBail", filters.typeBail);
    }
    if (filters?.statut && filters.statut !== "ALL") {
        params.set("statut", filters.statut);
    }
    if (filters?.bienId) params.set("bienId", filters.bienId);
    if (filters?.locataireId) params.set("locataireId", filters.locataireId);
    if (filters?.search) params.set("search", filters.search);
    if (filters?.expiresSoon) params.set("expiresSoon", "true");

    const queryString = params.toString();
    const url = queryString
        ? `${ENDPOINTS.GESTION_LOCATIVE_BAUX}?${queryString}`
        : ENDPOINTS.GESTION_LOCATIVE_BAUX;

    return useQuery({
        queryKey: bauxKeys.list(filters),
        queryFn: async () => {
            const result = await api.get<{ baux: BailWithRelations[] }>(url);
            return result.baux;
        },
        enabled: options?.enabled !== false,
    });
}

export function useBail(id: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: bauxKeys.detail(id),
        queryFn: async () => {
            const result = await api.get<{ bail: BailWithRelations }>(
                ENDPOINTS.GESTION_LOCATIVE_BAIL_BY_ID(id)
            );
            return result.bail;
        },
        enabled: !!id && options?.enabled !== false,
    });
}

export function useBauxExpiring(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: bauxKeys.expiring(),
        queryFn: async () => {
            const result = await api.get<{ baux: BailWithRelations[] }>(
                `${ENDPOINTS.GESTION_LOCATIVE_BAUX}?expiresSoon=true`
            );
            return result.baux;
        },
        enabled: options?.enabled !== false,
    });
}

export function useCreateBail() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateBailInput) => {
            const result = await api.post<{ bail: BailWithRelations }>(
                ENDPOINTS.GESTION_LOCATIVE_BAUX,
                data
            );
            return result.bail;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bauxKeys.all });
        },
    });
}

export function useUpdateBail() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<CreateBailInput> }) => {
            const result = await api.put<{ bail: BailWithRelations }>(
                ENDPOINTS.GESTION_LOCATIVE_BAIL_BY_ID(id),
                data
            );
            return result.bail;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: bauxKeys.all });
            queryClient.invalidateQueries({ queryKey: bauxKeys.detail(id) });
        },
    });
}
