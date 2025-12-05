import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { AppelCharges, StatutAppelCharges, TypeAppelCharges } from "@/lib/generated/prisma";

// Types
export interface ChargeWithRelations extends AppelCharges {
    copropriete?: {
        id: string;
        nom: string;
        adresse: string;
    };
    _count?: {
        paiements: number;
    };
}

export interface ChargesFilters {
    coproprieteId?: string;
    typeCharges?: TypeAppelCharges | "ALL";
    statut?: StatutAppelCharges | "ALL";
    trimestre?: number;
    annee?: number;
    search?: string;
}

export interface CreateChargeInput {
    coproprieteId: string;
    typeCharges: TypeAppelCharges;
    trimestre: number;
    annee: number;
    montantTotal: number;
    dateEcheance: string;
    description?: string;
    notes?: string;
}

// Query Keys
export const chargesKeys = {
    all: ["charges"] as const,
    list: (filters?: ChargesFilters) => ["charges", "list", filters] as const,
    detail: (id: string) => ["charges", "detail", id] as const,
    byCopropriete: (coproprieteId: string) => ["charges", "copropriete", coproprieteId] as const,
};

// Hooks
export function useCharges(filters?: ChargesFilters, options?: { enabled?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.coproprieteId) params.set("coproprieteId", filters.coproprieteId);
    if (filters?.typeCharges && filters.typeCharges !== "ALL") {
        params.set("typeCharges", filters.typeCharges);
    }
    if (filters?.statut && filters.statut !== "ALL") {
        params.set("statut", filters.statut);
    }
    if (filters?.trimestre) params.set("trimestre", String(filters.trimestre));
    if (filters?.annee) params.set("annee", String(filters.annee));
    if (filters?.search) params.set("search", filters.search);

    const queryString = params.toString();
    const url = queryString
        ? `${ENDPOINTS.SYNDIC_CHARGES}?${queryString}`
        : ENDPOINTS.SYNDIC_CHARGES;

    return useQuery({
        queryKey: chargesKeys.list(filters),
        queryFn: async () => {
            const result = await api.get<{ charges: ChargeWithRelations[] }>(url);
            return result.charges;
        },
        enabled: options?.enabled !== false,
    });
}

export function useCharge(id: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: chargesKeys.detail(id),
        queryFn: async () => {
            const result = await api.get<{ charge: ChargeWithRelations }>(
                `${ENDPOINTS.SYNDIC_CHARGES}/${id}`
            );
            return result.charge;
        },
        enabled: !!id && options?.enabled !== false,
    });
}

export function useChargesByCopropriete(coproprieteId: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: chargesKeys.byCopropriete(coproprieteId),
        queryFn: async () => {
            const result = await api.get<{ charges: ChargeWithRelations[] }>(
                `${ENDPOINTS.SYNDIC_CHARGES}?coproprieteId=${coproprieteId}`
            );
            return result.charges;
        },
        enabled: !!coproprieteId && options?.enabled !== false,
    });
}

export function useCreateCharge() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateChargeInput) => {
            const result = await api.post<{ charge: ChargeWithRelations }>(
                ENDPOINTS.SYNDIC_CHARGES,
                data
            );
            return result.charge;
        },
        onSuccess: (charge) => {
            queryClient.invalidateQueries({ queryKey: chargesKeys.all });
            if (charge.coproprieteId) {
                queryClient.invalidateQueries({ queryKey: chargesKeys.byCopropriete(charge.coproprieteId) });
            }
        },
    });
}

export function useUpdateCharge() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<CreateChargeInput> & { statut?: StatutAppelCharges } }) => {
            const result = await api.put<{ charge: ChargeWithRelations }>(
                `${ENDPOINTS.SYNDIC_CHARGES}/${id}`,
                data
            );
            return result.charge;
        },
        onSuccess: (charge, { id }) => {
            queryClient.invalidateQueries({ queryKey: chargesKeys.all });
            queryClient.invalidateQueries({ queryKey: chargesKeys.detail(id) });
            if (charge.coproprieteId) {
                queryClient.invalidateQueries({ queryKey: chargesKeys.byCopropriete(charge.coproprieteId) });
            }
        },
    });
}

export function useEnvoyerAppelCharges() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const result = await api.post<{ charge: ChargeWithRelations }>(
                `${ENDPOINTS.SYNDIC_CHARGES}/${id}/envoyer`,
                {}
            );
            return result.charge;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: chargesKeys.all });
            queryClient.invalidateQueries({ queryKey: chargesKeys.detail(id) });
        },
    });
}
