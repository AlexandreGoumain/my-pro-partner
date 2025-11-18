"use client";

import { Button } from "@/components/ui/button";
import { Check, Sparkles, ArrowRight, Zap, Crown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PLAN_FEATURES, PlanType } from "@/lib/pricing-config";
import { PLANS_CONFIG } from "@/lib/config/plans.config";

const plans: Array<{
    id: PlanType;
    metrics?: {
        roi?: string;
        aiSavings?: string;
        support?: string;
    };
    cta: string;
    badge?: string;
    popular?: boolean;
    isPremium?: boolean;
}> = [
    {
        id: "FREE",
        cta: "Démarrer gratuitement",
    },
    {
        id: "STARTER",
        metrics: {
            roi: "15h/semaine gagnées"
        },
        cta: "Obtenir Starter",
        badge: "Meilleur prix"
    },
    {
        id: "PRO",
        metrics: {
            roi: "25h/semaine gagnées",
            aiSavings: "95% temps gagné"
        },
        cta: "Obtenir Pro",
        popular: true,
        badge: "Le plus populaire",
    },
    {
        id: "ENTERPRISE",
        metrics: {
            roi: "40h/semaine gagnées",
            support: "ROI: 8x"
        },
        cta: "Contacter l'équipe",
        badge: "Premium",
        isPremium: true
    },
];

export function Pricing() {
    const [isAnnual, setIsAnnual] = useState(true);

    return (
        <section
            id="pricing"
            className="px-6 bg-white scroll-fade-in"
            style={{
                paddingTop: 'var(--section-padding-top-large)',
                paddingBottom: 'var(--section-padding-bottom-large)'
            }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h2 className="text-[48px] font-semibold tracking-tight-premium text-black mb-4">
                        Un prix adapté à votre ambition
                    </h2>
                    <p className="text-[18px] text-black/50 mb-8 tracking-wide-premium">
                        Démarrez gratuitement. Évoluez à votre rythme.
                    </p>

                    {/* Annual/Monthly Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => setIsAnnual(false)}
                            className={`text-[14px] font-medium tracking-wide-premium transition-colors ${
                                !isAnnual ? "text-black" : "text-black/40"
                            }`}
                        >
                            Mensuel
                        </button>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="relative inline-flex h-7 w-12 items-center rounded-full bg-black/10 transition-all ease-premium"
                            style={{ transitionDuration: '0.3s' }}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-black transition-transform ease-premium ${
                                    isAnnual ? "translate-x-6" : "translate-x-1"
                                }`}
                                style={{ transitionDuration: '0.3s' }}
                            />
                        </button>
                        <button
                            onClick={() => setIsAnnual(true)}
                            className={`text-[14px] font-medium tracking-wide-premium transition-colors flex items-center gap-2 ${
                                isAnnual ? "text-black" : "text-black/40"
                            }`}
                        >
                            Annuel
                            <span className="px-2 py-0.5 rounded-full bg-black text-white text-[11px] font-semibold tracking-wide-premium">
                                -18%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid lg:grid-cols-4 gap-6 mb-12">
                    {plans.map((planConfig) => {
                        const plan = PLANS_CONFIG[planConfig.id];
                        const features = PLAN_FEATURES[planConfig.id];
                        const annualPricePerMonth = Math.round(plan.price.yearly / 12);

                        return (
                            <div
                                key={planConfig.id}
                                className={`relative p-6 rounded-2xl border transition-all ease-premium ${
                                    planConfig.popular
                                        ? "bg-black text-white border-black shadow-stripe scale-105"
                                        : "bg-white border-black/[0.08] card-shadow shadow-stripe-hover hover:border-black/[0.15]"
                                }`}
                                style={{ transitionDuration: '0.4s' }}
                            >
                                {/* Badge */}
                                {planConfig.badge && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <div className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide-premium ${
                                            planConfig.popular
                                                ? "bg-white text-black"
                                                : "bg-black text-white"
                                        }`}>
                                            {planConfig.badge}
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col h-full">
                                    {/* Header */}
                                    <div className="mb-6">
                                        <h3 className={`text-[20px] font-semibold mb-1 tracking-wide-premium ${
                                            planConfig.popular ? "text-white" : "text-black"
                                        }`}>
                                            {plan.name}
                                        </h3>
                                        <p className={`text-[13px] tracking-wide-premium ${
                                            planConfig.popular ? "text-white/60" : "text-black/50"
                                        }`}>
                                            {plan.description}
                                        </p>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-6">
                                        <div className="flex items-baseline gap-1">
                                            <span className={`text-[48px] font-semibold tracking-tight-premium ${
                                                planConfig.popular ? "text-white" : "text-black"
                                            }`}>
                                                {isAnnual ? annualPricePerMonth : plan.price.monthly}€
                                            </span>
                                            <span className={`text-[14px] tracking-wide-premium ${
                                                planConfig.popular ? "text-white/60" : "text-black/50"
                                            }`}>
                                                /mois
                                            </span>
                                        </div>
                                        {isAnnual && plan.price.monthly > 0 && (
                                            <p className={`text-[12px] tracking-wide-premium ${
                                                planConfig.popular ? "text-white/50" : "text-black/40"
                                            }`}>
                                                Facturé {plan.price.yearly}€/an
                                            </p>
                                        )}
                                    </div>

                                    {/* Metrics */}
                                    {planConfig.metrics && (
                                        <div className={`space-y-2 mb-6 pb-6 border-b ${
                                            planConfig.popular ? "border-white/10" : "border-black/[0.08]"
                                        }`}>
                                            {planConfig.metrics.roi && (
                                                <div className="flex items-center gap-2">
                                                    <Zap className={`w-3.5 h-3.5 ${planConfig.popular ? "text-white/60" : "text-black/60"}`} strokeWidth={2} />
                                                    <span className={`text-[11px] font-medium tracking-wide-premium ${planConfig.popular ? "text-white/80" : "text-black/70"}`}>
                                                        {planConfig.metrics.roi}
                                                    </span>
                                                </div>
                                            )}
                                            {planConfig.metrics.aiSavings && (
                                                <div className="flex items-center gap-2">
                                                    <Sparkles className={`w-3.5 h-3.5 ${planConfig.popular ? "text-white/60" : "text-black/60"}`} strokeWidth={2} />
                                                    <span className={`text-[11px] font-medium tracking-wide-premium ${planConfig.popular ? "text-white/80" : "text-black/70"}`}>
                                                        {planConfig.metrics.aiSavings}
                                                    </span>
                                                </div>
                                            )}
                                            {planConfig.metrics.support && (
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp className={`w-3.5 h-3.5 ${planConfig.popular ? "text-white/60" : "text-black/60"}`} strokeWidth={2} />
                                                    <span className={`text-[11px] font-medium tracking-wide-premium ${planConfig.popular ? "text-white/80" : "text-black/70"}`}>
                                                        {planConfig.metrics.support}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Features */}
                                    <div className="space-y-3 flex-1 mb-6">
                                        {features.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <Check
                                                    className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                                                        planConfig.popular ? "text-white" : "text-black"
                                                    }`}
                                                    strokeWidth={2.5}
                                                />
                                                <span className={`text-[13px] tracking-wide-premium ${
                                                    planConfig.popular ? "text-white/80" : "text-black/70"
                                                }`}>
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <Link
                                        href={planConfig.id === "ENTERPRISE" ? "/contact" : "/auth/register"}
                                        className="block"
                                    >
                                        <Button
                                            className={`w-full h-11 text-[14px] font-medium ${
                                                planConfig.popular
                                                    ? "bg-white hover:bg-white/95 text-black"
                                                    : "bg-black hover:bg-black/90 text-white"
                                            }`}
                                        >
                                            {planConfig.cta}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Info */}
                <div className="text-center">
                    <p className="text-[13px] text-black/40 tracking-wide-premium">
                        14 jours gratuits • Sans carte bancaire • Migration gratuite
                    </p>
                </div>
            </div>
        </section>
    );
}
