import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActivityItemProps {
    icon: LucideIcon;
    title: string;
    description: string;
    timeLabel: string;
    className?: string;
}

export function ActivityItem({
    icon: Icon,
    title,
    description,
    timeLabel,
    className,
}: ActivityItemProps) {
    return (
        <div className={cn("flex items-start gap-3", className)}>
            <div className="h-8 w-8 rounded-lg bg-black/5 flex items-center justify-center flex-shrink-0">
                <Icon className="h-4 w-4 text-black/60" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-black">{title}</p>
                <p className="text-[13px] text-black/60 truncate mt-0.5">
                    {description}
                </p>
                <p className="text-[12px] text-black/40 mt-1">{timeLabel}</p>
            </div>
        </div>
    );
}
