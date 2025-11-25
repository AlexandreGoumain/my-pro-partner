"use client";

import { NavigationBuilder } from "@/lib/navigation/core/navigation-builder";
import { ResolvedNavigation } from "@/lib/navigation/core/types";
import { BusinessType } from "@/lib/types/business";
import type { BusinessCategory } from "@/lib/types/business-category";
import {
    BUSINESS_TYPE_DEFAULT_CAPABILITIES,
    BUSINESS_TYPE_TO_CATEGORY,
} from "@/lib/types/business-hierarchy";
import type { Capability } from "@/lib/types/capability";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";

// Constantes
const DEFAULT_BUSINESS_TYPE: BusinessType = "GENERAL";
const BUSINESS_TYPE_API_ENDPOINT = "/api/user/business-type";

// Type pour la session étendue avec businessType
interface SessionUser {
    businessType?: BusinessType;
}

/**
 * Extrait le businessType de la session NextAuth
 */
function getBusinessTypeFromSession(user: unknown): BusinessType | null {
    const sessionUser = user as SessionUser;
    return sessionUser?.businessType || null;
}

/**
 * Récupère le businessType depuis l'API
 */
async function fetchBusinessTypeFromAPI(): Promise<BusinessType> {
    try {
        const response = await fetch(BUSINESS_TYPE_API_ENDPOINT);
        if (response.ok) {
            const data = await response.json();
            return data.businessType || DEFAULT_BUSINESS_TYPE;
        }
    } catch (error) {
        console.error("Failed to fetch business type from API:", error);
    }
    return DEFAULT_BUSINESS_TYPE;
}

/**
 * Hook to get business-adapted navigation with capabilities
 * Returns navigation config based on the user's business type
 *
 * @example
 * const { hasCapability, isInCategory, businessType } = useBusinessNavigation();
 *
 * if (hasCapability("pos")) {
 *   // Show POS module
 * }
 */
export function useBusinessNavigation() {
    const { data: session } = useSession();
    const [navigation, setNavigation] = useState<ResolvedNavigation | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadNavigation() {
            try {
                setIsLoading(true);

                let businessType = DEFAULT_BUSINESS_TYPE;

                // Essayer de récupérer le businessType de la session
                if (session?.user) {
                    const sessionBusinessType = getBusinessTypeFromSession(
                        session.user
                    );

                    if (
                        sessionBusinessType &&
                        sessionBusinessType !== "GENERAL"
                    ) {
                        businessType = sessionBusinessType;
                    } else {
                        // Fallback: récupérer depuis l'API
                        businessType = await fetchBusinessTypeFromAPI();
                    }
                }

                // Construire la navigation
                const nav = NavigationBuilder.build(businessType);
                setNavigation(nav);
            } catch (error) {
                console.error("Failed to load navigation:", error);
                // Fallback vers navigation générale
                const nav = NavigationBuilder.build(DEFAULT_BUSINESS_TYPE);
                setNavigation(nav);
            } finally {
                setIsLoading(false);
            }
        }

        loadNavigation();
    }, [session]);

    // Business type courant
    const businessType = navigation?.businessType || DEFAULT_BUSINESS_TYPE;

    // Catégorie de l'entreprise
    const category = useMemo<BusinessCategory>(
        () => BUSINESS_TYPE_TO_CATEGORY[businessType],
        [businessType]
    );

    // Capabilities de l'entreprise
    const capabilities = useMemo<Capability[]>(
        () => BUSINESS_TYPE_DEFAULT_CAPABILITIES[businessType],
        [businessType]
    );

    // Vérifier si l'entreprise a une capability
    const hasCapability = useCallback(
        (capability: Capability): boolean => {
            return capabilities.includes(capability);
        },
        [capabilities]
    );

    // Vérifier si l'entreprise a toutes les capabilities
    const hasAllCapabilities = useCallback(
        (...caps: Capability[]): boolean => {
            return caps.every((cap) => capabilities.includes(cap));
        },
        [capabilities]
    );

    // Vérifier si l'entreprise a au moins une des capabilities
    const hasAnyCapability = useCallback(
        (...caps: Capability[]): boolean => {
            return caps.some((cap) => capabilities.includes(cap));
        },
        [capabilities]
    );

    // Vérifier si l'entreprise est dans une catégorie
    const isInCategory = useCallback(
        (cat: BusinessCategory): boolean => {
            return category === cat;
        },
        [category]
    );

    return {
        // Navigation
        navigation,
        isLoading,
        businessType,

        // Capabilities (nouveau)
        category,
        capabilities,
        hasCapability,
        hasAllCapabilities,
        hasAnyCapability,
        isInCategory,

        // Raccourcis catégories
        isIntervention: category === "INTERVENTION",
        isPointDeVente: category === "POINT_DE_VENTE",
        isRendezVous: category === "RENDEZ_VOUS",
        isServiceIntellectuel: category === "SERVICE_INTELLECTUEL",

        /** Check if a feature is active */
        isFeatureActive: (featureId: string) =>
            navigation?.activeFeatures.includes(featureId) ?? false,

        /** Check if a route is accessible */
        isRouteActive: (route: string) =>
            navigation?.activeRoutes.includes(route) ?? false,

        /** Get feature label with i18n */
        getFeatureLabel: (
            featureId: string,
            key: "singular" | "plural" = "plural"
        ) => {
            if (!navigation) return featureId;
            return NavigationBuilder.getFeatureLabel(
                featureId,
                navigation.businessType,
                key
            );
        },

        /** Get feature setting */
        getFeatureSetting: <T = unknown>(
            featureId: string,
            settingKey: string,
            defaultValue?: T
        ): T | undefined => {
            if (!navigation) return defaultValue;
            return NavigationBuilder.getFeatureSetting<T>(
                featureId,
                settingKey,
                navigation.businessType,
                defaultValue
            );
        },
    };
}

/**
 * Server-side function to get business type
 * Use this in Server Components
 */
export async function getBusinessType(): Promise<BusinessType> {
    // TODO: Implémenter la logique server-side
    // Pour l'instant, retourne la valeur par défaut
    return DEFAULT_BUSINESS_TYPE;
}
