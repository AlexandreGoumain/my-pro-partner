import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ArticleStatsCardProps {
    label: string;
    value: number;
    icon: LucideIcon;
    percentage?: number;
    badge?: {
        label?: string;
        variant?: "default" | "outline";
        className?: string;
    };
    isActive?: boolean;
    onClick?: () => void;
    iconClassName?: string;
    activeClassName?: string;
    hoverClassName?: string;
    className?: string;
}

export function ArticleStatsCard({
    label,
    value,
    icon: Icon,
    percentage,
    badge,
    isActive = false,
    onClick,
    iconClassName = "text-muted-foreground",
    activeClassName = "border-primary bg-primary/5 ring-2 ring-primary/20",
    hoverClassName = "hover:border-primary",
    className,
}: ArticleStatsCardProps) {
    return (
        <Card
            className={cn(
                "cursor-pointer transition-colors",
                hoverClassName,
                isActive && activeClassName,
                className
            )}
            onClick={onClick}
        >
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                            {Icon && (
                                <Icon
                                    className={cn("h-4 w-4", iconClassName)}
                                />
                            )}
                            {label}
                        </p>
                        <p className="text-2xl font-bold">{value}</p>
                    </div>
                    {percentage !== undefined && (
                        <Badge
                            variant={badge?.variant || "outline"}
                            className={badge?.className}
                        >
                            {percentage.toFixed(0)}%
                        </Badge>
                    )}
                    {badge && percentage === undefined && (
                        <Badge
                            variant={badge.variant || "outline"}
                            className={badge.className}
                        >
                            {badge.label}
                        </Badge>
                    )}
                    {!percentage && !badge && Icon && !iconClassName.includes("h-4") && (
                        <Icon
                            className={cn(
                                "h-8 w-8",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}
                        />
                    )}
                </div>
            </div>
        </Card>
    );
}
