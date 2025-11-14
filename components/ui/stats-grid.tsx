import { cn } from "@/lib/utils";
import { StatCard, StatCardProps } from "./stat-card";

export interface StatsGridProps {
    stats: StatCardProps[];
    columns?: 2 | 3 | 4 | 5;
    className?: string;
}

const columnClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-5",
};

export function StatsGrid({ stats, columns = 4, className }: StatsGridProps) {
    return (
        <div className={cn("grid gap-4", columnClasses[columns], className)}>
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
}
