import { CLIENT_STORAGE_KEYS } from "@/lib/constants/client-storage";

/**
 * Base fetch wrapper for client portal API calls
 * Automatically includes authentication token
 */
export async function clientApiFetch<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const token = localStorage.getItem(CLIENT_STORAGE_KEYS.AUTH_TOKEN);

    if (!token) {
        throw new Error("No authentication token found");
    }

    const response = await fetch(endpoint, {
        ...options,
        headers: {
            ...options?.headers,
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(
            `API request failed: ${response.status} ${response.statusText}`
        );
    }

    return response.json();
}
