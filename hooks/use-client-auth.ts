import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
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

interface ClientAuthData {
    client: Client;
    entreprise: Entreprise | null;
    capabilities: Capability[];
    features: PortalFeatures | null;
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

async function fetchClientAuth(): Promise<ClientAuthData> {
    const res = await fetch("/api/client/auth/me", {
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Not authenticated");
    }

    return res.json();
}

/**
 * Custom hook for client authentication
 * Checks if client is authenticated and redirects to login if not
 * Returns client info, capabilities and feature flags
 */
export function useClientAuth(redirectIfNotAuth = true): UseClientAuthReturn {
    const router = useRouter();
    const queryClient = useQueryClient();
    const hasRedirected = useRef(false);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["client-auth"],
        queryFn: fetchClientAuth,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: false,
        refetchOnWindowFocus: true,
    });

    // Handle redirect on auth failure
    useEffect(() => {
        if (isError && redirectIfNotAuth && !hasRedirected.current) {
            hasRedirected.current = true;
            router.push("/client/login");
        }
    }, [isError, redirectIfNotAuth, router]);

    const logout = useCallback(async () => {
        try {
            await fetch("/api/client/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            queryClient.removeQueries({ queryKey: ["client-auth"] });
            router.push("/client/login");
        }
    }, [queryClient, router]);

    const client = data?.client ?? null;
    const entreprise = data?.entreprise ?? null;
    const capabilities = data?.capabilities ?? [];
    const features = data?.features ?? null;

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
