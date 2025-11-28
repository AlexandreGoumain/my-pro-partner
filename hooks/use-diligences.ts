import type {
    Diligence,
    DiligenceCreateInput,
    DiligenceFilters,
    DiligenceStats,
    DiligenceUpdateInput,
} from "@/lib/types/juridique";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { affaireKeys } from "./use-affaires";

// Query keys
export const diligenceKeys = {
    all: ["diligences"] as const,
    list: (filters?: DiligenceFilters) =>
        [...diligenceKeys.all, "list", filters] as const,
    detail: (id: string) => [...diligenceKeys.all, "detail", id] as const,
    stats: (filters?: DiligenceFilters) =>
        [...diligenceKeys.all, "stats", filters] as const,
};

// Types
interface DiligencesResponse {
    diligences: Diligence[];
    stats: {
        nonFacturees: number;
        totalMinutes: number;
        totalMontant: number;
    };
}

// API functions
async function fetchDiligences(
    filters?: DiligenceFilters
): Promise<DiligencesResponse> {
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
    if (filters?.facturable !== undefined) {
        params.append("facturable", String(filters.facturable));
    }
    if (filters?.facturee !== undefined) {
        params.append("facturee", String(filters.facturee));
    }
    if (filters?.userId) {
        params.append("userId", filters.userId);
    }
    if (filters?.dateDebut) {
        params.append("dateDebut", filters.dateDebut);
    }
    if (filters?.dateFin) {
        params.append("dateFin", filters.dateFin);
    }

    const response = await fetch(`/api/diligences?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch diligences");
    }

    return response.json();
}

async function createDiligence(
    input: DiligenceCreateInput
): Promise<Diligence> {
    const response = await fetch("/api/diligences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create diligence");
    }

    const data = await response.json();
    return data.diligence;
}

async function updateDiligence(
    id: string,
    input: DiligenceUpdateInput
): Promise<Diligence> {
    const response = await fetch(`/api/diligences/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update diligence");
    }

    const data = await response.json();
    return data.diligence;
}

async function deleteDiligence(id: string): Promise<void> {
    const response = await fetch(`/api/diligences/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete diligence");
    }
}

// Hooks
export function useDiligences(
    filters?: DiligenceFilters,
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: diligenceKeys.list(filters),
        queryFn: () => fetchDiligences(filters),
        enabled: options?.enabled ?? true,
    });
}

export function useCreateDiligence() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createDiligence,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: diligenceKeys.all });
            if (data.affaireId) {
                queryClient.invalidateQueries({
                    queryKey: affaireKeys.detail(data.affaireId),
                });
            }
            queryClient.invalidateQueries({ queryKey: affaireKeys.all });
        },
    });
}

export function useUpdateDiligence() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: DiligenceUpdateInput;
        }) => updateDiligence(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: diligenceKeys.all });
            queryClient.invalidateQueries({ queryKey: affaireKeys.all });
        },
    });
}

export function useDeleteDiligence() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteDiligence,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: diligenceKeys.all });
            queryClient.invalidateQueries({ queryKey: affaireKeys.all });
        },
    });
}

// Re-export types for convenience
export type { Diligence, DiligenceFilters, DiligenceStats };
