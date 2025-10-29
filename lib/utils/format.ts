/**
 * Centralized formatting utilities
 * Eliminates repeated formatting logic across components
 */

/**
 * Format currency in EUR
 */
export function formatCurrency(amount: number | string): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

/**
 * Calculate price with tax
 */
export function getPriceWithTax(priceHT: number, taxRate: number): number {
  return priceHT * (1 + taxRate / 100);
}

/**
 * Format quantity with optional unit
 */
export function formatQuantity(quantity: number, unit?: string | null): string {
  if (unit) {
    return `${quantity} ${unit}`;
  }
  return quantity.toString();
}

/**
 * Get stock status badge variant
 */
export function getStockStatus(
  stockActuel: number,
  stockMin: number
): "default" | "warning" | "destructive" {
  if (stockActuel === 0) return "destructive";
  if (stockActuel <= stockMin) return "warning";
  return "default";
}

/**
 * Get stock status text
 */
export function getStockStatusText(
  stockActuel: number,
  stockMin: number
): string {
  if (stockActuel === 0) return "Rupture";
  if (stockActuel <= stockMin) return "Stock faible";
  return "En stock";
}

/**
 * Format date to French locale
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
  }).format(dateObj);
}

/**
 * Format date and time to French locale
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(dateObj);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${value}%`;
}

/**
 * Parse form number input (handles empty strings)
 */
export function parseFormNumber(value: string, defaultValue: number = 0): number {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Parse form integer input (handles empty strings)
 */
export function parseFormInteger(value: string, defaultValue: number = 0): number {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}
