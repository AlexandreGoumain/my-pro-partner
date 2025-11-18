import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DS } from "@/lib/constants/design-system";

export interface ActivityItemProps {
    icon: LucideIcon;
    title: string;
    description: string;
    timeLabel: string;
    className?: string;
}

/**
 * ActivityItem component
 *
 * Activity item with icon, title, description, and time label.
 * Uses Design System constants for consistent styling.
 */
export function ActivityItem({
    icon: Icon,
    title,
    description,
    timeLabel,
    className,
}: ActivityItemProps) {
    return (
        <div className={cn("flex items-start gap-3", className)}>
            <div className={cn(
                "h-8 w-8 flex items-center justify-center flex-shrink-0",
                DS.size.radius.large,
                DS.color.bg.hover
            )}>
                <Icon className={cn(DS.size.icon.small, DS.color.text.secondary)} strokeWidth={DS.size.icon.strokeWidth} />
            </div>
            <div className="flex-1 min-w-0">
                <p className={cn(DS.text.body.small, "font-medium", DS.color.text.primary)}>{title}</p>
                <p className={cn(DS.text.body.small, DS.color.text.secondary, "truncate mt-0.5")}>
                    {description}
                </p>
                <p className={cn(DS.text.body.xs, DS.color.text.tertiary, "mt-1")}>{timeLabel}</p>
            </div>
        </div>
    );
}
