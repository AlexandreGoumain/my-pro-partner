"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { BusinessType } from "@prisma/client";
import { NavigationBuilder } from "@/lib/navigation/core/navigation-builder";
import { ResolvedNavigation } from "@/lib/navigation/core/types";

/**
 * Hook to get business-adapted navigation
 * Returns navigation config based on the user's business type
 */
export function useBusinessNavigation() {
  const { data: session } = useSession();
  const [navigation, setNavigation] = useState<ResolvedNavigation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadNavigation() {
      try {
        setIsLoading(true);

        // Get business type from session or fetch from API
        let businessType: BusinessType = "GENERAL";

        if (session?.user) {
          // Try to get from session first
          businessType = (session.user as any).businessType || "GENERAL";

          // If not in session, fetch from API
          if (!businessType || businessType === "GENERAL") {
            const response = await fetch("/api/user/business-type");
            if (response.ok) {
              const data = await response.json();
              businessType = data.businessType || "GENERAL";
            }
          }
        }

        // Build navigation
        const nav = NavigationBuilder.build(businessType);
        setNavigation(nav);
      } catch (error) {
        console.error("Failed to load navigation:", error);
        // Fallback to general navigation
        const nav = NavigationBuilder.build("GENERAL");
        setNavigation(nav);
      } finally {
        setIsLoading(false);
      }
    }

    loadNavigation();
  }, [session]);

  return {
    navigation,
    isLoading,
    businessType: navigation?.businessType || "GENERAL",

    /** Check if a feature is active */
    isFeatureActive: (featureId: string) => {
      return navigation?.activeFeatures.includes(featureId) || false;
    },

    /** Check if a route is accessible */
    isRouteActive: (route: string) => {
      return navigation?.activeRoutes.includes(route) || false;
    },

    /** Get feature label with i18n */
    getFeatureLabel: (featureId: string, key: "singular" | "plural" = "plural") => {
      if (!navigation) return featureId;
      return NavigationBuilder.getFeatureLabel(featureId, navigation.businessType, key);
    },

    /** Get feature setting */
    getFeatureSetting: <T = any>(
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
  // This will be implemented in API route
  // For now, return default
  return "GENERAL";
}
