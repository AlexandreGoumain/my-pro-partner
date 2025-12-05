import type {
    EntreeTemps,
    EntreeTempsCreateInput,
    EntreeTempsFilters,
    EntreeTempsUpdateInput,
} from "@/lib/types/mission";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { missionKeys } from "../use-missions";
import { tempsKeys } from "./types";

// API functions
async function fetchTemps(
    filters?: EntreeTempsFilters
): Promise<EntreeTemps[]> {
    const params = new URLSearchParams();

    if (filters?.missionId) {
        params.append("missionId", filters.missionId);
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
    if (filters?.facturable !== undefined) {
        params.append("facturable", String(filters.facturable));
    }
    if (filters?.facturee !== undefined) {
        params.append("facturee", String(filters.facturee));
    }

    const response = await fetch(`/api/temps?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch time entries");
    }

    const data = await response.json();
    return data.entrees || [];
}

async function createTemps(
    input: EntreeTempsCreateInput
): Promise<EntreeTemps> {
    const response = await fetch("/api/temps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create time entry");
    }

    const data = await response.json();
    return data.entree;
}

async function updateTemps(
    id: string,
    input: EntreeTempsUpdateInput
): Promise<EntreeTemps> {
    const response = await fetch(`/api/temps/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update time entry");
    }

    const data = await response.json();
    return data.entree;
}

async function deleteTemps(id: string): Promise<void> {
    const response = await fetch(`/api/temps/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete time entry");
    }
}

// Hooks
export function useTemps(
    filters?: EntreeTempsFilters,
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: tempsKeys.list(filters),
        queryFn: () => fetchTemps(filters),
        enabled: options?.enabled ?? true,
    });
}

export function useCreateTemps() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTemps,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: tempsKeys.all });
            queryClient.invalidateQueries({ queryKey: missionKeys.all });
            if (data.missionId) {
                queryClient.invalidateQueries({
                    queryKey: missionKeys.detail(data.missionId),
                });
            }
        },
    });
}

export function useUpdateTemps() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: EntreeTempsUpdateInput;
        }) => updateTemps(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tempsKeys.all });
            queryClient.invalidateQueries({ queryKey: missionKeys.all });
        },
    });
}

export function useDeleteTemps() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTemps,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tempsKeys.all });
            queryClient.invalidateQueries({ queryKey: missionKeys.all });
        },
    });
}
