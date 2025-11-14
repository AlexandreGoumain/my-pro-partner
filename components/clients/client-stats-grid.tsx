import { StatisticsGrid, StatConfig } from "@/components/ui/statistics-grid";
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
    const stats: StatConfig[] = [
        {
            id: "total",
            icon: Users,
            label: "Clients enregistrés",
            value: total,
            badge: { text: "Total" },
        },
        {
            id: "new",
            icon: TrendingUp,
            label: "Nouveaux ce mois",
            value: newThisMonth,
            badge: { text: `+${newThisMonth}` },
        },
        {
            id: "active",
            icon: Zap,
            label: "Actifs (30j)",
            value: active,
            badge: { text: calculatePercentage(active, total) },
        },
        {
            id: "inactive",
            icon: inactive > 0 ? AlertCircle : Clock,
            label: "Inactifs (>90j)",
            value: inactive,
            badge:
                inactive > 0
                    ? {
                          text: "Action requise",
                          className: "bg-black/10 text-black/80",
                      }
                    : undefined,
            isClickable: inactive > 0,
            onClick: onInactiveClick,
        },
    ];

    return <StatisticsGrid stats={stats} columns={{ md: 2, lg: 4 }} gap={5} />;
}
