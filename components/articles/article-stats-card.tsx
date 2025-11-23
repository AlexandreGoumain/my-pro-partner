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
  isClickable?: boolean;
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
  isClickable = false,
  onClick,
  iconClassName = "text-muted-foreground",
  activeClassName = "border-black/20 bg-black/5 ring-2 ring-black/10",
  hoverClassName = "hover:border-black/20",
  className,
}: ArticleStatsCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-black/[0.08] bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-500",
        isClickable && "cursor-pointer",
        isClickable && hoverClassName,
        isActive && activeClassName,
        className,
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative p-6">
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
            <p className="text-[13px] font-medium tracking-[-0.01em] text-black/60 flex items-center gap-1.5">
              {Icon && <Icon className={cn("h-4 w-4", iconClassName)} />}
              {label}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[28px] font-bold tracking-[-0.02em] text-black">{value}</p>
          {percentage !== undefined && (
            <Badge
              variant={badge?.variant || "outline"}
              className={cn("bg-black/5 text-black/70 border-black/10 text-[12px] h-6 px-3 font-medium", badge?.className)}
            >
              {percentage.toFixed(0)}%
            </Badge>
          )}
          {badge && percentage === undefined && (
            <Badge
              variant={badge.variant || "outline"}
              className={cn("bg-black/5 text-black/70 border-black/10 text-[12px] h-6 px-3 font-medium", badge.className)}
            >
              {badge.label}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
