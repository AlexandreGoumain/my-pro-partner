import { useState, useCallback } from "react";
import { toast } from "sonner";

interface UsePasswordResetReturn {
    isLoading: boolean;
    success: boolean;
    resetLink: string | null;
    requestReset: (email: string) => Promise<void>;
    resetPassword: (token: string, newPassword: string) => Promise<boolean>;
}

/**
 * Custom hook for password reset functionality
 */
export function usePasswordReset(): UsePasswordResetReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [resetLink, setResetLink] = useState<string | null>(null);

    const requestReset = useCallback(async (email: string) => {
        if (!email) {
            toast.error("Veuillez entrer votre adresse email");
            return;
        }

        setIsLoading(true);
        setSuccess(false);
        setResetLink(null);

        try {
            const res = await fetch("/api/client/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Erreur lors de la demande");
                return;
            }

            setSuccess(true);

            // In development, show the reset link
            if (data.resetLink) {
                setResetLink(data.resetLink);
            }
        } catch (error) {
            toast.error("Erreur lors de la demande de réinitialisation");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const resetPassword = useCallback(
        async (token: string, newPassword: string): Promise<boolean> => {
            if (!token) {
                toast.error("Token manquant");
                return false;
            }

            if (newPassword.length < 8) {
                toast.error(
                    "Le mot de passe doit contenir au moins 8 caractères"
                );
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
                        token,
                        newPassword,
                    }),
                });

                const data = await res.json();

                if (!res.ok) {
                    toast.error(
                        data.message || "Erreur lors de la réinitialisation"
                    );
                    return false;
                }

                setSuccess(true);
                toast.success(data.message);
                return true;
            } catch (error) {
                toast.error("Erreur lors de la réinitialisation du mot de passe");
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    return {
        isLoading,
        success,
        resetLink,
        requestReset,
        resetPassword,
    };
}
