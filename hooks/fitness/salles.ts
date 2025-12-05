"use client";

import type { SalleFitness } from "@/lib/types/fitness";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface SallesFilters {
    actif?: boolean;
    type?: string;
    premium?: boolean;
    reservable?: boolean;
    enabled?: boolean;
}

export function useSallesFitness(filters?: SallesFilters) {
    return useQuery({
        queryKey: ["fitness", "salles", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.actif !== undefined)
                params.set("actif", String(filters.actif));
            if (filters?.type) params.set("type", filters.type);
            if (filters?.premium !== undefined)
                params.set("premium", String(filters.premium));
            if (filters?.reservable !== undefined)
                params.set("reservable", String(filters.reservable));

            const res = await fetch(`/api/fitness/salles?${params}`);
            if (!res.ok)
                throw new Error("Erreur lors du chargement des salles");
            const data = await res.json();
            return data.data as SalleFitness[];
        },
        enabled: filters?.enabled !== false,
    });
}

export function useSalleFitness(id: string) {
    return useQuery({
        queryKey: ["fitness", "salles", id],
        queryFn: async () => {
            const res = await fetch(`/api/fitness/salles/${id}`);
            if (!res.ok) throw new Error("Salle non trouvée");
            return res.json() as Promise<SalleFitness>;
        },
        enabled: !!id,
    });
}

export function useCreateSalleFitness() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<SalleFitness>) => {
            const res = await fetch("/api/fitness/salles", {
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
            queryClient.invalidateQueries({ queryKey: ["fitness", "salles"] });
        },
    });
}

export function useUpdateSalleFitness() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<SalleFitness>;
        }) => {
            const res = await fetch(`/api/fitness/salles/${id}`, {
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fitness", "salles"] });
        },
    });
}

export function useDeleteSalleFitness() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/fitness/salles/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la suppression");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fitness", "salles"] });
        },
    });
}
