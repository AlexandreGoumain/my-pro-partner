"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLAN_ABONNEMENT } from "@/lib/config/activity-plan-mapping";
import { BusinessType } from "@/lib/types/business";
import { PlanHeroSection } from "./plan-hero-section";
import { PlanBillingToggle } from "./plan-billing-toggle";
import { PlanTrialHighlight } from "./plan-trial-highlight";
import { PlanCardsGrid } from "./plan-cards-grid";
import { PlanTrustSignals } from "./plan-trust-signals";
import { PlanComparisonTrigger } from "./plan-comparison-trigger";
import { PlanRecapModal } from "./plan-recap-modal";
import { PlanComparisonModal } from "./plan-comparison-modal";

type PlanAbonnement = (typeof PLAN_ABONNEMENT)[keyof typeof PLAN_ABONNEMENT];

interface OnboardingStepPlanProps {
    businessType: BusinessType | null;
    companyName: string;
    selectedPlan: PlanAbonnement | null;
    onSelectPlan: (plan: PlanAbonnement) => void;
    onSubmit: (billingPeriod: "monthly" | "yearly") => void;
    onBack: () => void;
    isLoading?: boolean;
}

/**
 * Étape 2 de l'onboarding : Sélection du plan
 * Design conversion-optimisé avec éléments psychologiques
 */
export function OnboardingStepPlan({
    businessType,
    companyName,
    selectedPlan,
    onSelectPlan,
    onSubmit,
    onBack,
    isLoading = false,
}: OnboardingStepPlanProps) {
    const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
        "monthly"
    );
    const [showComparison, setShowComparison] = useState(false);
    const [showRecap, setShowRecap] = useState(false);

    const handleLaunch = () => {
        setShowRecap(true);
    };

    const handleConfirmPayment = () => {
        onSubmit(billingPeriod);
    };

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <PlanHeroSection />

            {/* Controls */}
            <div className="flex flex-col items-center gap-5">
                <PlanBillingToggle
                    billingPeriod={billingPeriod}
                    onBillingChange={setBillingPeriod}
                />

                <PlanTrialHighlight trialDays={14} trialPlan="PRO" />
            </div>

            {/* Plans Grid */}
            <PlanCardsGrid
                businessType={businessType}
                selectedPlan={selectedPlan}
                onSelectPlan={onSelectPlan}
                billingPeriod={billingPeriod}
            />

            {/* Trust Signals */}
            <PlanTrustSignals className="pt-2" />

            {/* Comparison Trigger */}
            <div className="text-center">
                <PlanComparisonTrigger onClick={() => setShowComparison(true)} />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-black/5">
                <Button
                    type="button"
                    onClick={onBack}
                    variant="ghost"
                    className="text-[14px] text-black/50 hover:text-black hover:bg-transparent"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour
                </Button>

                <Button
                    type="button"
                    onClick={handleLaunch}
                    disabled={isLoading || !selectedPlan}
                    className="h-11 bg-black px-8 text-[14px] font-medium text-white hover:bg-black/90 shadow-sm disabled:opacity-50"
                >
                    Lancer mon espace
                </Button>
            </div>

            {/* Comparison Modal */}
            <PlanComparisonModal
                open={showComparison}
                onClose={() => setShowComparison(false)}
                onSelectPlan={(plan) => {
                    onSelectPlan(plan);
                    setShowComparison(false);
                }}
            />

            {/* Recap Modal */}
            <PlanRecapModal
                open={showRecap}
                onClose={() => setShowRecap(false)}
                onConfirm={handleConfirmPayment}
                businessType={businessType}
                companyName={companyName}
                selectedPlan={selectedPlan}
                billingPeriod={billingPeriod}
                isLoading={isLoading}
            />
        </div>
    );
}
