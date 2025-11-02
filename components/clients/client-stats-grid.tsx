import { StatCard } from "@/components/ui/stat-card";
import {
    Users,
    TrendingUp,
    Zap,
    AlertCircle,
    Clock,
} from "lucide-react";
import { calculatePercentage } from "@/lib/utils/statistics";

export interface ClientStatsGridProps {
    total: number;
    newThisMonth: number;
    active: number;
    inactive: number;
    onInactiveClick?: () => void;
}

export function ClientStatsGrid({
    total,
    newThisMonth,
    active,
    inactive,
    onInactiveClick,
}: ClientStatsGridProps) {
    return (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                icon={Users}
                label="Clients enregistrés"
                value={total}
                badge={{ text: "Total" }}
            />

            <StatCard
                icon={TrendingUp}
                label="Nouveaux ce mois"
                value={newThisMonth}
                badge={{ text: `+${newThisMonth}` }}
            />

            <StatCard
                icon={Zap}
                label="Actifs (30j)"
                value={active}
                badge={{ text: calculatePercentage(active, total) }}
            />

            <StatCard
                icon={inactive > 0 ? AlertCircle : Clock}
                label="Inactifs (>90j)"
                value={inactive}
                badge={
                    inactive > 0
                        ? {
                              text: "Action requise",
                              className: "bg-black/10 text-black/80",
                          }
                        : undefined
                }
                isClickable={inactive > 0}
                onClick={onInactiveClick}
                className={
                    inactive > 0
                        ? "border-black/20 hover:border-black/30"
                        : undefined
                }
            />
        </div>
    );
}
