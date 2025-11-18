/**
 * Stat utilities and helpers
 * Common functions for formatting and transforming stat values
 */

import { type StatCardProps } from "./stat-card";
import { formatCurrency } from "@/lib/utils/format";
import { type LucideIcon } from "lucide-react";

export type StatValueFormat = "number" | "currency" | "percent" | "custom";

/**
 * Format a stat value based on type
 */
export function formatStatValue(
  value: number,
  format: StatValueFormat = "number",
  options?: {
    decimals?: number;
    currency?: string;
    suffix?: string;
    prefix?: string;
  }
): string {
  const { decimals = 0, currency = "EUR", suffix = "", prefix = "" } = options || {};

  switch (format) {
    case "currency":
      return formatCurrency(value, currency);

    case "percent":
      return `${value.toFixed(decimals)}%`;

    case "number":
      return new Intl.NumberFormat("fr-FR", {
        maximumFractionDigits: decimals,
      }).format(value);

    case "custom":
      return `${prefix}${value.toFixed(decimals)}${suffix}`;

    default:
      return String(value);
  }
}

/**
 * Create a stat config with formatted value
 * Helper to quickly create StatCardProps from raw data
 *
 * @example
 * ```ts
 * const stats = [
 *   createStatConfig("Chiffre d'affaires", 45678.50, "currency", TrendingUp, { change: 12.5 }),
 *   createStatConfig("Total clients", 1234, "number", Users),
 *   createStatConfig("Taux conversion", 3.2, "percent", Target),
 * ];
 * ```
 */
export function createStatConfig(
  label: string,
  value: number,
  format: StatValueFormat,
  icon?: LucideIcon,
  options?: {
    change?: number;
    subtitle?: string;
    variant?: StatCardProps["variant"];
    clickable?: boolean;
    onClick?: () => void;
    formatOptions?: Parameters<typeof formatStatValue>[2];
  }
): StatCardProps {
  const formattedValue = formatStatValue(value, format, options?.formatOptions);

  return {
    label,
    value: formattedValue,
    icon,
    change: options?.change,
    subtitle: options?.subtitle,
    variant: options?.variant,
    clickable: options?.clickable,
    onClick: options?.onClick,
  };
}

/**
 * Calculate percentage change between two values
 */
export function calculateChange(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * Common stat presets for quick setup
 */
export const statPresets = {
  /**
   * Create a revenue stat
   */
  revenue: (value: number, change?: number, subtitle?: string): StatCardProps => ({
    label: "Chiffre d'affaires",
    value: formatCurrency(value),
    change,
    subtitle,
    variant: "large",
  }),

  /**
   * Create a count stat
   */
  count: (label: string, value: number, icon?: LucideIcon, change?: number): StatCardProps => ({
    label,
    value: value.toString(),
    icon,
    change,
    variant: "compact",
  }),

  /**
   * Create a percentage stat
   */
  percentage: (label: string, value: number, icon?: LucideIcon): StatCardProps => ({
    label,
    value: `${value.toFixed(1)}%`,
    icon,
    variant: "compact",
  }),

  /**
   * Create an average stat
   */
  average: (label: string, value: number, format: StatValueFormat = "currency"): StatCardProps => ({
    label,
    value: formatStatValue(value, format, { decimals: 2 }),
    variant: "default",
  }),
};
