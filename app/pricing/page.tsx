"use client";

import {
    PricingIntervalToggle,
    PublicPricingCard,
    PublicPricingHeader,
} from "@/components/pricing";
import { usePricingPage } from "@/hooks/use-pricing-page";
import { PLAN_FEATURES, PLAN_PRICING, PlanType } from "@/lib/pricing-config";
import { PlanFeature } from "@/lib/types/pricing";

const PRICING_PLANS_DATA = [
    {
        id: "FREE" as PlanType,
        priceMonthly: 0,
        priceYearly: 0,
    },
    {
        id: "STARTER" as PlanType,
        priceMonthly: 29,
        priceYearly: 290,
    },
    {
        id: "PRO" as PlanType,
        priceMonthly: 79,
        priceYearly: 790,
    },
    {
        id: "ENTERPRISE" as PlanType,
        priceMonthly: 299,
        priceYearly: 2990,
    },
];

export default function PricingPage() {
    const {
        interval,
        loadingPlan,
        loading,
        setInterval,
        handleSubscribe,
        getPrice,
        getSavings,
    } = usePricingPage();

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
                <PublicPricingHeader />

                {/* Toggle mensuel/annuel */}
                <PricingIntervalToggle
                    interval={interval}
                    onChange={setInterval}
                />
            </div>

            {/* Plans Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {PRICING_PLANS_DATA.map((planData) => {
                        const planInfo = PLAN_PRICING[planData.id];
                        const price = getPrice(
                            planData.priceMonthly,
                            planData.priceYearly
                        );
                        const savings = getSavings(
                            planData.priceMonthly,
                            planData.priceYearly
                        );
                        const isLoading = loadingPlan === planData.id;
                        const isPopular =
                            "popular" in planInfo && planInfo.popular;

                        const features: PlanFeature[] = PLAN_FEATURES[
                            planData.id
                        ].map((text) => ({
                            text,
                            included: true,
                        }));

                        return (
                            <PublicPricingCard
                                key={planData.id}
                                name={planInfo.name}
                                planId={planData.id}
                                description={planInfo.tagline}
                                price={price}
                                priceLabel={
                                    interval === "month" ? "/mois" : "/an"
                                }
                                savings={savings}
                                popular={isPopular}
                                features={features}
                                isLoading={isLoading || loading}
                                onSubscribe={handleSubscribe}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
