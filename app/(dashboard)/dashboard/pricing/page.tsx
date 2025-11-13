"use client";

import {
    PricingFooter,
    PricingPageHeader,
    PricingPlanCard,
} from "@/components/pricing";
import {
    PlanChangeDialog,
    SubscriptionManagement,
} from "@/components/subscription";
import { useSubscriptionStatus } from "@/hooks/use-subscription-status";
import { PLAN_PRICING, PlanType } from "@/lib/pricing-config";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

export default function PricingPage() {
    const { update: updateSession } = useSession();
    const subscriptionState = useSubscriptionStatus();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);

    // Rafraîchir la session au chargement
    useEffect(() => {
        void updateSession();
    }, [updateSession]);

    const handlePlanClick = useCallback(
        (plan: PlanType) => {
            // Ignorer si c'est le plan actuel
            if (subscriptionState.isSamePlan(plan)) return;

            setSelectedPlan(plan);
            setDialogOpen(true);
        },
        [subscriptionState]
    );

    return (
        <>
            <div className="min-h-screen">
                {/* Hero Header */}
                <PricingPageHeader />

                {/* Grille des plans */}
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {(Object.keys(PLAN_PRICING) as PlanType[]).map(
                            (plan) => (
                                <PricingPlanCard
                                    key={plan}
                                    plan={plan}
                                    isCurrent={subscriptionState.isSamePlan(
                                        plan
                                    )}
                                    isFreePlan={
                                        subscriptionState.currentPlan === "FREE"
                                    }
                                    onPlanClick={handlePlanClick}
                                />
                            )
                        )}
                    </div>
                </div>

                {/* Gestion de l'abonnement (si plan actif) */}
                {subscriptionState.currentPlan !== "FREE" && (
                    <div className="max-w-2xl mx-auto mt-16">
                        <SubscriptionManagement />
                    </div>
                )}

                {/* FAQ ou Note en bas */}
                <PricingFooter />
            </div>

            {/* Dialog de changement de plan */}
            <PlanChangeDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                targetPlan={selectedPlan}
            />
        </>
    );
}
