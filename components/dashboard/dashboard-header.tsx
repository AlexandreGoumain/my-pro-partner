import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DashboardHeaderProps {
    greeting: string;
    userName?: string;
    dateLabel: string;
    notificationCount?: number;
    className?: string;
}

export function DashboardHeader({
    greeting,
    userName,
    dateLabel,
    notificationCount = 0,
    className,
}: DashboardHeaderProps) {
    return (
        <div className={cn("flex items-center justify-between", className)}>
            <div>
                <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                    {greeting} {userName || ""}
                </h1>
                <p className="text-[14px] text-black/40 mt-1">{dateLabel}</p>
            </div>
            <Button
                variant="outline"
                size="icon"
                className="relative h-10 w-10 border-black/10 hover:bg-black/5"
            >
                <Bell className="h-5 w-5 text-black/60" strokeWidth={2} />
                {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-black text-white text-[11px] font-medium flex items-center justify-center">
                        {notificationCount}
                    </span>
                )}
            </Button>
        </div>
    );
}
