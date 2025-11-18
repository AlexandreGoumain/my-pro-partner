import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { DS } from "@/lib/constants/design-system";

export interface DashboardHeaderProps {
    greeting: string;
    userName?: string;
    dateLabel: string;
    notificationCount?: number;
    className?: string;
}

/**
 * DashboardHeader component
 *
 * Header for the main dashboard page with greeting, date, and notifications.
 * Uses Design System constants for consistent styling.
 */
export function DashboardHeader({
    greeting,
    userName,
    dateLabel,
    notificationCount = 0,
    className,
}: DashboardHeaderProps) {
    return (
        <div className={cn(DS.layout.flex.between, className)}>
            <div>
                <h1 className={DS.text.heading.h1}>
                    {greeting} {userName || ""}
                </h1>
                <p className={cn(DS.text.body.base, DS.color.text.tertiary, "mt-1")}>{dateLabel}</p>
            </div>
            <Button
                variant="outline"
                size="icon"
                className={cn(
                    "relative h-10 w-10",
                    DS.color.border.medium,
                    "hover:bg-black/5"
                )}
            >
                <Bell className={cn(DS.size.icon.default, DS.color.text.secondary)} strokeWidth={DS.size.icon.strokeWidth} />
                {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-black text-white text-[11px] font-medium flex items-center justify-center">
                        {notificationCount}
                    </span>
                )}
            </Button>
        </div>
    );
}
