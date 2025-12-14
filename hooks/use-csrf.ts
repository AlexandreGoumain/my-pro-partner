/**
 * Hook for CSRF token management
 *
 * Usage:
 * ```tsx
 * const { csrfToken, fetchWithCsrf } = useCsrf();
 *
 * // Option 1: Use fetchWithCsrf (automatically includes CSRF header)
 * const response = await fetchWithCsrf('/api/clients', {
 *   method: 'POST',
 *   body: JSON.stringify(data),
 * });
 *
 * // Option 2: Use csrfToken directly
 * fetch('/api/clients', {
 *   method: 'POST',
 *   headers: { 'X-CSRF-Token': csrfToken },
 *   body: JSON.stringify(data),
 * });
 * ```
 */

import { useCallback, useEffect, useState } from "react";

interface UseCsrfReturn {
    csrfToken: string | null;
    isLoading: boolean;
    error: Error | null;
    refreshToken: () => Promise<void>;
    fetchWithCsrf: (url: string, options?: RequestInit) => Promise<Response>;
}

export function useCsrf(): UseCsrfReturn {
    const [csrfToken, setCsrfToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchToken = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch("/api/csrf");
            if (!response.ok) {
                throw new Error("Failed to fetch CSRF token");
            }

            const data = await response.json();
            setCsrfToken(data.csrfToken);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Unknown error"));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchToken();
    }, [fetchToken]);

    const fetchWithCsrf = useCallback(
        async (url: string, options?: RequestInit): Promise<Response> => {
            // Ensure we have a token
            let token = csrfToken;
            if (!token) {
                const response = await fetch("/api/csrf");
                const data = await response.json();
                token = data.csrfToken;
                setCsrfToken(token);
            }

            const headers = new Headers(options?.headers);
            headers.set("X-CSRF-Token", token || "");

            // Ensure JSON content type for POST/PUT/PATCH
            if (options?.body && typeof options.body === "string") {
                if (!headers.has("Content-Type")) {
                    headers.set("Content-Type", "application/json");
                }
            }

            return fetch(url, {
                ...options,
                headers,
            });
        },
        [csrfToken]
    );

    return {
        csrfToken,
        isLoading,
        error,
        refreshToken: fetchToken,
        fetchWithCsrf,
    };
}
