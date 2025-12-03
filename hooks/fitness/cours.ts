"use client";

import type { CoursCollectif } from "@/lib/types/fitness";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface CoursFilters {
    actif?: boolean;
    categorie?: string;
    niveau?: string;
    instructeurId?: string;
    search?: string;
    enabled?: boolean;
}

export function useCours(filters?: CoursFilters) {
    return useQuery({
        queryKey: ["fitness", "cours", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.actif !== undefined)
                params.set("actif", String(filters.actif));
            if (filters?.categorie) params.set("categorie", filters.categorie);
            if (filters?.niveau) params.set("niveau", filters.niveau);
            if (filters?.instructeurId)
                params.set("instructeurId", filters.instructeurId);
            if (filters?.search) params.set("search", filters.search);

            const res = await fetch(`/api/fitness/cours?${params}`);
            if (!res.ok) throw new Error("Erreur lors du chargement des cours");
            const data = await res.json();
            return data.data as CoursCollectif[];
        },
        enabled: filters?.enabled !== false,
    });
}

export function useCoursDetails(id: string) {
    return useQuery({
        queryKey: ["fitness", "cours", id],
        queryFn: async () => {
            const res = await fetch(`/api/fitness/cours/${id}`);
            if (!res.ok) throw new Error("Cours non trouvé");
            return res.json() as Promise<CoursCollectif>;
        },
        enabled: !!id,
    });
}

export function useCreateCours() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<CoursCollectif>) => {
            const res = await fetch("/api/fitness/cours", {
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
            queryClient.invalidateQueries({ queryKey: ["fitness", "cours"] });
        },
    });
}

export function useUpdateCours() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<CoursCollectif>;
        }) => {
            const res = await fetch(`/api/fitness/cours/${id}`, {
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
            queryClient.invalidateQueries({ queryKey: ["fitness", "cours"] });
        },
    });
}

export function useDeleteCours() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/fitness/cours/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Erreur lors de la suppression");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fitness", "cours"] });
        },
    });
}
