import type { Client } from "@/hooks/use-clients";

/**
 * Get the full name of a client
 * @param nom - Last name
 * @param prenom - First name (optional)
 * @returns Full name or just last name if first name is not provided
 */
export function getClientFullName(
    nom: string,
    prenom?: string | null
): string {
    return prenom ? `${nom} ${prenom}` : nom;
}

/**
 * Get the initials of a client
 * @param nom - Last name
 * @param prenom - First name (optional)
 * @returns Two-letter initials
 */
export function getClientInitials(
    nom: string,
    prenom?: string | null
): string {
    return prenom
        ? `${nom.charAt(0)}${prenom.charAt(0)}`
        : nom.substring(0, 2);
}

/**
 * Format client location with postal code and city
 * @param ville - City name
 * @param codePostal - Postal code
 * @returns Formatted location string or null if no city
 */
export function formatClientLocation(
    ville?: string | null,
    codePostal?: string | null
): string | null {
    if (!ville) return null;
    return codePostal ? `${codePostal} ${ville}` : ville;
}

/**
 * Calculate the completion score for a client profile (0-100)
 * Based on: email (25%), telephone (25%), adresse (25%), ville+codePostal (25%)
 * @param client - Client object
 * @returns Completion score from 0 to 100
 */
export function calculateClientCompletionScore(client: Partial<Client>): number {
    let score = 0;
    if (client.email) score += 25;
    if (client.telephone) score += 25;
    if (client.adresse) score += 25;
    if (client.ville && client.codePostal) score += 25;
    return score;
}

/**
 * Determine client status based on days since last update
 * @param daysSinceUpdate - Number of days since last update
 * @returns Status: "active" (<=30), "warning" (31-90), or "inactive" (>90)
 */
export function getClientStatus(
    daysSinceUpdate: number
): "active" | "warning" | "inactive" {
    if (daysSinceUpdate <= 30) return "active";
    if (daysSinceUpdate <= 90) return "warning";
    return "inactive";
}

/**
 * Check if a client has contact information
 * @param client - Client object
 * @returns True if client has email or telephone
 */
export function hasContactInfo(client: Partial<Client>): boolean {
    return !!(client.email || client.telephone);
}

/**
 * Check if a client profile is complete
 * @param client - Client object
 * @returns True if all required fields are filled
 */
export function isClientComplete(client: Partial<Client>): boolean {
    return !!(
        client.email &&
        client.telephone &&
        client.adresse &&
        client.ville &&
        client.codePostal
    );
}
