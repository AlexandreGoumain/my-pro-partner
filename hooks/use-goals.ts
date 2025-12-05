import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/fetch-client";
import type { GoalWithProgress, CreateGoalInput, UpdateGoalInput } from "@/lib/types/goals";

const API_BASE = "/api/goals";

// ============================================================================
// Query Keys
// ============================================================================

export const goalKeys = {
    all: ["goals"] as const,
    list: ["goals", "list"] as const,
    detail: (id: string) => ["goals", id] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetch all goals with calculated progress
 */
export function useGoals() {
    return useQuery({
        queryKey: goalKeys.all,
        queryFn: async () => api.get<GoalWithProgress[]>(API_BASE),
    });
}

/**
 * Fetch enabled goals only (for dashboard display)
 */
export function useEnabledGoals() {
    return useQuery({
        queryKey: [...goalKeys.all, "enabled"],
        queryFn: async () => {
            const goals = await api.get<GoalWithProgress[]>(API_BASE);
            return goals.filter((g) => g.enabled);
        },
    });
}

/**
 * Fetch a single goal by ID
 */
export function useGoal(id: string) {
    return useQuery({
        queryKey: goalKeys.detail(id),
        queryFn: async () => api.get<GoalWithProgress>(`${API_BASE}/${id}`),
        enabled: !!id,
    });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create a new goal
 */
export function useCreateGoal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateGoalInput) =>
            api.post<GoalWithProgress>(API_BASE, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: goalKeys.all });
        },
    });
}

/**
 * Update an existing goal
 */
export function useUpdateGoal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateGoalInput }) =>
            api.put<GoalWithProgress>(`${API_BASE}/${id}`, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: goalKeys.all });
            queryClient.invalidateQueries({ queryKey: goalKeys.detail(variables.id) });
        },
    });
}

/**
 * Delete a goal
 */
export function useDeleteGoal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => api.delete(`${API_BASE}/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: goalKeys.all });
        },
    });
}

/**
 * Toggle goal enabled/disabled status
 */
export function useToggleGoal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) =>
            api.put<GoalWithProgress>(`${API_BASE}/${id}`, { enabled }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: goalKeys.all });
            queryClient.invalidateQueries({ queryKey: goalKeys.detail(variables.id) });
        },
    });
}

/**
 * Update goal progress (custom goals only)
 */
export function useUpdateGoalProgress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, currentValue }: { id: string; currentValue: number }) => {
            const response = await fetch(`${API_BASE}/${id}/progress`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentValue }),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Échec de la mise à jour de la progression");
            }
            return response.json() as Promise<GoalWithProgress>;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: goalKeys.all });
            queryClient.invalidateQueries({ queryKey: goalKeys.detail(variables.id) });
        },
    });
}

/**
 * Reorder goals
 */
export function useReorderGoals() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (goalIds: string[]) => {
            // Update each goal's sortOrder in parallel
            const updates = goalIds.map((id, index) =>
                api.put<GoalWithProgress>(`${API_BASE}/${id}`, { sortOrder: index })
            );
            return Promise.all(updates);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: goalKeys.all });
        },
    });
}
