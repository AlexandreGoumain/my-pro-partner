/**
 * Centralized date period calculations
 * Provides utilities for calculating date ranges based on predefined periods
 */

export type Period = "7d" | "30d" | "90d" | "12m" | "custom";

export interface DateRange {
  /** Start date of the current period */
  startDate: Date;
  /** End date of the current period (now) */
  endDate: Date;
  /** Start date of the previous period (for comparison) */
  previousStartDate: Date;
  /** End date of the previous period (= startDate of current period) */
  previousEndDate: Date;
}

/**
 * Calculate date ranges for a given period
 * @param period - The period to calculate (7d, 30d, 90d, 12m)
 * @param referenceDate - Reference date (defaults to now)
 * @returns DateRange with current and previous period dates
 *
 * @example
 * ```ts
 * const range = calculatePeriodDates("30d");
 * // Returns dates for last 30 days + previous 30 days for comparison
 * ```
 */
export function calculatePeriodDates(
  period: Exclude<Period, "custom">,
  referenceDate: Date = new Date()
): DateRange {
  const now = new Date(referenceDate);
  let daysOffset: number;

  switch (period) {
    case "7d":
      daysOffset = 7;
      break;
    case "30d":
      daysOffset = 30;
      break;
    case "90d":
      daysOffset = 90;
      break;
    case "12m":
      daysOffset = 365;
      break;
    default:
      daysOffset = 30;
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return {
    endDate: now,
    startDate: new Date(now.getTime() - daysOffset * millisecondsPerDay),
    previousEndDate: new Date(now.getTime() - daysOffset * millisecondsPerDay),
    previousStartDate: new Date(now.getTime() - (daysOffset * 2) * millisecondsPerDay),
  };
}

/**
 * Calculate a custom date range with previous period
 * @param startDate - Start date of the period
 * @param endDate - End date of the period
 * @returns DateRange with current and previous period dates
 *
 * @example
 * ```ts
 * const range = calculateCustomPeriodDates(
 *   new Date("2024-01-01"),
 *   new Date("2024-01-31")
 * );
 * ```
 */
export function calculateCustomPeriodDates(
  startDate: Date,
  endDate: Date
): DateRange {
  const periodDuration = endDate.getTime() - startDate.getTime();

  return {
    endDate,
    startDate,
    previousEndDate: startDate,
    previousStartDate: new Date(startDate.getTime() - periodDuration),
  };
}

/**
 * Get a human-readable label for a period
 * @param period - The period to get label for
 * @returns French label for the period
 *
 * @example
 * ```ts
 * getPeriodLabel("7d")  // "7 derniers jours"
 * getPeriodLabel("30d") // "30 derniers jours"
 * ```
 */
export function getPeriodLabel(period: Period): string {
  const labels: Record<Period, string> = {
    "7d": "7 derniers jours",
    "30d": "30 derniers jours",
    "90d": "90 derniers jours",
    "12m": "12 derniers mois",
    "custom": "Période personnalisée",
  };

  return labels[period] || labels["30d"];
}

/**
 * Calculate a date X days ago from reference date
 * @param days - Number of days ago
 * @param referenceDate - Reference date (defaults to now)
 * @returns Date X days ago
 *
 * @example
 * ```ts
 * const thirtyDaysAgo = getDaysAgo(30);
 * const weekAgo = getDaysAgo(7);
 * ```
 */
export function getDaysAgo(days: number, referenceDate: Date = new Date()): Date {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return new Date(referenceDate.getTime() - days * millisecondsPerDay);
}

/**
 * Check if a date is within a period
 * @param date - Date to check
 * @param period - Period to check against
 * @param referenceDate - Reference date (defaults to now)
 * @returns True if date is within the period
 *
 * @example
 * ```ts
 * const isRecent = isDateInPeriod(someDate, "30d");
 * ```
 */
export function isDateInPeriod(
  date: Date,
  period: Exclude<Period, "custom">,
  referenceDate: Date = new Date()
): boolean {
  const range = calculatePeriodDates(period, referenceDate);
  const timestamp = date.getTime();
  return timestamp >= range.startDate.getTime() && timestamp <= range.endDate.getTime();
}

/**
 * Calculate percentage change between two periods
 * @param current - Current period value
 * @param previous - Previous period value
 * @returns Percentage change (positive or negative)
 *
 * @example
 * ```ts
 * const change = calculatePercentageChange(150, 100); // 50
 * const change = calculatePercentageChange(75, 100);  // -25
 * ```
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
}
