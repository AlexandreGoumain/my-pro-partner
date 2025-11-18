import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DS } from "@/lib/constants/design-system";
import { cn } from "@/lib/utils";
import { Calendar, CheckCircle2 } from "lucide-react";
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
        <Card className={cn(DS.component.card.default, className)}>
            <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                        <div
                            className={cn(
                                "h-8 w-8 flex items-center justify-center",
                                DS.size.radius.large,
                                DS.color.bg.hover
                            )}
                        >
                            <Calendar
                                className={cn(
                                    DS.size.icon.small,
                                    DS.color.text.secondary
                                )}
                                strokeWidth={DS.size.icon.strokeWidth}
                            />
                        </div>
                        <h3 className={DS.text.heading.h4}>Aujourd&apos;hui</h3>
                    </div>
                    {tasks.length > 0 && (
                        <Badge
                            variant="secondary"
                            className={cn(
                                DS.color.bg.hover,
                                DS.color.text.secondary,
                                "border-0",
                                DS.text.body.xs,
                                "h-5 px-2"
                            )}
                        >
                            {tasks.length}
                        </Badge>
                    )}
                </div>

                {tasks.length > 0 ? (
                    <div className="space-y-2.5">
                        {tasks.map((task) => (
                            <TaskItem key={task.id} {...task} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <div
                            className={cn(
                                "h-12 w-12 flex items-center justify-center mx-auto mb-3",
                                DS.size.radius.full,
                                DS.color.bg.hover
                            )}
                        >
                            <CheckCircle2
                                className={cn(
                                    DS.size.icon.large,
                                    DS.color.text.tertiary
                                )}
                                strokeWidth={DS.size.icon.strokeWidth}
                            />
                        </div>
                        <p
                            className={cn(
                                DS.text.body.base,
                                "font-medium",
                                DS.color.text.secondary
                            )}
                        >
                            Aucune action requise
                        </p>
                        <p
                            className={cn(
                                DS.text.body.small,
                                DS.color.text.tertiary,
                                "mt-1"
                            )}
                        >
                            Tout est à jour
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
}
