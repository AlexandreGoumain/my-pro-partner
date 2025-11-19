"use client";

import { Button } from "@/components/ui/button";
import { PLAN_ABONNEMENT } from "@/lib/config/activity-plan-mapping";
import { BusinessType } from "@/lib/types/business";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { ActivityRecommendationCard } from "./activity-recommendation-card";
import { PlanComparisonModal } from "./plan-comparison-modal";
import { PlanSelectionCards } from "./plan-selection-cards";

type PlanAbonnement = (typeof PLAN_ABONNEMENT)[keyof typeof PLAN_ABONNEMENT];

interface OnboardingStepPlanProps {
    businessType: BusinessType | null;
    selectedPlan: PlanAbonnement | null;
    onSelectPlan: (plan: PlanAbonnement) => void;
    onNext: () => void;
    onBack: () => void;
    canGoNext: boolean;
}

/**
 * Étape 3 de l'onboarding : Sélection du plan
 * Affiche la recommandation selon l'activité et les cards de plans
 */
export function OnboardingStepPlan({
    businessType,
    selectedPlan,
    onSelectPlan,
    onNext,
    onBack,
    canGoNext,
}: OnboardingStepPlanProps) {
    const [showComparison, setShowComparison] = useState(false);
    const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
        "monthly"
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                    Choisissez votre plan
                </h2>
                <p className="mt-2 text-[15px] text-black/60">
                    Démarrez avec le plan qui correspond à vos besoins
                </p>

                {/* Toggle mensuel/annuel */}
                <div className="mt-6 inline-flex items-center gap-3 rounded-lg border border-black/10 bg-black/2 p-1">
                    <button
                        type="button"
                        onClick={() => setBillingPeriod("monthly")}
                        className={`rounded-md px-6 py-2 text-[14px] font-medium transition-all duration-200 ${
                            billingPeriod === "monthly"
                                ? "bg-black text-white shadow-sm"
                                : "text-black/60 hover:text-black"
                        }`}
                    >
                        Mensuel
                    </button>
                    <button
                        type="button"
                        onClick={() => setBillingPeriod("yearly")}
                        className={`rounded-md px-6 py-2 text-[14px] font-medium transition-all duration-200 ${
                            billingPeriod === "yearly"
                                ? "bg-black text-white shadow-sm"
                                : "text-black/60 hover:text-black"
                        }`}
                    >
                        Annuel
                        <span
                            className={`ml-2 text-[12px] ${billingPeriod === "yearly" ? "text-white/60" : "text-black/40"}`}
                        >
                            -20%
                        </span>
                    </button>
                </div>
            </div>

            {/* Recommandation si activité sélectionnée */}
            {businessType && (
                <ActivityRecommendationCard
                    businessType={businessType}
                    onViewPlans={() => setShowComparison(true)}
                    className="mx-auto max-w-2xl"
                />
            )}

            {/* Sélection des plans */}
            <PlanSelectionCards
                businessType={businessType || undefined}
                selectedPlan={selectedPlan}
                onSelectPlan={onSelectPlan}
                billingPeriod={billingPeriod}
            />

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6">
                <Button
                    type="button"
                    onClick={onBack}
                    variant="ghost"
                    className="text-[14px] text-black/60 hover:text-black"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour
                </Button>

                <Button
                    type="button"
                    onClick={onNext}
                    disabled={!canGoNext}
                    className="h-11 bg-black px-8 text-[14px] font-medium text-white hover:bg-black/90"
                >
                    Continuer
                </Button>
            </div>

            {/* Modal de comparaison */}
            <PlanComparisonModal
                open={showComparison}
                onClose={() => setShowComparison(false)}
                onSelectPlan={(plan) => {
                    onSelectPlan(plan);
                    setShowComparison(false);
                }}
            />
        </div>
    );
}
