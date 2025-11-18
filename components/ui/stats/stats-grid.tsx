/**
 * Stats Grid Component
 * Responsive grid layout for displaying multiple stat cards
 */

import { cn } from "@/lib/utils";
import { StatCard, type StatCardProps } from "./stat-card";

export interface StatsGridProps {
  /** Array of stat configurations */
  stats: StatCardProps[];
  /** Number of columns (responsive) */
  columns?: 2 | 3 | 4;
  /** Gap between cards */
  gap?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
}

/**
 * Grid component to display multiple stat cards
 *
 * @example
 * ```tsx
 * <StatsGrid
 *   columns={4}
 *   stats={[
 *     { label: "Total clients", value: 1234, icon: Users },
 *     { label: "CA mensuel", value: "45 678 €", icon: TrendingUp, change: 12.5 },
 *     { label: "Commandes", value: 89, icon: ShoppingCart },
 *     { label: "Taux conversion", value: "3.2%", icon: Target },
 *   ]}
 * />
 * ```
 */
export function StatsGrid({
  stats,
  columns = 4,
  gap = "md",
  className,
}: StatsGridProps) {
  const gapClasses = {
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-6",
  };

  const columnClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={cn(
        "grid",
        columnClasses[columns],
        gapClasses[gap],
        className
      )}
    >
      {stats.map((stat, index) => (
        <StatCard key={stat.label || index} {...stat} />
      ))}
    </div>
  );
}

/**
 * Responsive stats section with optional title
 */
export interface StatsSectionProps extends StatsGridProps {
  /** Optional section title */
  title?: string;
  /** Optional section description */
  description?: string;
}

export function StatsSection({
  title,
  description,
  stats,
  columns = 4,
  gap = "md",
  className,
}: StatsSectionProps) {
  return (
    <div className={className}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-black">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-[14px] text-black/60 mt-1">{description}</p>
          )}
        </div>
      )}
      <StatsGrid stats={stats} columns={columns} gap={gap} />
    </div>
  );
}
