import type {
    EcheanceFiscale,
    EcheanceFiscaleCreateInput,
    EcheanceFiscaleFilters,
    EcheanceFiscaleUpdateInput,
    EcheancesStats,
} from "@/lib/types/mission";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const echeancesKeys = {
    all: ["echeances"] as const,
    list: (filters?: EcheanceFiscaleFilters) =>
        [...echeancesKeys.all, "list", filters] as const,
    detail: (id: string) => [...echeancesKeys.all, "detail", id] as const,
    stats: () => [...echeancesKeys.all, "stats"] as const,
};

// Types for stats response
export interface EcheancesStatsResponse {
    stats: EcheancesStats;
    echeancesSemaine: EcheanceFiscale[];
    echeancesRetard: EcheanceFiscale[];
}

// API functions
async function fetchEcheances(
    filters?: EcheanceFiscaleFilters
): Promise<EcheanceFiscale[]> {
    const params = new URLSearchParams();

    if (filters?.search) {
        params.append("search", filters.search);
    }
    if (filters?.statut) {
        const statuts = Array.isArray(filters.statut)
            ? filters.statut.join(",")
            : filters.statut;
        params.append("statut", statuts);
    }
    if (filters?.type) {
        const types = Array.isArray(filters.type)
            ? filters.type.join(",")
            : filters.type;
        params.append("type", types);
    }
    if (filters?.clientId) {
        params.append("clientId", filters.clientId);
    }
    if (filters?.missionId) {
        params.append("missionId", filters.missionId);
    }
    if (filters?.periode) {
        params.append("periode", filters.periode);
    }
    if (filters?.dateDebut) {
        params.append("dateDebut", filters.dateDebut);
    }
    if (filters?.dateFin) {
        params.append("dateFin", filters.dateFin);
    }

    const response = await fetch(`/api/echeances?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch echeances");
    }

    const data = await response.json();
    return data.echeances || [];
}

async function fetchEcheance(id: string): Promise<EcheanceFiscale> {
    const response = await fetch(`/api/echeances/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch echeance");
    }

    const data = await response.json();
    return data.echeance;
}

async function fetchEcheancesStats(): Promise<EcheancesStatsResponse> {
    const response = await fetch("/api/echeances/stats");
    if (!response.ok) {
        throw new Error("Failed to fetch echeances stats");
    }

    return response.json();
}

async function createEcheance(
    input: EcheanceFiscaleCreateInput
): Promise<EcheanceFiscale> {
    const response = await fetch("/api/echeances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create echeance");
    }

    const data = await response.json();
    return data.echeance;
}

async function updateEcheance({
    id,
    data,
}: {
    id: string;
    data: EcheanceFiscaleUpdateInput;
}): Promise<EcheanceFiscale> {
    const response = await fetch(`/api/echeances/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update echeance");
    }

    const result = await response.json();
    return result.echeance;
}

async function deleteEcheance(id: string): Promise<void> {
    const response = await fetch(`/api/echeances/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete echeance");
    }
}

// Hooks
export function useEcheances(
    filters?: EcheanceFiscaleFilters,
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: echeancesKeys.list(filters),
        queryFn: () => fetchEcheances(filters),
        enabled: options?.enabled !== false,
    });
}

export function useEcheance(id: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: echeancesKeys.detail(id),
        queryFn: () => fetchEcheance(id),
        enabled: !!id && options?.enabled !== false,
    });
}

export function useEcheancesStats(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: echeancesKeys.stats(),
        queryFn: fetchEcheancesStats,
        enabled: options?.enabled !== false,
    });
}

export function useCreateEcheance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createEcheance,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: echeancesKeys.all });
        },
    });
}

export function useUpdateEcheance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateEcheance,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: echeancesKeys.all });
            queryClient.setQueryData(echeancesKeys.detail(data.id), data);
        },
    });
}

export function useDeleteEcheance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteEcheance,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: echeancesKeys.all });
        },
    });
}

// Generate échéances for a mission
async function generateEcheances({
    missionId,
    annee,
}: {
    missionId: string;
    annee: number;
}): Promise<{ message: string; created: number }> {
    const response = await fetch("/api/echeances/generer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missionId, annee }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate echeances");
    }

    return response.json();
}

export function useGenerateEcheances() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: generateEcheances,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: echeancesKeys.all });
        },
    });
}
