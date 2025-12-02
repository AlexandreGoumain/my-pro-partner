"use client";

import type { SeanceCours, StatutSeanceCours } from "@/lib/types/fitness";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface SeancesFilters {
    page?: number;
    limit?: number;
    coursId?: string;
    instructeurId?: string;
    salleId?: string;
    statut?: StatutSeanceCours;
    dateDebut?: string;
    dateFin?: string;
    enabled?: boolean;
}

export function useSeances(filters?: SeancesFilters) {
    return useQuery({
        queryKey: ["fitness", "seances", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.page) params.set("page", String(filters.page));
            if (filters?.limit) params.set("limit", String(filters.limit));
            if (filters?.coursId) params.set("coursId", filters.coursId);
            if (filters?.instructeurId)
                params.set("instructeurId", filters.instructeurId);
            if (filters?.salleId) params.set("salleId", filters.salleId);
            if (filters?.statut) params.set("statut", filters.statut);
            if (filters?.dateDebut) params.set("dateDebut", filters.dateDebut);
            if (filters?.dateFin) params.set("dateFin", filters.dateFin);

            const res = await fetch(`/api/fitness/seances?${params}`);
            if (!res.ok)
                throw new Error("Erreur lors du chargement des séances");
            return res.json() as Promise<{
                data: SeanceCours[];
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

export function useSeance(id: string) {
    return useQuery({
        queryKey: ["fitness", "seances", id],
        queryFn: async () => {
            const res = await fetch(`/api/fitness/seances/${id}`);
            if (!res.ok) throw new Error("Séance non trouvée");
            return res.json() as Promise<SeanceCours>;
        },
        enabled: !!id,
    });
}

export function useCreateSeance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            data: Partial<SeanceCours> & {
                joursSemaine?: number[];
                dateDebut?: string;
                dateFin?: string;
                heureDebut?: string;
            }
        ) => {
            const res = await fetch("/api/fitness/seances", {
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
            queryClient.invalidateQueries({ queryKey: ["fitness", "seances"] });
            queryClient.invalidateQueries({ queryKey: ["fitness", "stats"] });
        },
    });
}

export function useUpdateSeance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<SeanceCours>;
        }) => {
            const res = await fetch(`/api/fitness/seances/${id}`, {
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
            queryClient.invalidateQueries({ queryKey: ["fitness", "seances"] });
        },
    });
}

export function useDeleteSeance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/fitness/seances/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la suppression");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fitness", "seances"] });
            queryClient.invalidateQueries({ queryKey: ["fitness", "stats"] });
        },
    });
}
