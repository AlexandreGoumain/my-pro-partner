import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Client {
    id: string;
    nom: string;
    prenom?: string;
    email?: string;
    points_solde: number;
    niveauFidelite?: {
        nom: string;
        remise: number;
        couleur: string;
    };
}

interface UseClientAuthReturn {
    client: Client | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    entrepriseName: string;
    clientName: string;
    initials: string;
    logout: () => void;
}

/**
 * Custom hook for client authentication
 * Checks if client is authenticated and redirects to login if not
 */
export function useClientAuth(redirectIfNotAuth = true): UseClientAuthReturn {
    const router = useRouter();
    const [client, setClient] = useState<Client | null>(null);
    const [entrepriseName, setEntrepriseName] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("clientToken");

                if (!token) {
                    if (redirectIfNotAuth) {
                        router.push("/client/login");
                    }
                    return;
                }

                const res = await fetch("/api/client/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    localStorage.removeItem("clientToken");
                    if (redirectIfNotAuth) {
                        router.push("/client/login");
                    }
                    return;
                }

                const data = await res.json();
                setClient(data.client);
                setEntrepriseName(data.entreprise?.nom || "");
            } catch (error) {
                console.error("Auth check failed:", error);
                if (redirectIfNotAuth) {
                    router.push("/client/login");
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router, redirectIfNotAuth]);

    const logout = () => {
        localStorage.removeItem("clientToken");
        router.push("/client/login");
    };

    // Compute client name and initials from client data
    const clientName = client
        ? `${client.nom} ${client.prenom || ""}`.trim()
        : "";
    const initials = client
        ? `${client.nom.charAt(0)}${client.prenom?.charAt(0) || ""}`.toUpperCase()
        : "C";

    return {
        client,
        isLoading,
        isAuthenticated: !!client,
        entrepriseName,
        clientName,
        initials,
        logout,
    };
}
