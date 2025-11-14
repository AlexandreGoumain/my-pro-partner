import { StatCard, StatCardProps } from "@/components/ui/stat-card";
import { cn } from "@/lib/utils";

export interface StatConfig extends Omit<StatCardProps, "className"> {
    id?: string;
}

export interface StatisticsGridProps {
    stats: StatConfig[];
    columns?: {
        default?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
    };
    gap?: number;
    className?: string;
}

/**
 * Grille réutilisable pour afficher des statistiques
 * Unifie tous les patterns de stats grids dans l'application
 *
 * @example
 * ```tsx
 * <StatisticsGrid
 *   stats={[
 *     { icon: Users, label: "Total", value: 150, badge: { text: "Total" } },
 *     { icon: TrendingUp, label: "Nouveaux", value: 12, badge: { text: "+12" } }
 *   ]}
 *   columns={{ md: 2, lg: 4 }}
 * />
 * ```
 */
export function StatisticsGrid({
    stats,
    columns = { md: 2, lg: 4 },
    gap = 5,
    className,
}: StatisticsGridProps) {
    // Construire les classes de colonnes dynamiquement
    const gridColsClasses = [];

    if (columns.default) gridColsClasses.push(`grid-cols-${columns.default}`);
    if (columns.sm) gridColsClasses.push(`sm:grid-cols-${columns.sm}`);
    if (columns.md) gridColsClasses.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) gridColsClasses.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) gridColsClasses.push(`xl:grid-cols-${columns.xl}`);

    return (
        <div
            className={cn("grid", `gap-${gap}`, ...gridColsClasses, className)}
        >
            {stats.map((stat, index) => (
                <StatCard key={stat.id || `stat-${index}`} {...stat} />
            ))}
        </div>
    );
}
