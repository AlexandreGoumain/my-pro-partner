import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface ResetPasswordData {
    token: string;
    newPassword: string;
}

export interface UseResetPasswordReturn {
    isLoading: boolean;
    success: boolean;
    resetPassword: (data: ResetPasswordData) => Promise<boolean>;
}

/**
 * Custom hook for resetting client password
 * Handles password reset API call and redirects on success
 */
export function useResetPassword(): UseResetPasswordReturn {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const resetPassword = useCallback(
        async (data: ResetPasswordData): Promise<boolean> => {
            if (!data.token) {
                toast.error("Token manquant");
                return false;
            }

            setIsLoading(true);

            try {
                const res = await fetch("/api/client/auth/reset-password", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token: data.token,
                        newPassword: data.newPassword,
                    }),
                });

                const responseData = await res.json();

                if (!res.ok) {
                    toast.error(
                        responseData.message ||
                            "Erreur lors de la réinitialisation"
                    );
                    return false;
                }

                setSuccess(true);
                toast.success(responseData.message);

                // Redirect to login after 2 seconds
                setTimeout(() => {
                    router.push("/client/login");
                }, 2000);

                return true;
            } catch (error) {
                console.error("[useResetPassword] Error:", error);
                toast.error(
                    "Erreur lors de la réinitialisation du mot de passe"
                );
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [router]
    );

    return {
        isLoading,
        success,
        resetPassword,
    };
}
