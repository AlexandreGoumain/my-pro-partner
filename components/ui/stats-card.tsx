import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface StatsCardProps {
    icon: LucideIcon;
    label: string;
    value: number | string;
    className?: string;
    iconBgClassName?: string;
    iconClassName?: string;
    valueClassName?: string;
}

export function StatsCard({
    icon: Icon,
    label,
    value,
    className,
    iconBgClassName,
    iconClassName,
    valueClassName,
}: StatsCardProps) {
    return (
        <Card className={cn("p-5 border-black/8 shadow-sm", className)}>
            <div className="flex items-center gap-3">
                <div
                    className={cn(
                        "h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center",
                        iconBgClassName
                    )}
                >
                    <Icon
                        className={cn("h-5 w-5 text-black/60", iconClassName)}
                        strokeWidth={2}
                    />
                </div>
                <div>
                    <p className="text-[12px] text-black/40 uppercase tracking-wide">
                        {label}
                    </p>
                    <p
                        className={cn(
                            "text-[20px] font-semibold tracking-[-0.01em] text-black mt-0.5",
                            valueClassName
                        )}
                    >
                        {value}
                    </p>
                </div>
            </div>
        </Card>
    );
}
