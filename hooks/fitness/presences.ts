"use client";

import type { PresenceFitness } from "@/lib/types/fitness";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface PresencesFilters {
    page?: number;
    limit?: number;
    clientId?: string;
    abonnementId?: string;
    salleId?: string;
    typeAcces?: string;
    dateDebut?: string;
    dateFin?: string;
    enabled?: boolean;
}

export function usePresences(filters?: PresencesFilters) {
    return useQuery({
        queryKey: ["fitness", "presences", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.page) params.set("page", String(filters.page));
            if (filters?.limit) params.set("limit", String(filters.limit));
            if (filters?.clientId) params.set("clientId", filters.clientId);
            if (filters?.abonnementId)
                params.set("abonnementId", filters.abonnementId);
            if (filters?.salleId) params.set("salleId", filters.salleId);
            if (filters?.typeAcces) params.set("typeAcces", filters.typeAcces);
            if (filters?.dateDebut) params.set("dateDebut", filters.dateDebut);
            if (filters?.dateFin) params.set("dateFin", filters.dateFin);

            const res = await fetch(`/api/fitness/presences?${params}`);
            if (!res.ok)
                throw new Error("Erreur lors du chargement des présences");
            return res.json() as Promise<{
                data: PresenceFitness[];
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

export function usePresence(id: string) {
    return useQuery({
        queryKey: ["fitness", "presences", id],
        queryFn: async () => {
            const res = await fetch(`/api/fitness/presences/${id}`);
            if (!res.ok) throw new Error("Présence non trouvée");
            return res.json() as Promise<PresenceFitness>;
        },
        enabled: !!id,
    });
}

export function useCreatePresence() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<PresenceFitness>) => {
            const res = await fetch("/api/fitness/presences", {
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
                queryKey: ["fitness", "presences"],
            });
            queryClient.invalidateQueries({ queryKey: ["fitness", "stats"] });
            queryClient.invalidateQueries({
                queryKey: ["fitness", "abonnements"],
            });
        },
    });
}

export function useCheckIn() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {
            numeroCarte?: string;
            codeAcces?: string;
            clientId?: string;
            salleId?: string;
            typeAcces?: "ENTREE" | "SORTIE" | "COURS" | "ESPACE_PREMIUM";
        }) => {
            const res = await fetch("/api/fitness/check-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors du check-in");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["fitness", "presences"],
            });
            queryClient.invalidateQueries({ queryKey: ["fitness", "stats"] });
            queryClient.invalidateQueries({
                queryKey: ["fitness", "abonnements"],
            });
        },
    });
}

export function useUpdatePresence() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<PresenceFitness>;
        }) => {
            const res = await fetch(`/api/fitness/presences/${id}`, {
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
                queryKey: ["fitness", "presences"],
            });
        },
    });
}
