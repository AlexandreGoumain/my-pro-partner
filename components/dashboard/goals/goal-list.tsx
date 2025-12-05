"use client";

import { GoalItem } from "./goal-item";
import type { GoalWithProgress } from "@/lib/types/goals";

// ============================================================================
// Types
// ============================================================================

export interface GoalListProps {
    goals: GoalWithProgress[];
    onToggle: (id: string, enabled: boolean) => void;
    onEdit: (goal: GoalWithProgress) => void;
    onDelete: (id: string) => void;
    togglingId?: string;
}

// ============================================================================
// Component
// ============================================================================

export function GoalList({
    goals,
    onToggle,
    onEdit,
    onDelete,
    togglingId,
}: GoalListProps) {
    // Sort goals: enabled first, then by sortOrder
    const sortedGoals = [...goals].sort((a, b) => {
        if (a.enabled !== b.enabled) return a.enabled ? -1 : 1;
        return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    });

    return (
        <div className="space-y-4">
            {sortedGoals.map((goal) => (
                <GoalItem
                    key={goal.id}
                    goal={goal}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isToggling={togglingId === goal.id}
                />
            ))}
        </div>
    );
}
