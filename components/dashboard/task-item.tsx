import { LucideIcon, AlertCircle, Bell, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TaskItemProps {
    id: string;
    title: string;
    time?: string;
    priority: "urgent" | "high" | "medium" | "low";
    onClick?: () => void;
    className?: string;
}

export function TaskItem({ title, time, priority, onClick, className }: TaskItemProps) {
    const getPriorityIcon = (): LucideIcon => {
        if (priority === "urgent") return AlertCircle;
        if (priority === "high") return Bell;
        return Clock;
    };

    const Icon = getPriorityIcon();

    const getPriorityStyle = () => {
        if (priority === "urgent") {
            return "border-black/20 bg-black/5 hover:bg-black/8";
        }
        if (priority === "high") {
            return "border-black/15 bg-black/[0.03] hover:bg-black/5";
        }
        return "border-black/8 hover:bg-black/5";
    };

    const getIconColor = () => {
        if (priority === "urgent") return "text-black/80";
        if (priority === "high") return "text-black/60";
        return "text-black/60";
    };

    return (
        <div
            className={cn(
                "p-3.5 rounded-lg border transition-all duration-200 cursor-pointer",
                getPriorityStyle(),
                className
            )}
            onClick={onClick}
        >
            <div className="flex items-start gap-3">
                <div className="mt-0.5">
                    <Icon className={cn("h-4 w-4", getIconColor())} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                    {time && (
                        <p className="text-[12px] text-black/40 mb-1">{time}</p>
                    )}
                    <p className="text-[14px] font-medium tracking-[-0.01em] text-black">
                        {title}
                    </p>
                </div>
            </div>
        </div>
    );
}
