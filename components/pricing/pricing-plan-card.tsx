"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PLANS_CONFIG, PlanType } from "@/lib/config/plans.config";
import { IntervalType } from "@/lib/types/pricing";
import { getPlanIcon } from "@/lib/utils/pricing";
import { ArrowRight, Check } from "lucide-react";
import { PlanCardBadge } from "./plan-card-badge";

interface PricingPlanCardProps {
    plan: PlanType;
    interval: IntervalType;
    isCurrent: boolean;
    isFreePlan: boolean;
    onPlanClick: (plan: PlanType) => void;
}

const PLAN_DISPLAY_FEATURES: Record<PlanType, string[]> = {
    FREE: [
        "50 clients",
        "50 articles",
        "20 documents/mois",
        "1 utilisateur",
        "Gestion stock basique",
        "Export PDF",
    ],
    STARTER: [
        "500 clients",
        "200 articles",
        "100 documents/mois",
        "3 utilisateurs",
        "Gestion stock avancée",
        "Assistant IA (100 questions/mois)",
        "Programme de fidélité",
        "Support email 24h",
        "Export Excel & PDF",
    ],
    PRO: [
        "5 000 clients",
        "1 000 articles",
        "500 documents/mois",
        "10 utilisateurs",
        "Assistant IA illimité",
        "Segmentation clients",
        "Campagnes marketing",
        "Analytics avancées",
        "Support prioritaire",
        "API REST complète",
    ],
    ENTERPRISE: [
        "Tout illimité",
        "Utilisateurs illimités",
        "Support dédié 24/7",
        "Gestionnaire de compte",
        "API avancée & Webhooks",
        "SLA 99.9% garanti",
        "Onboarding personnalisé",
        "Formations incluses",
        "Intégrations sur mesure",
    ],
};

export function PricingPlanCard({
    plan,
    interval,
    isCurrent,
    isFreePlan,
    onPlanClick,
}: PricingPlanCardProps) {
    const planConfig = PLANS_CONFIG[plan];
    const features = PLAN_DISPLAY_FEATURES[plan];
    const isPopular = planConfig.popular || false;

    const monthlyPrice = planConfig.price.monthly;
    const yearlyPricePerMonth = Math.round(planConfig.price.yearly / 12);
    const displayPrice = interval === "month" ? monthlyPrice : yearlyPricePerMonth;

    return (
        <Card
            className={`relative overflow-hidden transition-all duration-200 ${
                isCurrent
                    ? "ring-2 ring-black shadow-md"
                    : isPopular
                    ? "ring-1 ring-black/20 shadow-md"
                    : "border-black/8 shadow-sm hover:shadow-md hover:border-black/15"
            }`}
        >
            {(isPopular || isCurrent) && (
                <PlanCardBadge type={isCurrent ? "current" : "popular"} />
            )}

            <CardContent className="p-0">
                <div className={`p-6 ${isCurrent || isPopular ? "pt-8" : ""}`}>
                    <div className="flex items-center gap-3 mb-5">
                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                                isCurrent
                                    ? "bg-black text-white"
                                    : "bg-black/5 text-black"
                            }`}
                        >
                            {getPlanIcon(plan)}
                        </div>
                        <div>
                            <h3 className="text-[20px] font-bold tracking-[-0.02em] text-black">
                                {planConfig.name}
                            </h3>
                            <p className="text-[13px] text-black/50">{planConfig.description}</p>
                        </div>
                    </div>

                    <div className="mb-5">
                        <div className="flex items-baseline gap-1">
                            <span className="text-[40px] font-bold tracking-[-0.03em] text-black leading-none">
                                {displayPrice}€
                            </span>
                            <span className="text-[14px] text-black/40">/mois</span>
                        </div>
                        {interval === "year" && monthlyPrice > 0 && (
                            <p className="text-[12px] text-black/50 mt-1">
                                Facturé {planConfig.price.yearly}€/an
                            </p>
                        )}
                        {interval === "month" && yearlyPricePerMonth > 0 && yearlyPricePerMonth < monthlyPrice && (
                            <p className="text-[12px] text-black/50 mt-1">
                                ou {yearlyPricePerMonth}€/mois en annuel
                            </p>
                        )}
                    </div>

                    {isCurrent ? (
                        <Button
                            disabled
                            className="w-full h-11 text-[14px] font-medium bg-black/5 border border-black/10"
                            variant="outline"
                        >
                            Plan actuel
                        </Button>
                    ) : isFreePlan ? (
                        <Button
                            onClick={() => onPlanClick(plan)}
                            className="w-full h-11 text-[14px] font-medium bg-black hover:bg-black/90 text-white"
                        >
                            Obtenir {planConfig.name}
                            <ArrowRight className="w-4 h-4 ml-2" strokeWidth={2} />
                        </Button>
                    ) : (
                        <Button
                            onClick={() => onPlanClick(plan)}
                            className="w-full h-11 text-[14px] font-medium border border-black/10 hover:bg-black/5"
                            variant="outline"
                        >
                            Changer de plan
                        </Button>
                    )}
                </div>

                <div className="h-px bg-black/8" />

                <div className="p-6">
                    <p className="text-[11px] font-semibold text-black/40 uppercase tracking-wider mb-4">
                        Inclus dans ce plan
                    </p>
                    <ul className="space-y-2.5">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2.5">
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black/5 mt-0.5 flex-shrink-0">
                                    <Check className="w-3 h-3 text-black" strokeWidth={2.5} />
                                </div>
                                <span className="text-[13px] text-black/70 leading-relaxed">
                                    {feature}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
