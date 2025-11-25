import type {
    EntretienVehicule,
    EntretienVehiculeCreateInput,
    EntretienVehiculeUpdateInput,
} from "@/lib/types/flotte";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { flotteKeys } from "./use-flotte";

// Query keys
export const entretiensKeys = {
    all: ["entretiens-vehicules"] as const,
    list: (filters?: { camionnetteId?: string; type?: string }) =>
        [...entretiensKeys.all, "list", filters] as const,
    detail: (id: string) => [...entretiensKeys.all, "detail", id] as const,
};

// API functions
async function fetchEntretiens(filters?: {
    camionnetteId?: string;
    type?: string;
}): Promise<EntretienVehicule[]> {
    const params = new URLSearchParams();
    if (filters?.camionnetteId)
        params.append("camionnetteId", filters.camionnetteId);
    if (filters?.type) params.append("type", filters.type);

    const url = `/api/entretiens-vehicules${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch entretiens");
    }
    const data = await response.json();
    return data.entretiens || [];
}

async function fetchEntretien(id: string): Promise<EntretienVehicule> {
    const response = await fetch(`/api/entretiens-vehicules/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch entretien");
    }
    const data = await response.json();
    return data.entretien;
}

async function createEntretien(
    input: EntretienVehiculeCreateInput
): Promise<EntretienVehicule> {
    const response = await fetch("/api/entretiens-vehicules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create entretien");
    }
    const data = await response.json();
    return data.entretien;
}

async function updateEntretien(
    id: string,
    input: EntretienVehiculeUpdateInput
): Promise<EntretienVehicule> {
    const response = await fetch(`/api/entretiens-vehicules/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update entretien");
    }
    const data = await response.json();
    return data.entretien;
}

async function deleteEntretien(id: string): Promise<void> {
    const response = await fetch(`/api/entretiens-vehicules/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete entretien");
    }
}

// Hooks
export function useEntretiensVehicules(filters?: {
    camionnetteId?: string;
    type?: string;
}) {
    return useQuery({
        queryKey: entretiensKeys.list(filters),
        queryFn: () => fetchEntretiens(filters),
    });
}

export function useEntretienVehicule(id: string) {
    return useQuery({
        queryKey: entretiensKeys.detail(id),
        queryFn: () => fetchEntretien(id),
        enabled: !!id,
    });
}

export function useCreateEntretienVehicule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createEntretien,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: entretiensKeys.all,
            });
            // Also invalidate flotte to update dernierEntretien/prochainEntretien
            queryClient.invalidateQueries({
                queryKey: flotteKeys.all,
            });
        },
    });
}

export function useUpdateEntretienVehicule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: EntretienVehiculeUpdateInput;
        }) => updateEntretien(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: entretiensKeys.all,
            });
        },
    });
}

export function useDeleteEntretienVehicule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteEntretien,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: entretiensKeys.all,
            });
        },
    });
}
