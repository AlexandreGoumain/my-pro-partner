import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { CheckCircle2 } from "lucide-react";
import { TaskItem, TaskItemProps } from "./task-item";

export interface TodayTasksCardProps {
    tasks: TaskItemProps[];
    className?: string;
}

/**
 * TodayTasksCard component
 *
 * Card displaying today's tasks with count badge.
 * Uses Design System constants for consistent styling.
 */
export function TodayTasksCard({ tasks, className }: TodayTasksCardProps) {
    return (
        <Card
            className={`group relative p-6 overflow-hidden border-black/[0.08] bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-500 ${className || ""}`}
        >
            {/* Subtle hover effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="relative">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                                <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                                    Aujourd&apos;hui
                                </h3>
                            </div>
                            <p className="text-[13px] text-black/40 ml-3">
                                Tâches à traiter
                            </p>
                        </div>
                        {tasks.length > 0 && (
                            <div className="flex items-center justify-center h-7 min-w-7 px-2 bg-black/5 rounded-md">
                                <span className="text-[12px] font-semibold text-black/70">
                                    {tasks.length}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {tasks.length > 0 ? (
                    <div className="space-y-2.5">
                        {tasks.map((task) => (
                            <TaskItem key={task.id} {...task} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={CheckCircle2}
                        title="Aucune action requise"
                        description="Tout est à jour"
                        variant="minimal"
                        iconSize="sm"
                        textSize="sm"
                    />
                )}
            </div>
        </Card>
    );
}
