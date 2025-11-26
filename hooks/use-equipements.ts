import {
    EquipementClient,
    EquipementCreateInput,
    EquipementStats,
    EquipementUpdateInput,
} from "@/lib/types/equipement";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Fetch all equipments
export function useEquipements(filters?: {
    clientId?: string;
    type?: string;
    statut?: string;
    controleUrgent?: boolean;
}) {
    const params = new URLSearchParams();
    if (filters?.clientId) params.append("clientId", filters.clientId);
    if (filters?.type) params.append("type", filters.type);
    if (filters?.statut) params.append("statut", filters.statut);
    if (filters?.controleUrgent) params.append("controleUrgent", "true");

    const queryString = params.toString();

    return useQuery<EquipementClient[]>({
        queryKey: ["equipements", filters],
        queryFn: async () => {
            const res = await fetch(
                `/api/equipements-clients${queryString ? `?${queryString}` : ""}`
            );
            if (!res.ok) throw new Error("Erreur lors du chargement");
            return res.json();
        },
    });
}

// Fetch single equipment
export function useEquipement(id: string | null) {
    return useQuery<EquipementClient>({
        queryKey: ["equipement", id],
        queryFn: async () => {
            const res = await fetch(`/api/equipements-clients/${id}`);
            if (!res.ok) throw new Error("Erreur lors du chargement");
            return res.json();
        },
        enabled: !!id,
    });
}

// Fetch equipment stats
export function useEquipementsStats() {
    return useQuery<EquipementStats>({
        queryKey: ["equipements-stats"],
        queryFn: async () => {
            const res = await fetch("/api/equipements-clients/stats");
            if (!res.ok) throw new Error("Erreur lors du chargement");
            return res.json();
        },
    });
}

// Create equipment
export function useCreateEquipement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: EquipementCreateInput) => {
            const res = await fetch("/api/equipements-clients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la création");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["equipements"] });
            queryClient.invalidateQueries({ queryKey: ["equipements-stats"] });
            queryClient.invalidateQueries({
                queryKey: ["entretiens-a-planifier"],
            });
        },
    });
}

// Update equipment
export function useUpdateEquipement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: EquipementUpdateInput;
        }) => {
            const res = await fetch(`/api/equipements-clients/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la mise à jour");
            }
            return res.json();
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["equipements"] });
            queryClient.invalidateQueries({
                queryKey: ["equipement", variables.id],
            });
            queryClient.invalidateQueries({ queryKey: ["equipements-stats"] });
            queryClient.invalidateQueries({
                queryKey: ["entretiens-a-planifier"],
            });
        },
    });
}

// Delete equipment
export function useDeleteEquipement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/equipements-clients/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la suppression");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["equipements"] });
            queryClient.invalidateQueries({ queryKey: ["equipements-stats"] });
            queryClient.invalidateQueries({
                queryKey: ["entretiens-a-planifier"],
            });
        },
    });
}
