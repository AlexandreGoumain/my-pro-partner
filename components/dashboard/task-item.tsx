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
    const getPriorityConfig = () => {
        if (priority === "urgent") {
            return {
                border: "border-black/15",
                bg: "bg-black/[0.03]",
                hover: "hover:bg-black/[0.06]",
                iconBg: "bg-black/[0.08]",
                iconColor: "text-black/70",
            };
        }
        if (priority === "high") {
            return {
                border: "border-black/10",
                bg: "bg-black/[0.02]",
                hover: "hover:bg-black/[0.04]",
                iconBg: "bg-black/[0.06]",
                iconColor: "text-black/60",
            };
        }
        return {
            border: "border-black/8",
            bg: "bg-white",
            hover: "hover:bg-black/[0.02]",
            iconBg: "bg-black/[0.04]",
            iconColor: "text-black/50",
        };
    };

    const config = getPriorityConfig();

    return (
        <div
            className={cn(
                "group/task p-3.5 border rounded-lg cursor-pointer transition-all duration-200",
                config.border,
                config.bg,
                config.hover,
                className
            )}
            onClick={onClick}
        >
            <div className="flex items-start gap-3">
                <div className={`flex items-center justify-center w-7 h-7 rounded-md ${config.iconBg} group-hover/task:scale-105 transition-transform duration-200`}>
                    {priority === "urgent" && <AlertCircle className={`w-4 h-4 ${config.iconColor}`} strokeWidth={2} />}
                    {priority === "high" && <Bell className={`w-4 h-4 ${config.iconColor}`} strokeWidth={2} />}
                    {(priority === "medium" || priority === "low") && <Clock className={`w-4 h-4 ${config.iconColor}`} strokeWidth={2} />}
                </div>
                <div className="flex-1 min-w-0">
                    {time && (
                        <p className="text-[11px] text-black/40 mb-1">{time}</p>
                    )}
                    <p className="text-[14px] font-medium tracking-[-0.01em] text-black group-hover/task:text-black/90">
                        {title}
                    </p>
                </div>
            </div>
        </div>
    );
}
