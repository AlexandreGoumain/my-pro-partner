"use client";

import type { ReservationCours, StatutReservationCours } from "@/lib/types/fitness";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ReservationsFilters {
    page?: number;
    limit?: number;
    seanceId?: string;
    clientId?: string;
    statut?: StatutReservationCours;
    enabled?: boolean;
}

export function useReservations(filters?: ReservationsFilters) {
    return useQuery({
        queryKey: ["fitness", "reservations", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.page) params.set("page", String(filters.page));
            if (filters?.limit) params.set("limit", String(filters.limit));
            if (filters?.seanceId) params.set("seanceId", filters.seanceId);
            if (filters?.clientId) params.set("clientId", filters.clientId);
            if (filters?.statut) params.set("statut", filters.statut);

            const res = await fetch(`/api/fitness/reservations?${params}`);
            if (!res.ok)
                throw new Error("Erreur lors du chargement des réservations");
            return res.json() as Promise<{
                data: ReservationCours[];
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

export function useReservation(id: string) {
    return useQuery({
        queryKey: ["fitness", "reservations", id],
        queryFn: async () => {
            const res = await fetch(`/api/fitness/reservations/${id}`);
            if (!res.ok) throw new Error("Réservation non trouvée");
            return res.json() as Promise<ReservationCours>;
        },
        enabled: !!id,
    });
}

export function useCreateReservation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {
            seanceId: string;
            clientId: string;
            notes?: string;
        }) => {
            const res = await fetch("/api/fitness/reservations", {
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
                queryKey: ["fitness", "reservations"],
            });
            queryClient.invalidateQueries({ queryKey: ["fitness", "seances"] });
        },
    });
}

export function useUpdateReservation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<ReservationCours>;
        }) => {
            const res = await fetch(`/api/fitness/reservations/${id}`, {
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
                queryKey: ["fitness", "reservations"],
            });
            queryClient.invalidateQueries({ queryKey: ["fitness", "seances"] });
        },
    });
}

export function useDeleteReservation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/fitness/reservations/${id}`, {
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
                queryKey: ["fitness", "reservations"],
            });
            queryClient.invalidateQueries({ queryKey: ["fitness", "seances"] });
        },
    });
}
