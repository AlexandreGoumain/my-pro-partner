"use client";

import { cn } from "@/lib/utils";
import {
    PLAN_ABONNEMENT,
    getActivityRecommendation,
} from "@/lib/config/activity-plan-mapping";
import { BusinessType } from "@/lib/types/business";
import { PlanCard } from "./plan-card";

type PlanAbonnement = (typeof PLAN_ABONNEMENT)[keyof typeof PLAN_ABONNEMENT];

export interface PlanCardsGridProps {
    businessType?: BusinessType | null;
    selectedPlan: PlanAbonnement | null;
    onSelectPlan: (plan: PlanAbonnement) => void;
    billingPeriod: "monthly" | "yearly";
    className?: string;
}

// Plans à afficher (sans Enterprise)
const VISIBLE_PLANS: Exclude<PlanAbonnement, "ENTERPRISE">[] = [
    PLAN_ABONNEMENT.FREE,
    PLAN_ABONNEMENT.STARTER,
    PLAN_ABONNEMENT.PRO,
];

export function PlanCardsGrid({
    businessType,
    selectedPlan,
    onSelectPlan,
    billingPeriod,
    className,
}: PlanCardsGridProps) {
    // Déterminer le plan recommandé basé sur le type d'activité
    const recommendation = businessType
        ? getActivityRecommendation(businessType)
        : null;
    const recommendedPlan =
        recommendation?.recommendedPlan || PLAN_ABONNEMENT.STARTER;

    return (
        <div className={cn("space-y-6", className)}>
            {/* Grid des cards */}
            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
                {VISIBLE_PLANS.map((planId) => (
                    <PlanCard
                        key={planId}
                        planId={planId}
                        billingPeriod={billingPeriod}
                        isSelected={selectedPlan === planId}
                        isRecommended={planId === recommendedPlan}
                        onSelect={() => onSelectPlan(planId)}
                    />
                ))}
            </div>

            {/* Enterprise - Bientôt disponible */}
            <div className="text-center pt-4">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-black/[0.02] border border-black/5 text-[13px] text-black/30 cursor-not-allowed">
                    Entreprise
                    <span className="text-[11px] px-2 py-0.5 rounded bg-black/5 text-black/40">
                        Bientôt disponible
                    </span>
                </div>
            </div>
        </div>
    );
}
