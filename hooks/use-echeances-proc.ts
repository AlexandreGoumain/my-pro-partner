import type {
    EcheanceProcedurale,
    EcheanceProceduraleCreateInput,
    EcheanceProceduraleFilters,
    EcheanceProceduraleUpdateInput,
} from "@/lib/types/juridique";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { affaireKeys } from "./use-affaires";

// Query keys
export const echeanceProcKeys = {
    all: ["echeances-proc"] as const,
    list: (filters?: EcheanceProceduraleFilters & { periode?: string }) =>
        [...echeanceProcKeys.all, "list", filters] as const,
    detail: (id: string) => [...echeanceProcKeys.all, "detail", id] as const,
    stats: () => [...echeanceProcKeys.all, "stats"] as const,
};

// Types
interface EcheancesProcResponse {
    echeances: EcheanceProcedurale[];
    stats: {
        cetteSemaine: number;
        enRetard: number;
        audiencesCeMois: number;
    };
}

// API functions
async function fetchEcheancesProc(
    filters?: EcheanceProceduraleFilters & { periode?: string }
): Promise<EcheancesProcResponse> {
    const params = new URLSearchParams();

    if (filters?.affaireId) {
        params.append("affaireId", filters.affaireId);
    }
    if (filters?.type) {
        const types = Array.isArray(filters.type)
            ? filters.type.join(",")
            : filters.type;
        params.append("type", types);
    }
    if (filters?.statut) {
        const statuts = Array.isArray(filters.statut)
            ? filters.statut.join(",")
            : filters.statut;
        params.append("statut", statuts);
    }
    if (filters?.dateDebut) {
        params.append("dateDebut", filters.dateDebut);
    }
    if (filters?.dateFin) {
        params.append("dateFin", filters.dateFin);
    }
    if (filters?.periode) {
        params.append("periode", filters.periode);
    }

    const response = await fetch(`/api/echeances-proc?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch echeances procedurales");
    }

    return response.json();
}

async function createEcheanceProc(
    input: EcheanceProceduraleCreateInput
): Promise<EcheanceProcedurale> {
    const response = await fetch("/api/echeances-proc", {
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

async function updateEcheanceProc(
    id: string,
    input: EcheanceProceduraleUpdateInput
): Promise<EcheanceProcedurale> {
    const response = await fetch(`/api/echeances-proc/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update echeance");
    }

    const data = await response.json();
    return data.echeance;
}

async function deleteEcheanceProc(id: string): Promise<void> {
    const response = await fetch(`/api/echeances-proc/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete echeance");
    }
}

// Hooks
export function useEcheancesProc(
    filters?: EcheanceProceduraleFilters & { periode?: string },
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: echeanceProcKeys.list(filters),
        queryFn: () => fetchEcheancesProc(filters),
        enabled: options?.enabled ?? true,
    });
}

export function useCreateEcheanceProc() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createEcheanceProc,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: echeanceProcKeys.all });
            if (data.affaireId) {
                queryClient.invalidateQueries({
                    queryKey: affaireKeys.detail(data.affaireId),
                });
            }
            queryClient.invalidateQueries({ queryKey: affaireKeys.all });
        },
    });
}

export function useUpdateEcheanceProc() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: EcheanceProceduraleUpdateInput;
        }) => updateEcheanceProc(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: echeanceProcKeys.all });
            queryClient.invalidateQueries({ queryKey: affaireKeys.all });
        },
    });
}

export function useDeleteEcheanceProc() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteEcheanceProc,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: echeanceProcKeys.all });
            queryClient.invalidateQueries({ queryKey: affaireKeys.all });
        },
    });
}

// Re-export types for convenience
export type { EcheanceProcedurale, EcheanceProceduraleFilters };
