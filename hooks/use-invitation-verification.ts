import { useState, useEffect, useCallback } from "react";
import type {
    InvitationData,
    InvitationVerificationResult,
} from "@/lib/types/auth";

/**
 * Custom hook to verify invitation token
 * Automatically verifies the token when provided
 *
 * @param token - The invitation token from URL params
 * @returns Invitation data, loading state, and error message
 */
export function useInvitationVerification(
    token: string
): InvitationVerificationResult {
    const [invitationData, setInvitationData] = useState<InvitationData | null>(
        null
    );
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState("");

    const verifyInvitation = useCallback(async () => {
        setIsVerifying(true);
        setError("");

        try {
            const res = await fetch("/api/client/auth/verify-invitation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Invitation invalide");
                return;
            }

            setInvitationData(data.invitation);
        } catch (err) {
            setError("Erreur lors de la vérification de l'invitation");
        } finally {
            setIsVerifying(false);
        }
    }, [token]);

    useEffect(() => {
        if (!token) {
            setError(
                "Token d'invitation manquant. Vous devez être invité pour créer un compte."
            );
            return;
        }

        verifyInvitation();
    }, [token, verifyInvitation]);

    return { invitationData, isVerifying, error };
}
