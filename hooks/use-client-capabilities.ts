import { useMemo } from "react";
import { useClientAuth } from "./use-client-auth";
import type { Capability } from "@/lib/types/capability";
import type { BusinessType } from "@/lib/types/business";
import type { BusinessCategory } from "@/lib/types/business-category";

interface UseClientCapabilitiesReturn {
    /** Loading state */
    isLoading: boolean;
    /** Whether client is authenticated */
    isAuthenticated: boolean;
    /** Business type of the entreprise */
    businessType: BusinessType | null;
    /** Business category of the entreprise */
    category: BusinessCategory | null;
    /** List of all capabilities */
    capabilities: Capability[];
    /** Check if client has a specific capability */
    hasCapability: (cap: Capability) => boolean;
    /** Check if client has any of the specified capabilities */
    hasAnyCapability: (caps: Capability[]) => boolean;
    /** Check if client has all of the specified capabilities */
    hasAllCapabilities: (caps: Capability[]) => boolean;
    /** Pre-computed feature flags */
    features: {
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
    };
}

const DEFAULT_FEATURES = {
    hasDocuments: false,
    hasFidelite: false,
    hasAgenda: false,
    hasCreneaux: false,
    hasInterventions: false,
    hasContrats: false,
    hasGaranties: false,
    hasReservations: false,
    hasMenu: false,
    hasFitness: false,
    hasCours: false,
    hasImmobilier: false,
    hasBaux: false,
    hasCharges: false,
};

/**
 * Hook to access client capabilities and feature flags
 * Use this hook to conditionally render features based on the business type
 *
 * @example
 * const { hasCapability, features } = useClientCapabilities();
 *
 * // Check specific capability
 * if (hasCapability("agenda")) {
 *   // Show RDV booking
 * }
 *
 * // Use pre-computed feature flag
 * if (features.hasInterventions) {
 *   // Show interventions section
 * }
 */
export function useClientCapabilities(): UseClientCapabilitiesReturn {
    const {
        isLoading,
        isAuthenticated,
        entreprise,
        capabilities,
        features: apiFeatures
    } = useClientAuth(false); // Don't redirect, just check

    const hasCapability = useMemo(() => {
        return (cap: Capability) => capabilities.includes(cap);
    }, [capabilities]);

    const hasAnyCapability = useMemo(() => {
        return (caps: Capability[]) => caps.some(cap => capabilities.includes(cap));
    }, [capabilities]);

    const hasAllCapabilities = useMemo(() => {
        return (caps: Capability[]) => caps.every(cap => capabilities.includes(cap));
    }, [capabilities]);

    return {
        isLoading,
        isAuthenticated,
        businessType: entreprise?.businessType || null,
        category: entreprise?.category || null,
        capabilities,
        hasCapability,
        hasAnyCapability,
        hasAllCapabilities,
        features: apiFeatures || DEFAULT_FEATURES,
    };
}
