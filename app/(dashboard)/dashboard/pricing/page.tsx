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
import { PLANS_CONFIG, PlanType } from "@/lib/config/plans.config";
import { IntervalType } from "@/lib/types/pricing";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

const PLAN_ORDER: PlanType[] = ["FREE", "STARTER", "PRO", "ENTERPRISE"];

export default function PricingPage() {
    const { update: updateSession } = useSession();
    const subscriptionState = useSubscriptionStatus();

    const [interval, setInterval] = useState<IntervalType>("month");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);

    useEffect(() => {
        void updateSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePlanClick = useCallback(
        (plan: PlanType) => {
            if (subscriptionState.isSamePlan(plan)) return;
            setSelectedPlan(plan);
            setDialogOpen(true);
        },
        [subscriptionState]
    );

    return (
        <>
            <div className="min-h-screen px-6">
                <PricingPageHeader
                    interval={interval}
                    onIntervalChange={setInterval}
                />

                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {PLAN_ORDER.map((plan) => (
                            <PricingPlanCard
                                key={plan}
                                plan={plan}
                                interval={interval}
                                isCurrent={subscriptionState.isSamePlan(plan)}
                                isFreePlan={subscriptionState.currentPlan === "FREE"}
                                onPlanClick={handlePlanClick}
                            />
                        ))}
                    </div>
                </div>

                {subscriptionState.currentPlan !== "FREE" && (
                    <div className="max-w-2xl mx-auto mt-12">
                        <SubscriptionManagement />
                    </div>
                )}

                <PricingFooter />
            </div>

            <PlanChangeDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                targetPlan={selectedPlan}
            />
        </>
    );
}
