"use client";

import { Button } from "@/components/ui/button";
import { IconBox } from "@/components/ui/icon-box";
import { useBusinessNavigation } from "@/hooks/use-business-navigation";
import type { BusinessCategory } from "@/lib/types/business-category";
import type { Capability } from "@/lib/types/capability";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface RouteGuardProps {
    children: React.ReactNode;
    /** Optional: specific feature ID to check (if different from route) */
    featureId?: string;
    /** Optional: array of feature IDs - user needs access to at least one */
    featureIds?: string[];
    /** Optional: specific capability to check */
    capability?: Capability;
    /** Optional: array of capabilities - user needs access to at least one */
    anyCapability?: Capability[];
    /** Optional: array of capabilities - user needs access to ALL */
    allCapabilities?: Capability[];
    /** Optional: specific business category to check */
    category?: BusinessCategory;
}

/**
 * RouteGuard - Protects pages based on business type, capabilities, or category
 * Redirects or shows error if user doesn't have access to current route
 *
 * @example
 * // Check by route only (default)
 * <RouteGuard>{children}</RouteGuard>
 *
 * @example
 * // Check by capability
 * <RouteGuard capability="domicile">{children}</RouteGuard>
 *
 * @example
 * // Check by any of multiple capabilities
 * <RouteGuard anyCapability={["domicile", "atelier"]}>{children}</RouteGuard>
 *
 * @example
 * // Check by category
 * <RouteGuard category="INTERVENTION">{children}</RouteGuard>
 */
export function RouteGuard({
    children,
    featureId,
    featureIds,
    capability,
    anyCapability,
    allCapabilities,
    category,
}: RouteGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const {
        isRouteActive,
        isFeatureActive,
        isLoading,
        businessType,
        hasCapability,
        hasAnyCapability,
        hasAllCapabilities,
        isInCategory,
    } = useBusinessNavigation();
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);

    useEffect(() => {
        if (isLoading) return;

        // Check access based on route or feature ID(s)
        const routeAccess = isRouteActive(pathname);

        // Feature-based access check (legacy)
        let featureAccess = true;
        if (featureId) {
            featureAccess = isFeatureActive(featureId);
        } else if (featureIds && featureIds.length > 0) {
            featureAccess = featureIds.some((id) => isFeatureActive(id));
        }

        // Capability-based access check (new)
        let capabilityAccess = true;
        if (capability) {
            capabilityAccess = hasCapability(capability);
        } else if (anyCapability && anyCapability.length > 0) {
            capabilityAccess = hasAnyCapability(...anyCapability);
        } else if (allCapabilities && allCapabilities.length > 0) {
            capabilityAccess = hasAllCapabilities(...allCapabilities);
        }

        // Category-based access check (new)
        let categoryAccess = true;
        if (category) {
            categoryAccess = isInCategory(category);
        }

        const access =
            routeAccess && featureAccess && capabilityAccess && categoryAccess;
        setHasAccess(access);

        // If no access, log warning with details
        if (!access) {
            console.warn(
                `Access denied to ${pathname} for business type ${businessType}`,
                {
                    routeAccess,
                    featureAccess,
                    capabilityAccess,
                    categoryAccess,
                    checks: {
                        featureId,
                        capability,
                        anyCapability,
                        allCapabilities,
                        category,
                    },
                }
            );
        }
    }, [
        pathname,
        featureId,
        featureIds,
        capability,
        anyCapability,
        allCapabilities,
        category,
        isRouteActive,
        isFeatureActive,
        hasCapability,
        hasAnyCapability,
        hasAllCapabilities,
        isInCategory,
        isLoading,
        businessType,
    ]);

    // Loading state
    if (isLoading || hasAccess === null) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-black/10 border-t-black rounded-full animate-spin mx-auto" />
                    <p className="text-[14px] text-black/40">
                        Vérification des accès...
                    </p>
                </div>
            </div>
        );
    }

    // Access denied
    if (!hasAccess) {
        return (
            <div className="flex items-center justify-center min-h-[600px] p-8">
                <div className="max-w-md text-center space-y-6">
                    <IconBox
                        icon={AlertCircle}
                        size="xl"
                        shape="circle"
                        bgColor="bg-black/5"
                        iconColor="text-black/40"
                        className="mx-auto"
                    />
                    <div className="space-y-2">
                        <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-black">
                            Accès non autorisé
                        </h2>
                        <p className="text-[14px] text-black/60 leading-relaxed">
                            Cette fonctionnalité n'est pas disponible pour votre
                            type d'entreprise. Veuillez contacter le support si
                            vous pensez qu'il s'agit d'une erreur.
                        </p>
                    </div>
                    <Button
                        onClick={() => router.push("/dashboard")}
                        variant="outline"
                        className="border-black/10 hover:bg-black/5 h-11 px-6 text-[14px] font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2} />
                        Retour au tableau de bord
                    </Button>
                </div>
            </div>
        );
    }

    // Access granted
    return <>{children}</>;
}
