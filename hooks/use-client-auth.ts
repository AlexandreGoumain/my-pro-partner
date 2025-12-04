import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Capability } from "@/lib/types/capability";
import type { BusinessType } from "@/lib/types/business";
import type { BusinessCategory } from "@/lib/types/business-category";

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

interface Entreprise {
    id: string;
    nom: string;
    businessType: BusinessType;
    category: BusinessCategory;
}

interface PortalFeatures {
    hasDocuments: boolean;
    hasFidelite: boolean;
    hasAgenda: boolean;
    hasCreneaux: boolean;
    hasInterventions: boolean;
    hasContrats: boolean;
    hasGaranties: boolean;
    hasReservations: boolean;
    hasMenu: boolean;
    hasFitness: boolean;
    hasCours: boolean;
    hasImmobilier: boolean;
    hasBaux: boolean;
    hasCharges: boolean;
}

interface UseClientAuthReturn {
    client: Client | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    entreprise: Entreprise | null;
    entrepriseName: string;
    clientName: string;
    initials: string;
    capabilities: Capability[];
    features: PortalFeatures | null;
    logout: () => void;
}

/**
 * Custom hook for client authentication
 * Checks if client is authenticated and redirects to login if not
 * Returns client info, capabilities and feature flags
 */
export function useClientAuth(redirectIfNotAuth = true): UseClientAuthReturn {
    const router = useRouter();
    const [client, setClient] = useState<Client | null>(null);
    const [entreprise, setEntreprise] = useState<Entreprise | null>(null);
    const [capabilities, setCapabilities] = useState<Capability[]>([]);
    const [features, setFeatures] = useState<PortalFeatures | null>(null);
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
                setEntreprise(data.entreprise || null);
                setCapabilities(data.capabilities || []);
                setFeatures(data.features || null);
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
        entreprise,
        entrepriseName: entreprise?.nom || "",
        clientName,
        initials,
        capabilities,
        features,
        logout,
    };
}
