import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    acceptInvitationSchema,
    type AcceptInvitationInput,
} from "@/lib/validation";
import type { TeamInvitationData } from "@/lib/types/auth";

export interface UseAcceptInvitationReturn {
    form: ReturnType<typeof useForm<AcceptInvitationInput>>;
    isLoading: boolean;
    isVerifying: boolean;
    error: string;
    success: boolean;
    invitation: TeamInvitationData | null;
    onSubmit: (data: AcceptInvitationInput) => Promise<void>;
}

/**
 * Custom hook to handle team invitation acceptance
 * Verifies the token and handles the form submission
 *
 * @param token - The invitation token from URL params
 * @returns Form handlers, loading states, invitation data, and submit handler
 */
export function useAcceptInvitation(
    token: string | null
): UseAcceptInvitationReturn {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [invitation, setInvitation] = useState<TeamInvitationData | null>(
        null
    );

    const form = useForm<AcceptInvitationInput>({
        resolver: zodResolver(acceptInvitationSchema),
        defaultValues: {
            name: "",
            prenom: "",
            telephone: "",
            password: "",
            confirmPassword: "",
        },
    });

    // Verify invitation token
    const verifyToken = useCallback(async () => {
        if (!token) {
            setError("Token d'invitation manquant");
            setIsVerifying(false);
            return;
        }

        try {
            const response = await fetch(
                `/api/team/accept-invitation?token=${token}`
            );
            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Invitation invalide");
                setIsVerifying(false);
                return;
            }

            if (data.valid && data.invitation) {
                setInvitation(data.invitation);
                // Pre-fill form fields if available
                if (data.invitation.name) {
                    form.setValue("name", data.invitation.name);
                }
                if (data.invitation.prenom) {
                    form.setValue("prenom", data.invitation.prenom);
                }
            } else {
                setError("Invitation invalide");
            }
        } catch (err) {
            console.error("Error verifying invitation:", err);
            setError("Erreur lors de la vérification de l'invitation");
        } finally {
            setIsVerifying(false);
        }
    }, [token, form]);

    // Verify token on mount
    useEffect(() => {
        verifyToken();
    }, [verifyToken]);

    // Handle form submission
    const onSubmit = async (data: AcceptInvitationInput) => {
        if (!token) return;

        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/team/accept-invitation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    ...data,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(
                    result.message ||
                        "Erreur lors de l'acceptation de l'invitation"
                );
                setIsLoading(false);
                return;
            }

            setSuccess(true);

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                router.push("/auth/login");
            }, 2000);
        } catch (err) {
            console.error("Error accepting invitation:", err);
            setError("Erreur lors de l'acceptation de l'invitation");
            setIsLoading(false);
        }
    };

    return {
        form,
        isLoading,
        isVerifying,
        error,
        success,
        invitation,
        onSubmit,
    };
}
