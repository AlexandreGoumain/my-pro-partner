import type {
    ContratCreateInput,
    ContratEntretien,
    ContratStats,
    ContratUpdateInput,
    StatutContrat,
    TypeContratEntretien,
} from "@/lib/types/contrats";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const contratsKeys = {
    all: ["contrats"] as const,
    list: (filters?: {
        statut?: StatutContrat | "ALL";
        type?: TypeContratEntretien | "ALL";
        search?: string;
    }) => [...contratsKeys.all, "list", filters] as const,
    detail: (id: string) => [...contratsKeys.all, "detail", id] as const,
    stats: () => [...contratsKeys.all, "stats"] as const,
};

// API functions
async function fetchContrats(filters?: {
    statut?: StatutContrat | "ALL";
    type?: TypeContratEntretien | "ALL";
    search?: string;
}): Promise<ContratEntretien[]> {
    const params = new URLSearchParams();
    if (filters?.statut && filters.statut !== "ALL")
        params.append("statut", filters.statut);
    if (filters?.type && filters.type !== "ALL")
        params.append("type", filters.type);
    if (filters?.search) params.append("search", filters.search);

    const url = `/api/contrats${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch contrats");
    }
    const data = await response.json();
    return data.contrats || [];
}

async function fetchContrat(id: string): Promise<ContratEntretien> {
    const response = await fetch(`/api/contrats/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch contrat");
    }
    const data = await response.json();
    return data.contrat;
}

async function fetchContratStats(): Promise<ContratStats> {
    const response = await fetch("/api/contrats/stats");
    if (!response.ok) {
        throw new Error("Failed to fetch stats");
    }
    return response.json();
}

async function createContrat(
    input: ContratCreateInput
): Promise<ContratEntretien> {
    const response = await fetch("/api/contrats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create contrat");
    }
    const data = await response.json();
    return data.contrat;
}

async function updateContrat(
    id: string,
    input: ContratUpdateInput
): Promise<ContratEntretien> {
    const response = await fetch(`/api/contrats/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update contrat");
    }
    const data = await response.json();
    return data.contrat;
}

async function deleteContrat(id: string): Promise<void> {
    const response = await fetch(`/api/contrats/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete contrat");
    }
}

// Hooks
export function useContrats(filters?: {
    statut?: StatutContrat | "ALL";
    type?: TypeContratEntretien | "ALL";
    search?: string;
}) {
    return useQuery({
        queryKey: contratsKeys.list(filters),
        queryFn: () => fetchContrats(filters),
    });
}

export function useContrat(id: string) {
    return useQuery({
        queryKey: contratsKeys.detail(id),
        queryFn: () => fetchContrat(id),
        enabled: !!id,
    });
}

export function useContratStats() {
    return useQuery({
        queryKey: contratsKeys.stats(),
        queryFn: fetchContratStats,
    });
}

export function useCreateContrat() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createContrat,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: contratsKeys.all,
            });
        },
    });
}

export function useUpdateContrat() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ContratUpdateInput }) =>
            updateContrat(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: contratsKeys.all,
            });
        },
    });
}

export function useDeleteContrat() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteContrat,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: contratsKeys.all,
            });
        },
    });
}
