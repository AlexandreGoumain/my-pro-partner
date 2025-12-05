"use client";

import type { AbonnementFitness, StatutAbonnementFitness } from "@/lib/types/fitness";
import type { AbonnementCreateInput } from "@/lib/validation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface AbonnementsFilters {
    page?: number;
    limit?: number;
    search?: string;
    statut?: StatutAbonnementFitness;
    typeAbonnementId?: string;
    clientId?: string;
    enabled?: boolean;
}

export function useAbonnements(filters?: AbonnementsFilters) {
    return useQuery({
        queryKey: ["fitness", "abonnements", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.page) params.set("page", String(filters.page));
            if (filters?.limit) params.set("limit", String(filters.limit));
            if (filters?.search) params.set("search", filters.search);
            if (filters?.statut) params.set("statut", filters.statut);
            if (filters?.typeAbonnementId)
                params.set("typeAbonnementId", filters.typeAbonnementId);
            if (filters?.clientId) params.set("clientId", filters.clientId);

            const res = await fetch(`/api/fitness/abonnements?${params}`);
            if (!res.ok)
                throw new Error("Erreur lors du chargement des abonnements");
            return res.json() as Promise<{
                data: AbonnementFitness[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    totalPages: number;
                };
            }>;
        },
        enabled: filters?.enabled !== false,
    });
}

export function useAbonnement(id: string) {
    return useQuery({
        queryKey: ["fitness", "abonnements", id],
        queryFn: async () => {
            const res = await fetch(`/api/fitness/abonnements/${id}`);
            if (!res.ok) throw new Error("Abonnement non trouvé");
            return res.json() as Promise<AbonnementFitness>;
        },
        enabled: !!id,
    });
}

export function useCreateAbonnement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: AbonnementCreateInput) => {
            const res = await fetch("/api/fitness/abonnements", {
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
            queryClient.invalidateQueries({
                queryKey: ["fitness", "abonnements"],
            });
            queryClient.invalidateQueries({ queryKey: ["fitness", "stats"] });
        },
    });
}

export function useUpdateAbonnement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<AbonnementFitness>;
        }) => {
            const res = await fetch(`/api/fitness/abonnements/${id}`, {
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
            queryClient.invalidateQueries({
                queryKey: ["fitness", "abonnements"],
            });
            queryClient.invalidateQueries({ queryKey: ["fitness", "stats"] });
        },
    });
}

export function useDeleteAbonnement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/fitness/abonnements/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la suppression");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["fitness", "abonnements"],
            });
            queryClient.invalidateQueries({ queryKey: ["fitness", "stats"] });
        },
    });
}
