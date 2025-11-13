/**
 * Analytics utilities for calculations and formatting
 */

import { Analytics, AnalyticsTrend } from "@/lib/types/analytics";

/**
 * Calculate revenue trend percentage
 */
export function calculateRevenueTrend(analytics: Analytics | undefined): AnalyticsTrend {
    if (!analytics || analytics.revenueLastMonth === 0) {
        return { value: 0, isPositive: true };
    }

    const value = ((analytics.revenueThisMonth - analytics.revenueLastMonth) / analytics.revenueLastMonth) * 100;

    return {
        value,
        isPositive: value >= 0,
    };
}

/**
 * Format trend percentage display
 */
export function formatTrendPercentage(trend: AnalyticsTrend): string {
    const prefix = trend.isPositive ? "+" : "";
    return `${prefix}${trend.value.toFixed(1)}%`;
}
