import { AlertCircle, Bell, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { DS } from "@/lib/constants/design-system";

export interface TaskItemProps {
    id: string;
    title: string;
    time?: string;
    priority: "urgent" | "high" | "medium" | "low";
    onClick?: () => void;
    className?: string;
}

// Helper function to get priority style
const getPriorityStyle = (priority: "urgent" | "high" | "medium" | "low") => {
    if (priority === "urgent") {
        return "border-black/20 bg-black/5 hover:bg-black/8";
    }
    if (priority === "high") {
        return "border-black/15 bg-black/[0.03] hover:bg-black/5";
    }
    return cn(DS.color.border.default, "hover:bg-black/5");
};

// Helper function to get icon color
const getIconColor = (priority: "urgent" | "high" | "medium" | "low") => {
    if (priority === "urgent") return "text-black/80";
    if (priority === "high") return DS.color.text.secondary;
    return DS.color.text.secondary;
};

/**
 * TaskItem component
 *
 * Task item with priority-based styling and icon.
 * Uses Design System constants for consistent styling.
 */
export function TaskItem({ title, time, priority, onClick, className }: TaskItemProps) {
    const iconClassName = cn(DS.size.icon.small, getIconColor(priority));
    const iconStrokeWidth = DS.size.icon.strokeWidth;

    return (
        <div
            className={cn(
                "p-3.5 border cursor-pointer",
                DS.size.radius.large,
                DS.animation.transition.fast,
                getPriorityStyle(priority),
                className
            )}
            onClick={onClick}
        >
            <div className="flex items-start gap-3">
                <div className="mt-0.5">
                    {priority === "urgent" && <AlertCircle className={iconClassName} strokeWidth={iconStrokeWidth} />}
                    {priority === "high" && <Bell className={iconClassName} strokeWidth={iconStrokeWidth} />}
                    {(priority === "medium" || priority === "low") && <Clock className={iconClassName} strokeWidth={iconStrokeWidth} />}
                </div>
                <div className="flex-1 min-w-0">
                    {time && (
                        <p className={cn(DS.text.body.xs, DS.color.text.tertiary, "mb-1")}>{time}</p>
                    )}
                    <p className={cn(DS.text.body.base, "font-medium", DS.text.tracking.normal, DS.color.text.primary)}>
                        {title}
                    </p>
                </div>
            </div>
        </div>
    );
}
