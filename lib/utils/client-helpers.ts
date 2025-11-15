import { DashboardClient } from "@/lib/types/dashboard";

/**
 * Gets the display name for a client
 * Prefers first name, falls back to last name
 */
export function getClientDisplayName(
    client: DashboardClient | null | undefined
): string {
    if (!client) return "Client";
    return client.prenom || client.nom || "Client";
}

/**
 * Checks if a client profile is complete
 * A complete profile has phone number and address
 */
export function isProfileComplete(
    client: DashboardClient | null | undefined
): boolean {
    if (!client) return false;
    return Boolean(client.telephone && client.adresse);
}
