import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TrendBadgeProps {
    trend: number;
    className?: string;
}

export function TrendBadge({ trend, className }: TrendBadgeProps) {
    const isPositive = trend >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;

    return (
        <Badge
            variant="secondary"
            className={cn(
                "bg-black/5 text-black/60 border-0 text-[12px] h-5 px-2",
                className
            )}
        >
            <Icon className="h-3 w-3 mr-1 inline" strokeWidth={2} />
            {Math.abs(trend).toFixed(0)}%
        </Badge>
    );
}
