import type { EntreeTemps } from "@/lib/types/mission";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { missionKeys } from "../use-missions";
import { tempsKeys } from "./types";

// API functions
async function fetchActiveTimer(): Promise<EntreeTemps | null> {
    const response = await fetch("/api/temps/timer");
    if (!response.ok) {
        throw new Error("Failed to fetch timer");
    }

    const data = await response.json();
    return data.timer;
}

async function startTimer(
    missionId: string,
    description?: string
): Promise<EntreeTemps> {
    const response = await fetch("/api/temps/timer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", missionId, description }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to start timer");
    }

    const data = await response.json();
    return data.timer;
}

async function stopTimer(description?: string): Promise<EntreeTemps> {
    const response = await fetch("/api/temps/timer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stop", description }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to stop timer");
    }

    const data = await response.json();
    return data.timer;
}

async function cancelTimer(): Promise<void> {
    const response = await fetch("/api/temps/timer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to cancel timer");
    }
}

// Hooks
export function useActiveTimer(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: tempsKeys.timer(),
        queryFn: fetchActiveTimer,
        enabled: options?.enabled ?? true,
        refetchInterval: 60000, // Refresh every minute for running timer
    });
}

export function useStartTimer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            missionId,
            description,
        }: {
            missionId: string;
            description?: string;
        }) => startTimer(missionId, description),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tempsKeys.timer() });
        },
    });
}

export function useStopTimer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (description?: string) => stopTimer(description),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tempsKeys.all });
            queryClient.invalidateQueries({ queryKey: tempsKeys.timer() });
            queryClient.invalidateQueries({ queryKey: missionKeys.all });
        },
    });
}

export function useCancelTimer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelTimer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tempsKeys.timer() });
        },
    });
}
