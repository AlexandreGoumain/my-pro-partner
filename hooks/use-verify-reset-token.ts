import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

interface VerifyResetTokenResponse {
    valid: boolean;
    clientName?: string;
    message?: string;
}

interface UseVerifyResetTokenReturn {
    isVerifying: boolean;
    isValid: boolean | null;
    clientName: string;
}

/**
 * Custom hook to verify a password reset token and exchange it for a secure session cookie.
 * Handles token verification, URL cleanup, and error states.
 */
export function useVerifyResetToken(): UseVerifyResetTokenReturn {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const queryClient = useQueryClient();
    const hasCleanedUrl = useRef(false);

    const { data, isLoading, isFetched } = useQuery<VerifyResetTokenResponse>({
        queryKey: ["verify-reset-token", token],
        queryFn: async () => {
            if (!token) {
                return { valid: false, message: "Token manquant" };
            }

            const res = await fetch("/api/client/auth/verify-reset-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ token }),
            });

            const data = await res.json();

            if (!res.ok || !data.valid) {
                toast.error(data.message || "Token invalide ou expiré");
                return { valid: false, message: data.message };
            }

            return {
                valid: true,
                clientName: data.clientName || "",
            };
        },
        enabled: !!token || token === null, // Run when token is present OR explicitly null
        staleTime: Infinity, // Don't refetch - token verification is one-time
        retry: false,
        refetchOnWindowFocus: false,
    });

    // Security: Remove token from URL after successful verification
    useEffect(() => {
        if (data?.valid && !hasCleanedUrl.current) {
            hasCleanedUrl.current = true;
            window.history.replaceState({}, document.title, "/client/reset-password");
        }
    }, [data?.valid]);

    return {
        isVerifying: isLoading && !isFetched,
        isValid: isFetched ? (data?.valid ?? false) : null,
        clientName: data?.clientName || "",
    };
}
