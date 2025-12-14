import { StatCard, StatCardProps } from "@/components/ui/stat-card";
import { cn } from "@/lib/utils";

// Mapping explicite pour éviter le purge de Tailwind
// Les classes dynamiques comme `grid-cols-${n}` ne fonctionnent pas en production
const gridColsMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
};

const smGridColsMap: Record<number, string> = {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
    5: "sm:grid-cols-5",
    6: "sm:grid-cols-6",
};

const mdGridColsMap: Record<number, string> = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
};

const lgGridColsMap: Record<number, string> = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
};

const xlGridColsMap: Record<number, string> = {
    1: "xl:grid-cols-1",
    2: "xl:grid-cols-2",
    3: "xl:grid-cols-3",
    4: "xl:grid-cols-4",
    5: "xl:grid-cols-5",
    6: "xl:grid-cols-6",
};

const gapMap: Record<number, string> = {
    0: "gap-0",
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
    8: "gap-8",
};

export interface StatConfig extends Omit<StatCardProps, "className"> {
    id?: string;
}

export interface StatisticsGridProps {
    stats: StatConfig[];
    columns?: {
        default?: 1 | 2 | 3 | 4 | 5 | 6;
        sm?: 1 | 2 | 3 | 4 | 5 | 6;
        md?: 1 | 2 | 3 | 4 | 5 | 6;
        lg?: 1 | 2 | 3 | 4 | 5 | 6;
        xl?: 1 | 2 | 3 | 4 | 5 | 6;
    };
    gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8;
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
    return (
        <div
            className={cn(
                "grid",
                gapMap[gap],
                columns.default && gridColsMap[columns.default],
                columns.sm && smGridColsMap[columns.sm],
                columns.md && mdGridColsMap[columns.md],
                columns.lg && lgGridColsMap[columns.lg],
                columns.xl && xlGridColsMap[columns.xl],
                className
            )}
        >
            {stats.map((stat, index) => (
                <StatCard key={stat.id || `stat-${index}`} {...stat} />
            ))}
        </div>
    );
}
