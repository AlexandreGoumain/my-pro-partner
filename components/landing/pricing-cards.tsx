"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, ArrowRight, Shield, TrendingUp, Zap, Crown, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PLAN_PRICING, PLAN_FEATURES, PlanType } from "@/lib/pricing-config";

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

export function PricingCards() {
    const [isAnnual, setIsAnnual] = useState(true);

    return (
        <section id="pricing" className="relative py-32 px-6 sm:px-8 bg-gradient-to-b from-white via-neutral-50/50 to-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-black/[0.015] rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-black/[0.015] rounded-full blur-3xl" />
            </div>

            <div className="max-w-[1400px] mx-auto relative">
                {/* Header */}
                <div className="text-center space-y-6 mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                        <Crown className="w-4 h-4 text-black/60" strokeWidth={2} />
                        <span className="text-[13px] text-black/60 font-medium">
                            Tarification transparente
                        </span>
                    </div>

                    <h2 className="text-[48px] sm:text-[64px] font-semibold tracking-[-0.03em] text-black leading-[1.05]">
                        Un prix adapté à votre ambition
                    </h2>
                    <p className="text-[19px] text-black/60 max-w-[680px] mx-auto leading-[1.5]">
                        Démarrez gratuitement. Évoluez à votre rythme.
                    </p>

                    {/* Annual/Monthly Toggle */}
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <button
                            onClick={() => setIsAnnual(false)}
                            className={`text-[15px] font-medium transition-colors ${
                                !isAnnual ? "text-black" : "text-black/40"
                            }`}
                        >
                            Mensuel
                        </button>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="relative inline-flex h-8 w-14 items-center rounded-full bg-black transition-colors"
                        >
                            <span
                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-sm ${
                                    isAnnual ? "translate-x-7" : "translate-x-1"
                                }`}
                            />
                        </button>
                        <button
                            onClick={() => setIsAnnual(true)}
                            className={`text-[15px] font-medium transition-colors flex items-center gap-2 ${
                                isAnnual ? "text-black" : "text-black/40"
                            }`}
                        >
                            Annuel
                            <span className="px-2.5 py-1 rounded-full bg-black text-white text-[12px] font-semibold">
                                -18%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Comparison with competitors */}
                <div className="mb-10 max-w-[900px] mx-auto">
                    <Card className="p-5 bg-gradient-to-br from-black via-black to-black/90 border-black text-white">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" strokeWidth={2} />
                                    <span className="text-[15px] font-semibold">Comparaison marché</span>
                                </div>
                                <p className="text-[13px] text-white/60">
                                    ERPs classiques : <span className="text-white font-semibold">75-300€/mois</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
                                <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
                                <span className="text-[14px] font-semibold">
                                    MyProPartner : dès 29€/mois
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Pricing Cards */}
                <div className="grid lg:grid-cols-4 gap-6 mb-12">
                    {plans.map((planConfig, index) => {
                        const planInfo = PLAN_PRICING[planConfig.id];
                        const features = PLAN_FEATURES[planConfig.id];

                        return (
                            <Card
                                key={planConfig.id}
                                className={`relative p-6 transition-all duration-500 ${
                                    planConfig.popular
                                        ? "bg-black text-white border-black shadow-2xl shadow-black/20 lg:scale-105 z-10 ring-2 ring-black"
                                        : planConfig.isPremium
                                        ? "bg-gradient-to-br from-neutral-900 via-black to-neutral-900 text-white border-black/50 shadow-xl"
                                        : "bg-white border-black/[0.08] hover:border-black/[0.15] hover:shadow-lg"
                                }`}
                            >
                                {/* Badge */}
                                {(planConfig.badge) && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-lg whitespace-nowrap text-[11px] font-semibold ${
                                            planConfig.popular
                                                ? "bg-white text-black border-black/[0.08]"
                                                : planConfig.isPremium
                                                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400"
                                                : "bg-black text-white border-black"
                                        }`}>
                                            {planConfig.popular && <Sparkles className="w-3 h-3" strokeWidth={2} />}
                                            {planConfig.isPremium && <Crown className="w-3 h-3" strokeWidth={2} />}
                                            {!planConfig.popular && !planConfig.isPremium && <Zap className="w-3 h-3" strokeWidth={2} />}
                                            <span>{planConfig.badge}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Content avec flex pour aligner les boutons */}
                                <div className="flex flex-col h-full">
                                    {/* Header */}
                                    <div className="space-y-4 mb-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3
                                                    className={`text-[24px] font-semibold tracking-[-0.02em] ${
                                                        planConfig.popular || planConfig.isPremium ? "text-white" : "text-black"
                                                    }`}
                                                >
                                                    {planInfo.name}
                                                </h3>
                                                {planConfig.isPremium && (
                                                    <Crown className="w-4 h-4 text-amber-400" strokeWidth={2} />
                                                )}
                                            </div>
                                            <p
                                                className={`text-[13px] ${
                                                    planConfig.popular || planConfig.isPremium ? "text-white/60" : "text-black/50"
                                                }`}
                                            >
                                                {planInfo.tagline}
                                            </p>
                                        </div>

                                        {/* Price */}
                                        <div className="space-y-1">
                                            <div className="flex items-baseline gap-2">
                                                <span
                                                    className={`text-[48px] font-semibold tracking-[-0.04em] leading-none ${
                                                        planConfig.popular || planConfig.isPremium ? "text-white" : "text-black"
                                                    }`}
                                                >
                                                    {isAnnual ? Math.round(planInfo.annualPrice) : planInfo.price}€
                                                </span>
                                                <span
                                                    className={`text-[15px] font-medium ${
                                                        planConfig.popular || planConfig.isPremium ? "text-white/60" : "text-black/50"
                                                    }`}
                                                >
                                                    /mois
                                                </span>
                                            </div>
                                            {isAnnual && planInfo.price > 0 && planInfo.savings && (
                                                <p
                                                    className={`text-[12px] ${
                                                        planConfig.popular || planConfig.isPremium ? "text-white/50" : "text-black/40"
                                                    }`}
                                                >
                                                    {planInfo.savings}
                                                </p>
                                            )}
                                        </div>

                                        {/* ROI Metrics */}
                                        {planConfig.metrics && (
                                            <div className={`space-y-1.5 pt-3 border-t ${
                                                planConfig.popular || planConfig.isPremium ? "border-white/[0.1]" : "border-black/[0.08]"
                                            }`}>
                                                {planConfig.metrics.roi && (
                                                    <div className="flex items-center gap-2">
                                                        <Zap className={`w-3.5 h-3.5 ${planConfig.popular || planConfig.isPremium ? "text-white/60" : "text-black/60"}`} strokeWidth={2} />
                                                        <span className={`text-[11px] font-medium ${planConfig.popular || planConfig.isPremium ? "text-white/80" : "text-black/70"}`}>
                                                            {planConfig.metrics.roi}
                                                        </span>
                                                    </div>
                                                )}
                                                {planConfig.metrics.aiSavings && (
                                                    <div className="flex items-center gap-2">
                                                        <Sparkles className={`w-3.5 h-3.5 ${planConfig.popular || planConfig.isPremium ? "text-white/60" : "text-black/60"}`} strokeWidth={2} />
                                                        <span className={`text-[11px] font-medium ${planConfig.popular || planConfig.isPremium ? "text-white/80" : "text-black/70"}`}>
                                                            {planConfig.metrics.aiSavings}
                                                        </span>
                                                    </div>
                                                )}
                                                {planConfig.metrics.support && (
                                                    <div className="flex items-center gap-2">
                                                        <TrendingUp className={`w-3.5 h-3.5 ${planConfig.popular || planConfig.isPremium ? "text-white/60" : "text-black/60"}`} strokeWidth={2} />
                                                        <span className={`text-[11px] font-medium ${planConfig.popular || planConfig.isPremium ? "text-white/80" : "text-black/70"}`}>
                                                            {planConfig.metrics.support}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Features - flex-1 pour pousser le bouton en bas */}
                                    <div className={`space-y-3 flex-1 pb-6 border-b ${
                                        planConfig.popular || planConfig.isPremium ? "border-white/[0.1]" : "border-black/[0.08]"
                                    }`}>
                                        {features.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <Check
                                                    className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                                                        planConfig.popular || planConfig.isPremium ? "text-white" : "text-black"
                                                    }`}
                                                    strokeWidth={2.5}
                                                />
                                                <span
                                                    className={`text-[13px] leading-[1.5] ${
                                                        planConfig.popular || planConfig.isPremium ? "text-white/80" : "text-black/70"
                                                    }`}
                                                >
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA Button - mt-auto pour toujours être en bas */}
                                    <div className="mt-auto pt-6 space-y-3">
                                        <Link
                                            href={
                                                planConfig.id === "ENTERPRISE"
                                                    ? "/contact"
                                                    : "/auth/register"
                                            }
                                            className="block"
                                        >
                                            <Button
                                                className={`w-full h-11 rounded-lg text-[14px] font-medium transition-all duration-300 shadow-sm hover:shadow-md group ${
                                                    planConfig.popular
                                                        ? "bg-white hover:bg-white/95 text-black"
                                                        : planConfig.isPremium
                                                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                                                        : "bg-black hover:bg-black/90 text-white"
                                                }`}
                                            >
                                                {planConfig.cta}
                                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                            </Button>
                                        </Link>

                                        {/* Ideal for badge */}
                                        <div className={`text-center py-1.5 px-3 rounded-lg ${
                                            planConfig.popular || planConfig.isPremium ? "bg-white/[0.05]" : "bg-black/[0.02]"
                                        }`}>
                                            <span className={`text-[11px] font-medium ${
                                                planConfig.popular || planConfig.isPremium ? "text-white/70" : "text-black/60"
                                            }`}>
                                                {planInfo.ideal}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Trust Badges - simplifié */}
                <div className="mb-10">
                    <div className="flex flex-wrap items-center justify-center gap-6 text-[13px]">
                        <div className="flex items-center gap-2 text-black/60">
                            <Check className="w-4 h-4 text-black" strokeWidth={2} />
                            <span>14 jours gratuits</span>
                        </div>
                        <div className="flex items-center gap-2 text-black/60">
                            <Shield className="w-4 h-4 text-black" strokeWidth={2} />
                            <span>Sans carte bancaire</span>
                        </div>
                        <div className="flex items-center gap-2 text-black/60">
                            <Star className="w-4 h-4 text-black" strokeWidth={2} />
                            <span>4.9/5 (500+ avis)</span>
                        </div>
                        <div className="flex items-center gap-2 text-black/60">
                            <TrendingUp className="w-4 h-4 text-black" strokeWidth={2} />
                            <span>Migration gratuite</span>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center">
                    <p className="text-[14px] text-black/60">
                        Questions ?{" "}
                        <Link href="/contact" className="text-black font-semibold hover:underline inline-flex items-center gap-1">
                            Contactez-nous
                            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}
