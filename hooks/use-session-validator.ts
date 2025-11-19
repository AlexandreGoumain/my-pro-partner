"use client";

import { signOut } from "next-auth/react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

/**
 * Hook qui valide que la session utilisateur est toujours valide
 * Déconnecte automatiquement si le compte est supprimé
 */
export function useSessionValidator() {
    const hasChecked = useRef(false);

    useEffect(() => {
        // Ne vérifier qu'une seule fois au montage
        if (hasChecked.current) return;
        hasChecked.current = true;

        // Faire un appel API simple pour vérifier si l'utilisateur existe
        const validateSession = async () => {
            try {
                const response = await fetch("/api/user/me", {
                    method: "GET",
                });

                // Si l'utilisateur est supprimé ou introuvable
                if (response.status === 403 || response.status === 404) {
                    toast.error("Votre session a expiré");

                    // Déconnecter et rediriger
                    await signOut({ redirect: false });
                    window.location.href = "/auth/login";
                }
            } catch (error) {
                // Ignorer les erreurs réseau
                console.error("Session validation error:", error);
            }
        };

        validateSession();
    }, []);
}
