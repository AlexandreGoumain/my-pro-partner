import { cn } from "@/lib/utils";

export interface DashboardHeaderProps {
    greeting: string;
    userName?: string;
    dateLabel: string;
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
    className,
}: DashboardHeaderProps) {
    return (
        <div className={cn(className)}>
            <div>
                <h1 className="text-[28px] font-bold tracking-[-0.02em] text-black bg-gradient-to-br from-black to-black/80 bg-clip-text">
                    {greeting} {userName || ""}
                </h1>
                <p className="text-[14px] text-black/40 mt-1">{dateLabel}</p>
            </div>
        </div>
    );
}
