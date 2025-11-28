import type {
    Mission,
    MissionCreateInput,
    MissionFilters,
    MissionStats,
    MissionUpdateInput,
    MissionWithDetails,
    StatutMission,
} from "@/lib/types/mission";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const missionKeys = {
    all: ["missions"] as const,
    list: (filters?: MissionFilters) =>
        [...missionKeys.all, "list", filters] as const,
    detail: (id: string) => [...missionKeys.all, "detail", id] as const,
    stats: () => [...missionKeys.all, "stats"] as const,
};

// API functions
async function fetchMissions(filters?: MissionFilters): Promise<Mission[]> {
    const params = new URLSearchParams();

    if (filters?.statut) {
        if (Array.isArray(filters.statut)) {
            params.append("statut", filters.statut.join(","));
        } else if (filters.statut !== ("ALL" as any)) {
            params.append("statut", filters.statut);
        }
    }
    if (filters?.clientId) {
        params.append("clientId", filters.clientId);
    }
    if (filters?.typeFact && filters.typeFact !== ("ALL" as any)) {
        params.append("typeFact", filters.typeFact);
    }
    if (filters?.search) {
        params.append("search", filters.search);
    }

    const response = await fetch(`/api/missions?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch missions");
    }

    const data = await response.json();
    return data.missions || [];
}

async function fetchMission(id: string): Promise<MissionWithDetails> {
    const response = await fetch(`/api/missions/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch mission");
    }

    const data = await response.json();
    return data.mission;
}

async function fetchMissionStats(): Promise<MissionStats> {
    const response = await fetch("/api/missions/stats");
    if (!response.ok) {
        throw new Error("Failed to fetch mission stats");
    }

    const data = await response.json();
    return data.stats;
}

async function createMission(input: MissionCreateInput): Promise<Mission> {
    const response = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create mission");
    }

    const data = await response.json();
    return data.mission;
}

async function updateMission(
    id: string,
    input: MissionUpdateInput
): Promise<Mission> {
    const response = await fetch(`/api/missions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update mission");
    }

    const data = await response.json();
    return data.mission;
}

async function deleteMission(id: string): Promise<void> {
    const response = await fetch(`/api/missions/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete mission");
    }
}

async function updateMissionStatut(
    id: string,
    statut: StatutMission
): Promise<Mission> {
    return updateMission(id, { statut });
}

// Hooks
export function useMissions(
    filters?: MissionFilters,
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: missionKeys.list(filters),
        queryFn: () => fetchMissions(filters),
        enabled: options?.enabled ?? true,
    });
}

export function useMission(id: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: missionKeys.detail(id),
        queryFn: () => fetchMission(id),
        enabled: (options?.enabled ?? true) && !!id,
    });
}

export function useMissionStats(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: missionKeys.stats(),
        queryFn: fetchMissionStats,
        enabled: options?.enabled ?? true,
    });
}

export function useCreateMission() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createMission,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: missionKeys.all });
        },
    });
}

export function useUpdateMission() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: MissionUpdateInput }) =>
            updateMission(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: missionKeys.all });
            queryClient.invalidateQueries({
                queryKey: missionKeys.detail(variables.id),
            });
        },
    });
}

export function useDeleteMission() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteMission,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: missionKeys.all });
        },
    });
}

export function useUpdateMissionStatut() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, statut }: { id: string; statut: StatutMission }) =>
            updateMissionStatut(id, statut),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: missionKeys.all });
            queryClient.invalidateQueries({
                queryKey: missionKeys.detail(variables.id),
            });
        },
    });
}

// Re-export types for convenience
export type { Mission, MissionFilters, MissionStats, MissionWithDetails };
