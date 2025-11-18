import { useMemo } from "react";

/**
 * Configuration for a stat calculation
 */
export interface StatConfig<T> {
  /** Unique key for the stat */
  key: string;
  /** Label for the stat */
  label: string;
  /** Function to filter items for this stat */
  filter: (item: T) => boolean;
  /** Optional aggregation function (default: count) */
  aggregate?: (items: T[]) => number;
}

/**
 * Calculated stat result
 */
export interface Stat {
  key: string;
  label: string;
  value: number;
}

/**
 * Hook to calculate stats from filtered data
 * Provides a flexible way to calculate multiple stats from an array
 *
 * @param items - Array of items to calculate stats from
 * @param configs - Array of stat configurations
 * @returns Object with stat values keyed by stat key
 *
 * @example
 * ```tsx
 * const articles = [{ type: 'PRODUIT', actif: true }, ...];
 *
 * const stats = useFilteredStats(articles, [
 *   { key: 'total', label: 'Total', filter: () => true },
 *   { key: 'produits', label: 'Produits', filter: (a) => a.type === 'PRODUIT' },
 *   { key: 'actifs', label: 'Actifs', filter: (a) => a.actif },
 * ]);
 *
 * // stats = { total: 10, produits: 7, actifs: 8 }
 * ```
 */
export function useFilteredStats<T>(
  items: T[],
  configs: StatConfig<T>[]
): Record<string, number> {
  return useMemo(() => {
    const stats: Record<string, number> = {};

    configs.forEach((config) => {
      const filteredItems = items.filter(config.filter);

      if (config.aggregate) {
        stats[config.key] = config.aggregate(filteredItems);
      } else {
        stats[config.key] = filteredItems.length;
      }
    });

    return stats;
  }, [items, configs]);
}

/**
 * Hook to calculate stats with additional metadata
 * Returns an array of stat objects with labels
 *
 * @param items - Array of items to calculate stats from
 * @param configs - Array of stat configurations
 * @returns Array of stat objects with key, label, and value
 *
 * @example
 * ```tsx
 * const articles = [{ type: 'PRODUIT', actif: true }, ...];
 *
 * const stats = useFilteredStatsWithLabels(articles, [
 *   { key: 'total', label: 'Total', filter: () => true },
 *   { key: 'produits', label: 'Produits', filter: (a) => a.type === 'PRODUIT' },
 * ]);
 *
 * // stats = [
 * //   { key: 'total', label: 'Total', value: 10 },
 * //   { key: 'produits', label: 'Produits', value: 7 }
 * // ]
 *
 * {stats.map(stat => (
 *   <div key={stat.key}>
 *     <span>{stat.label}</span>: {stat.value}
 *   </div>
 * ))}
 * ```
 */
export function useFilteredStatsWithLabels<T>(
  items: T[],
  configs: StatConfig<T>[]
): Stat[] {
  return useMemo(() => {
    return configs.map((config) => {
      const filteredItems = items.filter(config.filter);
      const value = config.aggregate
        ? config.aggregate(filteredItems)
        : filteredItems.length;

      return {
        key: config.key,
        label: config.label,
        value,
      };
    });
  }, [items, configs]);
}

/**
 * Common stat aggregation functions
 */
export const statAggregators = {
  /** Count items (default) */
  count: <T>(items: T[]): number => items.length,

  /** Sum a numeric field */
  sum: <T>(field: keyof T) => (items: T[]): number => {
    return items.reduce((sum, item) => {
      const value = item[field];
      return sum + (typeof value === "number" ? value : 0);
    }, 0);
  },

  /** Average a numeric field */
  average: <T>(field: keyof T) => (items: T[]): number => {
    if (items.length === 0) return 0;
    const total = statAggregators.sum<T>(field)(items);
    return total / items.length;
  },

  /** Get maximum value of a numeric field */
  max: <T>(field: keyof T) => (items: T[]): number => {
    if (items.length === 0) return 0;
    return Math.max(
      ...items.map((item) => {
        const value = item[field];
        return typeof value === "number" ? value : 0;
      })
    );
  },

  /** Get minimum value of a numeric field */
  min: <T>(field: keyof T) => (items: T[]): number => {
    if (items.length === 0) return 0;
    return Math.min(
      ...items.map((item) => {
        const value = item[field];
        return typeof value === "number" ? value : Number.MAX_SAFE_INTEGER;
      })
    );
  },
};
