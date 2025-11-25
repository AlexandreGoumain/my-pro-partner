import type {
    Camionnette,
    CamionnetteCreateInput,
    CamionnetteUpdateInput,
} from "@/lib/types/flotte";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const flotteKeys = {
    all: ["flotte"] as const,
    list: () => [...flotteKeys.all, "list"] as const,
    detail: (id: string) => [...flotteKeys.all, "detail", id] as const,
    stats: () => [...flotteKeys.all, "stats"] as const,
};

// API functions
async function fetchCamionnettes(): Promise<Camionnette[]> {
    const response = await fetch("/api/camionnettes");
    if (!response.ok) {
        throw new Error("Failed to fetch camionnettes");
    }
    const data = await response.json();
    return data.camionnettes || [];
}

async function fetchCamionnette(id: string): Promise<Camionnette> {
    const response = await fetch(`/api/camionnettes/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch camionnette");
    }
    const data = await response.json();
    return data.camionnette;
}

async function createCamionnette(
    input: CamionnetteCreateInput
): Promise<Camionnette> {
    const response = await fetch("/api/camionnettes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create camionnette");
    }
    const data = await response.json();
    return data.camionnette;
}

async function updateCamionnette(
    id: string,
    input: CamionnetteUpdateInput
): Promise<Camionnette> {
    const response = await fetch(`/api/camionnettes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update camionnette");
    }
    const data = await response.json();
    return data.camionnette;
}

async function deleteCamionnette(id: string): Promise<void> {
    const response = await fetch(`/api/camionnettes/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete camionnette");
    }
}

// Hooks
export function useFlotte() {
    return useQuery({
        queryKey: flotteKeys.list(),
        queryFn: fetchCamionnettes,
    });
}

export function useCamionnette(id: string) {
    return useQuery({
        queryKey: flotteKeys.detail(id),
        queryFn: () => fetchCamionnette(id),
        enabled: !!id,
    });
}

export function useCreateCamionnette() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCamionnette,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: flotteKeys.all,
            });
        },
    });
}

export function useUpdateCamionnette() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: CamionnetteUpdateInput;
        }) => updateCamionnette(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: flotteKeys.all,
            });
        },
    });
}

export function useDeleteCamionnette() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCamionnette,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: flotteKeys.all,
            });
        },
    });
}
