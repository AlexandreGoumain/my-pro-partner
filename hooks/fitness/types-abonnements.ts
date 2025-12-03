"use client";

import type { TypeAbonnementFitness } from "@/lib/types/fitness";
import type { TypeAbonnementCreateInput } from "@/lib/validation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTypesAbonnements(options?: {
    actif?: boolean;
    enabled?: boolean;
}) {
    return useQuery({
        queryKey: ["fitness", "types-abonnements", options],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (options?.actif !== undefined)
                params.set("actif", String(options.actif));

            const res = await fetch(`/api/fitness/types-abonnements?${params}`);
            if (!res.ok)
                throw new Error(
                    "Erreur lors du chargement des types d'abonnements"
                );
            const data = await res.json();
            return data.data as TypeAbonnementFitness[];
        },
        enabled: options?.enabled !== false,
    });
}

export function useTypeAbonnement(id: string) {
    return useQuery({
        queryKey: ["fitness", "types-abonnements", id],
        queryFn: async () => {
            const res = await fetch(`/api/fitness/types-abonnements/${id}`);
            if (!res.ok) throw new Error("Type d'abonnement non trouvé");
            return res.json() as Promise<TypeAbonnementFitness>;
        },
        enabled: !!id,
    });
}

export function useCreateTypeAbonnement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: TypeAbonnementCreateInput) => {
            const res = await fetch("/api/fitness/types-abonnements", {
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
                queryKey: ["fitness", "types-abonnements"],
            });
        },
    });
}

export function useUpdateTypeAbonnement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<TypeAbonnementFitness>;
        }) => {
            const res = await fetch(`/api/fitness/types-abonnements/${id}`, {
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
                queryKey: ["fitness", "types-abonnements"],
            });
        },
    });
}

export function useDeleteTypeAbonnement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/fitness/types-abonnements/${id}`, {
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
                queryKey: ["fitness", "types-abonnements"],
            });
        },
    });
}
