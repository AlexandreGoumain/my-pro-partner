import type { Client } from "@/hooks/use-clients";

/**
 * Calculate a percentage and format it as a string
 * @param value - The numerator value
 * @param total - The denominator value
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string with % symbol, or "0%" if total is 0
 */
export function calculatePercentage(
    value: number,
    total: number,
    decimals: number = 0
): string {
    if (total === 0) return "0%";
    return `${((value / total) * 100).toFixed(decimals)}%`;
}

/**
 * Calculate a percentage as a number
 * @param value - The numerator value
 * @param total - The denominator value
 * @returns Percentage as a number (0-100), or 0 if total is 0
 */
export function calculatePercentageValue(
    value: number,
    total: number
): number {
    if (total === 0) return 0;
    return (value / total) * 100;
}

/**
 * Calculate growth rate between two periods
 * @param current - Current period value
 * @param previous - Previous period value
 * @returns Growth rate as a percentage
 */
export function calculateGrowthRate(
    current: number,
    previous: number
): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
}

/**
 * Calculate the absolute difference between two values
 * @param current - Current value
 * @param previous - Previous value
 * @returns Absolute difference
 */
export function calculateDifference(
    current: number,
    previous: number
): number {
    return current - previous;
}

/**
 * Aggregate clients by city and count them
 * @param clients - Array of clients
 * @returns Map of city names to client counts
 */
export function aggregateClientsByCity(
    clients: Client[]
): Map<string, number> {
    const citiesMap = new Map<string, number>();
    clients.forEach((client) => {
        if (client.ville) {
            citiesMap.set(client.ville, (citiesMap.get(client.ville) || 0) + 1);
        }
    });
    return citiesMap;
}

/**
 * Get top cities by client count
 * @param clients - Array of clients
 * @param limit - Maximum number of cities to return (default: 5)
 * @returns Array of [cityName, count] tuples sorted by count (descending)
 */
export function getTopCities(
    clients: Client[],
    limit: number = 5
): [string, number][] {
    const citiesMap = aggregateClientsByCity(clients);
    return Array.from(citiesMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit);
}

/**
 * Filter clients by a predicate function
 * @param clients - Array of clients
 * @param predicate - Filter function
 * @returns Filtered array of clients
 */
export function filterClients(
    clients: Client[],
    predicate: (client: Client) => boolean
): Client[] {
    return clients.filter(predicate);
}

/**
 * Count clients that match a predicate
 * @param clients - Array of clients
 * @param predicate - Filter function
 * @returns Number of matching clients
 */
export function countClients(
    clients: Client[],
    predicate: (client: Client) => boolean
): number {
    return clients.filter(predicate).length;
}
