import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";

// Endpoint (will be added to endpoints.ts)
const ENDPOINT_COMPTA = "/api/syndic/comptabilite";

// Types
export interface EcritureComptable {
    id: string;
    coproprieteId: string;
    dateEcriture: string;
    libelle: string;
    montant: number;
    typeEcriture: "DEBIT" | "CREDIT";
    compte: string;
    categorieCharge?: string;
    lotId?: string;
    pieceJustificative?: string;
    notes?: string;
    createdAt: string;
}

export interface EcritureWithRelations extends EcritureComptable {
    copropriete?: {
        id: string;
        nom: string;
    };
    lot?: {
        id: string;
        numero: string;
    } | null;
}

export interface ComptaFilters {
    coproprieteId?: string;
    typeEcriture?: "DEBIT" | "CREDIT" | "ALL";
    compte?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
}

export interface CreateEcritureInput {
    coproprieteId: string;
    dateEcriture: string;
    libelle: string;
    montant: number;
    typeEcriture: "DEBIT" | "CREDIT";
    compte: string;
    categorieCharge?: string;
    lotId?: string;
    pieceJustificative?: string;
    notes?: string;
}

export interface BalanceCompte {
    compte: string;
    libelle: string;
    debit: number;
    credit: number;
    solde: number;
}

export interface SyntheseComptable {
    totalRecettes: number;
    totalDepenses: number;
    solde: number;
    balanceParCompte: BalanceCompte[];
}

// Query Keys
export const comptaKeys = {
    all: ["comptabilite"] as const,
    list: (filters?: ComptaFilters) => ["comptabilite", "list", filters] as const,
    detail: (id: string) => ["comptabilite", "detail", id] as const,
    byCopropriete: (coproprieteId: string) => ["comptabilite", "copropriete", coproprieteId] as const,
    synthese: (coproprieteId: string, annee?: number) => ["comptabilite", "synthese", coproprieteId, annee] as const,
};

// Hooks
export function useComptabilite(filters?: ComptaFilters, options?: { enabled?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.coproprieteId) params.set("coproprieteId", filters.coproprieteId);
    if (filters?.typeEcriture && filters.typeEcriture !== "ALL") {
        params.set("typeEcriture", filters.typeEcriture);
    }
    if (filters?.compte) params.set("compte", filters.compte);
    if (filters?.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters?.dateTo) params.set("dateTo", filters.dateTo);
    if (filters?.search) params.set("search", filters.search);

    const queryString = params.toString();
    const url = queryString
        ? `${ENDPOINT_COMPTA}?${queryString}`
        : ENDPOINT_COMPTA;

    return useQuery({
        queryKey: comptaKeys.list(filters),
        queryFn: async () => {
            const result = await api.get<{ ecritures: EcritureWithRelations[] }>(url);
            return result.ecritures;
        },
        enabled: options?.enabled !== false,
    });
}

export function useEcriture(id: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: comptaKeys.detail(id),
        queryFn: async () => {
            const result = await api.get<{ ecriture: EcritureWithRelations }>(
                `${ENDPOINT_COMPTA}/${id}`
            );
            return result.ecriture;
        },
        enabled: !!id && options?.enabled !== false,
    });
}

export function useComptaByCopropriete(coproprieteId: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: comptaKeys.byCopropriete(coproprieteId),
        queryFn: async () => {
            const result = await api.get<{ ecritures: EcritureWithRelations[] }>(
                `${ENDPOINT_COMPTA}?coproprieteId=${coproprieteId}`
            );
            return result.ecritures;
        },
        enabled: !!coproprieteId && options?.enabled !== false,
    });
}

export function useSyntheseComptable(coproprieteId: string, annee?: number, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: comptaKeys.synthese(coproprieteId, annee),
        queryFn: async () => {
            const params = new URLSearchParams();
            params.set("coproprieteId", coproprieteId);
            if (annee) params.set("annee", String(annee));

            const result = await api.get<{ synthese: SyntheseComptable }>(
                `${ENDPOINT_COMPTA}/synthese?${params.toString()}`
            );
            return result.synthese;
        },
        enabled: !!coproprieteId && options?.enabled !== false,
    });
}

export function useCreateEcriture() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateEcritureInput) => {
            const result = await api.post<{ ecriture: EcritureWithRelations }>(
                ENDPOINT_COMPTA,
                data
            );
            return result.ecriture;
        },
        onSuccess: (ecriture) => {
            queryClient.invalidateQueries({ queryKey: comptaKeys.all });
            if (ecriture.coproprieteId) {
                queryClient.invalidateQueries({ queryKey: comptaKeys.byCopropriete(ecriture.coproprieteId) });
                queryClient.invalidateQueries({ queryKey: comptaKeys.synthese(ecriture.coproprieteId) });
            }
        },
    });
}

export function useUpdateEcriture() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<CreateEcritureInput> }) => {
            const result = await api.put<{ ecriture: EcritureWithRelations }>(
                `${ENDPOINT_COMPTA}/${id}`,
                data
            );
            return result.ecriture;
        },
        onSuccess: (ecriture, { id }) => {
            queryClient.invalidateQueries({ queryKey: comptaKeys.all });
            queryClient.invalidateQueries({ queryKey: comptaKeys.detail(id) });
            if (ecriture.coproprieteId) {
                queryClient.invalidateQueries({ queryKey: comptaKeys.byCopropriete(ecriture.coproprieteId) });
                queryClient.invalidateQueries({ queryKey: comptaKeys.synthese(ecriture.coproprieteId) });
            }
        },
    });
}

export function useDeleteEcriture() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`${ENDPOINT_COMPTA}/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: comptaKeys.all });
        },
    });
}
