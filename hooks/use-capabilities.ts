"use client";

import type { BusinessType } from "@/lib/types/business";
import type { BusinessCategory } from "@/lib/types/business-category";
import { BUSINESS_CATEGORY_LABELS } from "@/lib/types/business-category";
import {
    BUSINESS_TYPE_DEFAULT_CAPABILITIES,
    BUSINESS_TYPE_TO_CATEGORY,
} from "@/lib/types/business-hierarchy";
import type { Capability } from "@/lib/types/capability";
import { CAPABILITY_LABELS } from "@/lib/types/capability";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";

// Constantes
const DEFAULT_BUSINESS_TYPE: BusinessType = "GENERAL";
const BUSINESS_TYPE_API_ENDPOINT = "/api/user/business-type";

// Type pour la session étendue
interface SessionUser {
    businessType?: BusinessType;
}

/**
 * Hook pour accéder aux capabilities de l'entreprise courante
 *
 * @example
 * const { hasCapability, category, capabilities } = useCapabilities();
 *
 * if (hasCapability("pos")) {
 *   // Afficher le module caisse
 * }
 */
export function useCapabilities() {
    const { data: session, status } = useSession();
    const [businessType, setBusinessType] = useState<BusinessType>(
        DEFAULT_BUSINESS_TYPE
    );
    const [isLoading, setIsLoading] = useState(true);

    // Charger le business type
    useEffect(() => {
        async function loadBusinessType() {
            try {
                setIsLoading(true);

                // Essayer depuis la session d'abord
                if (session?.user) {
                    const sessionUser = session.user as SessionUser;
                    if (sessionUser?.businessType) {
                        setBusinessType(sessionUser.businessType);
                        setIsLoading(false);
                        return;
                    }
                }

                // Fallback vers l'API
                if (status === "authenticated") {
                    const response = await fetch(BUSINESS_TYPE_API_ENDPOINT);
                    if (response.ok) {
                        const data = await response.json();
                        setBusinessType(
                            data.businessType || DEFAULT_BUSINESS_TYPE
                        );
                    }
                }
            } catch (error) {
                console.error("Failed to load business type:", error);
            } finally {
                setIsLoading(false);
            }
        }

        if (status !== "loading") {
            loadBusinessType();
        }
    }, [session, status]);

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

    // Récupérer le label d'une capability
    const getCapabilityLabel = useCallback((capability: Capability): string => {
        return CAPABILITY_LABELS[capability];
    }, []);

    // Récupérer le label de la catégorie
    const getCategoryLabel = useCallback((): string => {
        return BUSINESS_CATEGORY_LABELS[category];
    }, [category]);

    return {
        // État
        isLoading,
        businessType,
        category,
        capabilities,

        // Labels
        categoryLabel: BUSINESS_CATEGORY_LABELS[category],
        getCapabilityLabel,
        getCategoryLabel,

        // Checks
        hasCapability,
        hasAllCapabilities,
        hasAnyCapability,
        isInCategory,

        // Helpers pour conditions courantes
        isIntervention: category === "INTERVENTION",
        isPointDeVente: category === "POINT_DE_VENTE",
        isRendezVous: category === "RENDEZ_VOUS",
        isServiceIntellectuel: category === "SERVICE_INTELLECTUEL",
        isCommerce: category === "COMMERCE",
        isImmobilier: category === "IMMOBILIER",
    };
}

/**
 * Hook simplifié pour vérifier une capability spécifique
 *
 * @example
 * const canUsePOS = useHasCapability("pos");
 */
export function useHasCapability(capability: Capability): boolean {
    const { hasCapability, isLoading } = useCapabilities();

    if (isLoading) return false;
    return hasCapability(capability);
}

/**
 * Hook pour récupérer la catégorie
 *
 * @example
 * const category = useBusinessCategory();
 */
export function useBusinessCategory(): BusinessCategory {
    const { category } = useCapabilities();
    return category;
}
