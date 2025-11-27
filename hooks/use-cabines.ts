import type {
    Cabine,
    CabineCreateInput,
    CabinePaginationParams,
    CabineUpdateInput,
} from "@/lib/types/cabine.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Re-export types
export { CABINE_TYPES } from "@/lib/types/cabine.types";
export type { Cabine, CabineCreateInput, CabineUpdateInput };

interface CabinesResponse {
    data: Cabine[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Fetch cabines with pagination
async function fetchCabines(
    params: CabinePaginationParams = {}
): Promise<CabinesResponse> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.search) searchParams.set("search", params.search);
    if (params.type) searchParams.set("type", params.type);
    if (params.actif !== undefined)
        searchParams.set("actif", params.actif.toString());

    const response = await fetch(`/api/cabines?${searchParams.toString()}`);
    if (!response.ok) {
        throw new Error("Erreur lors du chargement des cabines");
    }
    return response.json();
}

// Fetch single cabine
async function fetchCabine(id: string): Promise<Cabine> {
    const response = await fetch(`/api/cabines/${id}`);
    if (!response.ok) {
        throw new Error("Cabine non trouvée");
    }
    return response.json();
}

// Create cabine
async function createCabine(data: CabineCreateInput): Promise<Cabine> {
    const response = await fetch("/api/cabines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la création");
    }
    return response.json();
}

// Update cabine
async function updateCabine({
    id,
    data,
}: {
    id: string;
    data: CabineUpdateInput;
}): Promise<Cabine> {
    const response = await fetch(`/api/cabines/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la mise à jour");
    }
    return response.json();
}

// Delete cabine
async function deleteCabine(id: string): Promise<void> {
    const response = await fetch(`/api/cabines/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la suppression");
    }
}

// ============================================
// HOOKS
// ============================================

export function useCabinesPaginated(params: CabinePaginationParams = {}) {
    return useQuery({
        queryKey: ["cabines", params],
        queryFn: () => fetchCabines(params),
    });
}

export function useCabines(limit = 100) {
    return useQuery({
        queryKey: ["cabines", { limit }],
        queryFn: async () => {
            const response = await fetchCabines({ limit });
            return response.data;
        },
    });
}

export function useActiveCabines() {
    return useQuery({
        queryKey: ["cabines", "active"],
        queryFn: async () => {
            const response = await fetchCabines({ actif: true, limit: 100 });
            return response.data;
        },
    });
}

export function useCabine(id: string | null) {
    return useQuery({
        queryKey: ["cabines", id],
        queryFn: () => fetchCabine(id!),
        enabled: !!id,
    });
}

export function useCreateCabine() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCabine,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cabines"] });
            toast.success("Cabine créée avec succès");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}

export function useUpdateCabine() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateCabine,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cabines"] });
            toast.success("Cabine mise à jour");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}

export function useDeleteCabine() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCabine,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cabines"] });
            toast.success("Cabine supprimée");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}
