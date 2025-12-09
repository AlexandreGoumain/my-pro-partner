/**
 * Base fetch wrapper for client portal API calls
 * Security: Uses HttpOnly cookies for authentication (credentials: 'include')
 */
export async function clientApiFetch<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    // Security: Use credentials: 'include' to send HttpOnly cookies
    const response = await fetch(endpoint, {
        ...options,
        credentials: "include",
        headers: {
            ...options?.headers,
        },
    });

    if (!response.ok) {
        // Handle 401 specifically for redirect to login
        if (response.status === 401) {
            // Redirect to login page if unauthorized
            if (typeof window !== "undefined") {
                window.location.href = "/client/login";
            }
            throw new Error("Session expirée. Veuillez vous reconnecter.");
        }
        throw new Error(
            `API request failed: ${response.status} ${response.statusText}`
        );
    }

    return response.json();
}
