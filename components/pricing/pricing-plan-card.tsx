import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PLAN_FEATURES, PLAN_PRICING, PlanType } from "@/lib/pricing-config";
import { getPlanIcon } from "@/lib/utils/pricing";
import { ArrowRight, Check } from "lucide-react";
import { PlanCardBadge } from "./plan-card-badge";

interface PricingPlanCardProps {
    plan: PlanType;
    isCurrent: boolean;
    isFreePlan: boolean;
    onPlanClick: (plan: PlanType) => void;
}

export function PricingPlanCard({
    plan,
    isCurrent,
    isFreePlan,
    onPlanClick,
}: PricingPlanCardProps) {
    const planInfo = PLAN_PRICING[plan];
    const features = PLAN_FEATURES[plan];
    const isPopular = "popular" in planInfo && planInfo.popular;

    return (
        <Card
            className={`relative overflow-hidden transition-all duration-300 ${
                isCurrent
                    ? "ring-2 ring-black shadow-lg scale-105"
                    : "border-black/10 shadow-sm hover:shadow-md hover:border-black/20"
            } ${
                isPopular && !isCurrent
                    ? "ring-2 ring-black/30 shadow-md scale-[1.02]"
                    : ""
            }`}
        >
            {/* Badge flottant */}
            {(isPopular || isCurrent) && (
                <PlanCardBadge type={isCurrent ? "current" : "popular"} />
            )}

            <CardContent className="p-0">
                {/* Header section */}
                <div
                    className={`p-8 pb-6 ${isCurrent || isPopular ? "pt-10" : ""}`}
                >
                    {/* Icon + Name */}
                    <div className="flex items-center gap-3 mb-6">
                        <div
                            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                                isCurrent
                                    ? "bg-black text-white"
                                    : "bg-black/5 text-black"
                            } transition-all duration-300`}
                        >
                            {getPlanIcon(plan)}
                        </div>
                        <div>
                            <h3 className="text-[24px] font-bold tracking-[-0.02em] text-black">
                                {planInfo.name}
                            </h3>
                        </div>
                    </div>

                    {/* Prix */}
                    <div className="mb-4">
                        <div className="flex items-baseline gap-1">
                            <span className="text-[52px] font-bold tracking-[-0.04em] text-black leading-none">
                                {planInfo.price}€
                            </span>
                            <span className="text-[16px] text-black/40 mb-2">
                                /mois
                            </span>
                        </div>
                        {planInfo.annualPrice && (
                            <p className="text-[13px] text-black/50 mt-2">
                                ou {planInfo.annualPrice}€/mois facture
                                annuellement
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-[15px] text-black/60 leading-relaxed mb-6">
                        {planInfo.tagline}
                    </p>

                    {/* CTA Button */}
                    {isCurrent ? (
                        <Button
                            disabled
                            className="w-full h-12 text-[15px] font-semibold bg-black/5 border-2 border-black/10"
                            variant="outline"
                        >
                            ✓ Plan actuel
                        </Button>
                    ) : isFreePlan ? (
                        <Button
                            onClick={() => onPlanClick(plan)}
                            className="w-full h-12 text-[15px] font-semibold rounded-lg transition-all duration-300 bg-black hover:bg-black/90 text-white shadow-md hover:shadow-xl"
                        >
                            Obtenir {planInfo.name}
                            <ArrowRight
                                className="w-4 h-4 ml-2"
                                strokeWidth={2.5}
                            />
                        </Button>
                    ) : (
                        <Button
                            onClick={() => onPlanClick(plan)}
                            className="w-full h-12 text-[15px] font-semibold rounded-lg transition-all duration-300 border-2 border-black/10 hover:bg-black/5"
                            variant="outline"
                        >
                            Changer de plan
                        </Button>
                    )}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

                {/* Features section */}
                <div className="p-8 pt-6">
                    <p className="text-[12px] font-semibold text-black/40 uppercase tracking-wider mb-4">
                        Inclus dans ce plan
                    </p>
                    <ul className="space-y-3">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 mt-0.5 flex-shrink-0">
                                    <Check
                                        className="w-3.5 h-3.5 text-black"
                                        strokeWidth={3}
                                    />
                                </div>
                                <span className="text-[14px] text-black/70 leading-relaxed">
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
