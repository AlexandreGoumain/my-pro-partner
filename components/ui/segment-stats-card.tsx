import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export interface SegmentStatsCardProps {
    icon: LucideIcon;
    label: string;
    value: number | string;
    className?: string;
}

export function SegmentStatsCard({
    icon: Icon,
    label,
    value,
    className,
}: SegmentStatsCardProps) {
    return (
        <Card className={`p-5 border-black/8 shadow-sm ${className || ""}`}>
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-black/60" strokeWidth={2} />
                </div>
                <div>
                    <p className="text-[12px] text-black/40 uppercase tracking-wide">
                        {label}
                    </p>
                    <p className="text-[20px] font-semibold tracking-[-0.01em] text-black mt-0.5">
                        {value}
                    </p>
                </div>
            </div>
        </Card>
    );
}
