"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";
import { cn } from "@/lib/utils";

type PlanType = "FREE" | "STARTER" | "PRO" | "ENTERPRISE";
type IntervalType = "month" | "year";

interface PlanFeature {
    text: string;
    included: boolean;
}

interface Plan {
    name: string;
    id: PlanType;
    description: string;
    priceMonthly: number;
    priceYearly: number;
    popular?: boolean;
    features: PlanFeature[];
}

const PLANS: Plan[] = [
    {
        name: "Free",
        id: "FREE",
        description: "Pour découvrir MyProPartner",
        priceMonthly: 0,
        priceYearly: 0,
        features: [
            { text: "10 clients maximum", included: true },
            { text: "10 documents par mois", included: true },
            { text: "1 utilisateur", included: true },
            { text: "Gestion de stock basique", included: true },
            { text: "Assistant IA", included: false },
            { text: "Support prioritaire", included: false },
        ],
    },
    {
        name: "Starter",
        id: "STARTER",
        description: "Pour les artisans qui démarrent",
        priceMonthly: 29,
        priceYearly: 290, // Économie de 58€/an
        features: [
            { text: "50 clients", included: true },
            { text: "100 articles", included: true },
            { text: "Documents illimités", included: true },
            { text: "3 utilisateurs", included: true },
            { text: "Gestion de stock avancée", included: true },
            { text: "Assistant IA (100 questions/mois)", included: true },
            { text: "Programme de fidélité", included: true },
            { text: "Export Excel/PDF", included: true },
            { text: "Support email", included: true },
            { text: "Support prioritaire", included: false },
        ],
    },
    {
        name: "Pro",
        id: "PRO",
        description: "Pour les entreprises en croissance",
        priceMonthly: 79,
        priceYearly: 790, // Économie de 158€/an
        popular: true,
        features: [
            { text: "Clients illimités", included: true },
            { text: "Articles illimités", included: true },
            { text: "Documents illimités", included: true },
            { text: "10 utilisateurs", included: true },
            { text: "Gestion de stock complète", included: true },
            { text: "Assistant IA illimité", included: true },
            { text: "Programme de fidélité avancé", included: true },
            { text: "Segmentation clients", included: true },
            { text: "Campagnes marketing", included: true },
            { text: "Analytics avancées", included: true },
            { text: "Support prioritaire", included: true },
            { text: "API REST", included: true },
        ],
    },
    {
        name: "Enterprise",
        id: "ENTERPRISE",
        description: "Pour les grandes organisations",
        priceMonthly: 299,
        priceYearly: 2990, // Économie de 598€/an
        features: [
            { text: "Tout illimité", included: true },
            { text: "Utilisateurs illimités", included: true },
            { text: "Support dédié 24/7", included: true },
            { text: "Gestionnaire de compte", included: true },
            { text: "API avancée", included: true },
            { text: "SLA 99.9% garanti", included: true },
            { text: "Onboarding personnalisé", included: true },
            { text: "Formations incluses", included: true },
            { text: "Intégrations sur mesure", included: true },
            { text: "Marque blanche", included: true },
        ],
    },
];

export default function PricingPage() {
    const [interval, setInterval] = useState<IntervalType>("month");
    const { loading, subscribe } = useSubscription();
    const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);

    const handleSubscribe = async (planId: PlanType) => {
        if (planId === "FREE") {
            // Rediriger vers l'inscription gratuite
            window.location.href = "/auth/register";
            return;
        }

        setLoadingPlan(planId);
        await subscribe(planId as "STARTER" | "PRO" | "ENTERPRISE", interval);
        setLoadingPlan(null);
    };

    const getPrice = (plan: Plan) => {
        return interval === "month" ? plan.priceMonthly : plan.priceYearly;
    };

    const getSavings = (plan: Plan) => {
        if (interval === "year" && plan.priceMonthly > 0) {
            const yearlyTotal = plan.priceMonthly * 12;
            const savings = yearlyTotal - plan.priceYearly;
            return savings;
        }
        return 0;
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
                <h1 className="text-[48px] font-semibold tracking-[-0.02em] text-black mb-4">
                    Choisissez votre plan
                </h1>
                <p className="text-[18px] text-black/60 max-w-2xl mx-auto mb-8">
                    Démarrez gratuitement, upgradez quand vous êtes prêt. Tous les plans incluent 14 jours d'essai gratuit.
                </p>

                {/* Toggle mensuel/annuel */}
                <div className="inline-flex items-center gap-3 bg-black/5 p-1.5 rounded-lg">
                    <button
                        onClick={() => setInterval("month")}
                        className={cn(
                            "px-6 py-2 text-[14px] font-medium rounded-md transition-all duration-200",
                            interval === "month"
                                ? "bg-white text-black shadow-sm"
                                : "text-black/60 hover:text-black"
                        )}
                    >
                        Mensuel
                    </button>
                    <button
                        onClick={() => setInterval("year")}
                        className={cn(
                            "px-6 py-2 text-[14px] font-medium rounded-md transition-all duration-200 flex items-center gap-2",
                            interval === "year"
                                ? "bg-white text-black shadow-sm"
                                : "text-black/60 hover:text-black"
                        )}
                    >
                        Annuel
                        <span className="text-[12px] bg-black text-white px-2 py-0.5 rounded-full">
                            -17%
                        </span>
                    </button>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {PLANS.map((plan) => {
                        const price = getPrice(plan);
                        const savings = getSavings(plan);
                        const isLoading = loadingPlan === plan.id;

                        return (
                            <Card
                                key={plan.id}
                                className={cn(
                                    "relative p-8 border transition-all duration-200",
                                    plan.popular
                                        ? "border-black shadow-lg scale-105"
                                        : "border-black/8 hover:border-black/20 shadow-sm"
                                )}
                            >
                                {/* Badge Popular */}
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="bg-black text-white text-[12px] font-medium px-3 py-1 rounded-full">
                                            Le plus populaire
                                        </span>
                                    </div>
                                )}

                                {/* Nom du plan */}
                                <div className="mb-6">
                                    <h3 className="text-[24px] font-semibold tracking-[-0.01em] text-black mb-2">
                                        {plan.name}
                                    </h3>
                                    <p className="text-[14px] text-black/60">
                                        {plan.description}
                                    </p>
                                </div>

                                {/* Prix */}
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-1 mb-1">
                                        <span className="text-[40px] font-semibold tracking-[-0.02em] text-black">
                                            {price}€
                                        </span>
                                        {price > 0 && (
                                            <span className="text-[14px] text-black/60">
                                                /{interval === "month" ? "mois" : "an"}
                                            </span>
                                        )}
                                    </div>
                                    {savings > 0 && (
                                        <p className="text-[13px] text-black/60">
                                            Économisez {savings}€ par an
                                        </p>
                                    )}
                                    {plan.id !== "FREE" && (
                                        <p className="text-[13px] text-black/60 mt-1">
                                            Essai gratuit de 14 jours
                                        </p>
                                    )}
                                </div>

                                {/* Bouton CTA */}
                                <Button
                                    onClick={() => handleSubscribe(plan.id)}
                                    disabled={isLoading || (loading && loadingPlan !== plan.id)}
                                    className={cn(
                                        "w-full h-11 text-[14px] font-medium rounded-md mb-8 transition-all duration-200",
                                        plan.popular
                                            ? "bg-black hover:bg-black/90 text-white shadow-sm"
                                            : "border border-black/10 bg-white hover:bg-black/5 text-black"
                                    )}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Chargement...
                                        </>
                                    ) : plan.id === "FREE" ? (
                                        "Commencer gratuitement"
                                    ) : (
                                        `Obtenir ${plan.name}`
                                    )}
                                </Button>

                                {/* Features */}
                                <ul className="space-y-3">
                                    {plan.features.map((feature, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start gap-3 text-[14px]"
                                        >
                                            <Check
                                                className={cn(
                                                    "h-5 w-5 flex-shrink-0 mt-0.5",
                                                    feature.included
                                                        ? "text-black"
                                                        : "text-black/20"
                                                )}
                                                strokeWidth={2}
                                            />
                                            <span
                                                className={cn(
                                                    feature.included
                                                        ? "text-black"
                                                        : "text-black/40 line-through"
                                                )}
                                            >
                                                {feature.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* FAQ ou autres sections... */}
        </div>
    );
}
