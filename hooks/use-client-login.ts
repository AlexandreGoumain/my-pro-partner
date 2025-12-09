import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

export interface ClientLoginData {
    email: string;
    password: string;
}

export interface UseClientLoginReturn {
    isLoading: boolean;
    error: string | null;
    login: (data: ClientLoginData) => Promise<boolean>;
}

/**
 * Custom hook for client login
 * Handles authentication API call - token is now stored in HttpOnly cookie
 */
export function useClientLogin(): UseClientLoginReturn {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = useCallback(
        async (data: ClientLoginData): Promise<boolean> => {
            setError(null);
            setIsLoading(true);

            try {
                // Security: Use credentials: 'include' to receive HttpOnly cookie
                const res = await fetch("/api/client/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(data),
                });

                const responseData = await res.json();

                if (!res.ok) {
                    setError(
                        responseData.message || "Erreur de connexion"
                    );
                    return false;
                }

                // Token is now set as HttpOnly cookie by the server
                // Redirect to dashboard
                router.push("/client/dashboard");

                return true;
            } catch (err) {
                setError("Erreur de connexion. Veuillez réessayer.");
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [router]
    );

    return {
        isLoading,
        error,
        login,
    };
}
