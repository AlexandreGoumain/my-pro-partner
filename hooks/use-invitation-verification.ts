import { useState, useEffect } from "react";

interface InvitationData {
  email: string;
  nom: string | null;
  prenom: string | null;
  telephone: string | null;
  entrepriseName: string;
  expiresAt: string;
}

interface UseInvitationVerificationReturn {
  invitationData: InvitationData | null;
  isVerifying: boolean;
  error: string;
}

/**
 * Custom hook to verify invitation token
 * Automatically verifies the token when provided
 *
 * @param token - The invitation token from URL params
 * @returns Invitation data, loading state, and error message
 */
export function useInvitationVerification(
  token: string
): UseInvitationVerificationReturn {
  const [invitationData, setInvitationData] = useState<InvitationData | null>(
    null
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError(
        "Token d'invitation manquant. Vous devez être invité pour créer un compte."
      );
      return;
    }

    verifyInvitation();
  }, [token]);

  const verifyInvitation = async () => {
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
  };

  return { invitationData, isVerifying, error };
}
