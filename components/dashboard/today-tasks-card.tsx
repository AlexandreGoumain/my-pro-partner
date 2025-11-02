import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { TaskItem, TaskItemProps } from "./task-item";
import { EmptyState } from "@/components/ui/empty-state";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TodayTasksCardProps {
    tasks: TaskItemProps[];
    className?: string;
}

export function TodayTasksCard({ tasks, className }: TodayTasksCardProps) {
    return (
        <Card className={cn("border-black/8 shadow-sm", className)}>
            <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-black/5 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-black/60" strokeWidth={2} />
                        </div>
                        <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black">
                            Aujourd'hui
                        </h3>
                    </div>
                    {tasks.length > 0 && (
                        <Badge
                            variant="secondary"
                            className="bg-black/5 text-black/60 border-0 text-[12px] h-5 px-2"
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
                        <div className="h-12 w-12 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-3">
                            <CheckCircle2
                                className="h-6 w-6 text-black/40"
                                strokeWidth={2}
                            />
                        </div>
                        <p className="text-[14px] font-medium text-black/60">
                            Aucune action requise
                        </p>
                        <p className="text-[13px] text-black/40 mt-1">
                            Tout est à jour
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
}
