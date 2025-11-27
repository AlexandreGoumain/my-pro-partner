"use client";

import { cn } from "@/lib/utils";
import { AnalyticsKPICard, AnalyticsKPICardProps } from "./analytics-kpi-card";

export interface AnalyticsKPIGridProps {
    kpis: AnalyticsKPICardProps[];
    columns?: 2 | 3 | 4 | 5;
    className?: string;
}

const columnClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-5",
};

/**
 * AnalyticsKPIGrid - Grille de KPI pour les pages analytics
 *
 * Wrapper pour afficher plusieurs AnalyticsKPICard dans une grille responsive.
 *
 * @example
 * <AnalyticsKPIGrid
 *   kpis={[
 *     { title: "CA Total", value: "12 500€", icon: Euro },
 *     { title: "Factures", value: 45, subtitle: "ce mois", icon: Receipt },
 *   ]}
 *   columns={4}
 * />
 */
export function AnalyticsKPIGrid({
    kpis,
    columns = 4,
    className,
}: AnalyticsKPIGridProps) {
    return (
        <div className={cn("grid gap-4", columnClasses[columns], className)}>
            {kpis.map((kpi, index) => (
                <AnalyticsKPICard key={index} {...kpi} />
            ))}
        </div>
    );
}
