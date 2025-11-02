import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

export interface AnalyticsStatCardProps {
    icon: LucideIcon;
    badge: string;
    badgeClassName?: string;
    value: number | string;
    label: string;
}

export function AnalyticsStatCard({
    icon: Icon,
    badge,
    badgeClassName = "bg-black/5 text-black/60",
    value,
    label,
}: AnalyticsStatCardProps) {
    return (
        <Card className="border-black/8 shadow-sm">
            <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-black/60" strokeWidth={2} />
                    </div>
                    <Badge
                        variant="secondary"
                        className={`border-0 text-[12px] ${badgeClassName}`}
                    >
                        {badge}
                    </Badge>
                </div>
                <div className="space-y-1">
                    <p className="text-[32px] font-semibold tracking-[-0.02em] text-black">
                        {value}
                    </p>
                    <p className="text-[14px] text-black/60">{label}</p>
                </div>
            </div>
        </Card>
    );
}
