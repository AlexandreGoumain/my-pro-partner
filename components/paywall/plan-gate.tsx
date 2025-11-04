"use client";

import { ReactNode } from "react";
import { PlanType, PlanLimits } from "@/lib/pricing-config";
import { usePlanLimits } from "@/hooks/use-plan-limits";
import { UpgradeCard } from "./upgrade-card";

interface PlanGateProps {
    /**
     * Plan actuel de l'utilisateur
     */
    userPlan: PlanType;

    /**
     * Fonctionnalité requise pour afficher le contenu
     */
    feature: keyof PlanLimits;

    /**
     * Contenu à afficher si l'utilisateur a accès
     */
    children: ReactNode;

    /**
     * Message personnalisé pour le paywall (optionnel)
     */
    upgradeMessage?: string;

    /**
     * Si true, affiche le contenu avec un overlay blur au lieu de le cacher complètement
     */
    showBlurred?: boolean;

    /**
     * Classe CSS personnalisée pour le wrapper
     */
    className?: string;
}

/**
 * Composant pour protéger du contenu derrière un plan payant
 *
 * @example
 * ```tsx
 * <PlanGate userPlan={user.plan} feature="canSegmentClients">
 *   <ClientSegmentation />
 * </PlanGate>
 * ```
 */
export function PlanGate({
    userPlan,
    feature,
    children,
    upgradeMessage,
    showBlurred = false,
    className = "",
}: PlanGateProps) {
    const { canUse, getUpgradeMessage, getUpgradePlan } = usePlanLimits(userPlan);

    const hasAccess = canUse(feature);
    const message = upgradeMessage || getUpgradeMessage(feature);
    const recommendedPlan = getUpgradePlan(feature);

    // Si l'utilisateur a accès, afficher le contenu
    if (hasAccess) {
        return <>{children}</>;
    }

    // Mode blur : afficher le contenu flouté avec un overlay
    if (showBlurred) {
        return (
            <div className={`relative ${className}`}>
                <div className="blur-sm pointer-events-none select-none">{children}</div>
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                    <UpgradeCard message={message} recommendedPlan={recommendedPlan} />
                </div>
            </div>
        );
    }

    // Mode complet : afficher uniquement le paywall
    return (
        <div className={className}>
            <UpgradeCard message={message} recommendedPlan={recommendedPlan} />
        </div>
    );
}
