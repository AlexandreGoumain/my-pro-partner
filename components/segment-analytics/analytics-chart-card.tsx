import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface AnalyticsChartCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    children: ReactNode;
}

export function AnalyticsChartCard({
    title,
    description,
    icon: Icon,
    children,
}: AnalyticsChartCardProps) {
    return (
        <Card className="border-black/8 shadow-sm">
            <div className="p-5">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black">
                            {title}
                        </h3>
                        <p className="text-[13px] text-black/40 mt-1">
                            {description}
                        </p>
                    </div>
                    <Icon className="h-5 w-5 text-black/40" strokeWidth={2} />
                </div>
                {children}
            </div>
        </Card>
    );
}
