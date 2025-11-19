"use client";

import { Button } from "@/components/ui/button";
import {
    COMPLEXITY_DESCRIPTIONS,
    getActivityRecommendation,
    PLAN_ABONNEMENT,
} from "@/lib/config/activity-plan-mapping";
import { PLANS_CONFIG } from "@/lib/config/plans.config";
import { BusinessType } from "@/lib/types/business";
import { Check, Sparkles } from "lucide-react";

interface ActivityRecommendationCardProps {
    businessType: BusinessType;
    onViewPlans?: () => void;
    className?: string;
}

/**
 * Carte de recommandation de plan selon l'activité choisie
 * Affiche le plan recommandé, les raisons, et si un trial est disponible
 * Design sobre et épuré style Apple
 */
export function ActivityRecommendationCard({
    businessType,
    onViewPlans,
    className = "",
}: ActivityRecommendationCardProps) {
    const recommendation = getActivityRecommendation(businessType);

    // Utiliser les noms centralisés depuis PLANS_CONFIG
    const recommendedPlanName =
        PLANS_CONFIG[recommendation.recommendedPlan].name;
    const trialPlanName = PLANS_CONFIG[recommendation.trialPlan].name;
    const complexityDescription =
        COMPLEXITY_DESCRIPTIONS[recommendation.complexity];

    return (
        <div
            className={`rounded-lg border border-black/10 bg-white p-6 shadow-sm ${className}`}
        >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Sparkles
                            className="h-5 w-5 text-black/60"
                            strokeWidth={2}
                        />
                        <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-black">
                            Plan recommandé
                        </h3>
                    </div>
                    <p className="mt-1 text-[13px] text-black/40">
                        Pour votre type d&apos;activité
                    </p>
                </div>

                {/* Badge trial si applicable */}
                {recommendation.autoTrialIfFree && (
                    <div className="rounded-md bg-black/5 px-3 py-1.5">
                        <span className="text-[12px] font-medium text-black/80">
                            {recommendation.trialDays}j d&apos;essai offerts
                        </span>
                    </div>
                )}
            </div>

            {/* Plan recommandé */}
            <div className="mb-4 rounded-md bg-black/2 p-4">
                <div className="mb-2 text-[20px] font-semibold tracking-[-0.02em] text-black">
                    {recommendedPlanName}
                </div>
                <p className="text-[14px] leading-relaxed text-black/60">
                    {complexityDescription}
                </p>
            </div>

            {/* Raisons */}
            <div className="mb-4">
                <div className="mb-2 text-[13px] font-medium text-black/60">
                    Pourquoi ce plan ?
                </div>
                <div className="space-y-2">
                    {recommendation.reasons.slice(0, 3).map((reason, index) => (
                        <div key={index} className="flex items-start gap-2">
                            <Check
                                className="mt-0.5 h-4 w-4 flex-shrink-0 text-black/40"
                                strokeWidth={2}
                            />
                            <span className="text-[14px] text-black/60">
                                {reason}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features essentielles */}
            {recommendation.essentialFeatures.length > 0 && (
                <div className="mb-4">
                    <div className="mb-2 text-[13px] font-medium text-black/60">
                        Fonctionnalités clés
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {recommendation.essentialFeatures
                            .slice(0, 4)
                            .map((feature, index) => (
                                <div
                                    key={index}
                                    className="rounded-md bg-black/5 px-3 py-1.5 text-[12px] text-black/60"
                                >
                                    {feature}
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Avertissement pour FREE */}
            {recommendation.recommendedPlan !== PLAN_ABONNEMENT.FREE && (
                <div className="mb-4 rounded-md border border-black/8 bg-black/2 p-3">
                    <p className="text-[13px] leading-relaxed text-black/60">
                        Vous pouvez commencer en{" "}
                        <span className="font-medium text-black">
                            {PLANS_CONFIG.FREE.name}
                        </span>
                        , mais certaines fonctionnalités seront limitées.
                        {recommendation.autoTrialIfFree &&
                            ` Un essai ${trialPlanName} de ${recommendation.trialDays} jours sera automatiquement activé.`}
                    </p>
                </div>
            )}

            {/* CTA */}
            {onViewPlans && (
                <Button
                    type="button"
                    onClick={onViewPlans}
                    variant="outline"
                    className="h-11 w-full border-black/10 text-[14px] font-medium hover:bg-black/5"
                >
                    Comparer tous les plans
                </Button>
            )}
        </div>
    );
}
