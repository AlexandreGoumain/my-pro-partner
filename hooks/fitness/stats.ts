"use client";

import type { FitnessStats } from "@/lib/types/fitness";
import { useQuery } from "@tanstack/react-query";

export function useFitnessStats(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: ["fitness", "stats"],
        queryFn: async () => {
            const res = await fetch("/api/fitness/stats");
            if (!res.ok)
                throw new Error("Erreur lors du chargement des statistiques");
            return res.json() as Promise<FitnessStats>;
        },
        enabled: options?.enabled !== false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
