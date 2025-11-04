"use client";

import { PlanType, PlanLimits } from "@/lib/pricing-config";
import { usePlanLimits } from "@/hooks/use-plan-limits";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface LimitIndicatorProps {
    /**
     * Plan de l'utilisateur
     */
    userPlan: PlanType;

    /**
     * Clé de la limite à afficher
     */
    limitKey: keyof PlanLimits;

    /**
     * Valeur actuelle
     */
    currentValue: number;

    /**
     * Label à afficher
     */
    label: string;

    /**
     * Afficher la barre de progression
     */
    showProgress?: boolean;

    /**
     * Afficher le lien d'upgrade quand proche de la limite
     */
    showUpgradeLink?: boolean;
}

/**
 * Indicateur de limite avec barre de progression
 *
 * @example
 * ```tsx
 * <LimitIndicator
 *   userPlan={user.plan}
 *   limitKey="maxClients"
 *   currentValue={clients.length}
 *   label="Clients"
 *   showProgress
 * />
 * ```
 */
export function LimitIndicator({
    userPlan,
    limitKey,
    currentValue,
    label,
    showProgress = true,
    showUpgradeLink = true,
}: LimitIndicatorProps) {
    const { getProgress, format, getUpgradePlan } = usePlanLimits(userPlan);

    const progress = getProgress(limitKey, currentValue);
    const recommendedPlan = getUpgradePlan(limitKey);

    // Couleur en fonction du pourcentage
    const getProgressColor = () => {
        if (progress.isUnlimited) return "bg-black/20";
        if (progress.percentage >= 90) return "bg-red-500";
        if (progress.percentage >= 75) return "bg-orange-500";
        return "bg-black";
    };

    const isNearLimit = !progress.isUnlimited && progress.percentage >= 75;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-[13px] text-black/60">{label}</span>
                <span className="text-[13px] font-medium text-black">
                    {currentValue} / {format(progress.max)}
                </span>
            </div>

            {showProgress && !progress.isUnlimited && (
                <Progress value={progress.percentage} className="h-2" indicatorClassName={getProgressColor()} />
            )}

            {isNearLimit && showUpgradeLink && recommendedPlan && (
                <div className="flex items-start gap-2 p-2 bg-orange-50 border border-orange-200 rounded-md">
                    <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                    <div className="flex-1 space-y-1">
                        <p className="text-[12px] text-orange-900 font-medium">
                            Vous approchez de la limite
                        </p>
                        <Link
                            href={`/pricing?plan=${recommendedPlan}`}
                            className="text-[12px] text-orange-700 underline hover:text-orange-900"
                        >
                            Passer au plan {recommendedPlan}
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
