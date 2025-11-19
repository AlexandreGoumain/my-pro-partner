"use client";

import { Button } from "@/components/ui/button";
import {
    getActivityRecommendation,
    PLAN_ABONNEMENT,
} from "@/lib/config/activity-plan-mapping";
import { PLANS_CONFIG } from "@/lib/config/plans.config";
import { BusinessType } from "@/lib/types/business";
import { cn } from "@/lib/utils";
import { Check, Sparkles } from "lucide-react";

type PlanAbonnement = (typeof PLAN_ABONNEMENT)[keyof typeof PLAN_ABONNEMENT];

interface PlanSelectionCardsProps {
    businessType?: BusinessType;
    selectedPlan: PlanAbonnement | null;
    onSelectPlan: (plan: PlanAbonnement) => void;
    billingPeriod?: "monthly" | "yearly";
    className?: string;
}

/**
 * Cards de sélection de plan avec style Apple minimaliste
 * Affiche les 4 plans avec leurs features principales
 * Recommande le plan adapté selon l'activité
 */
export function PlanSelectionCards({
    businessType,
    selectedPlan,
    onSelectPlan,
    billingPeriod = "monthly",
    className = "",
}: PlanSelectionCardsProps) {
    // Obtenir la recommandation si une activité est sélectionnée
    const recommendation = businessType
        ? getActivityRecommendation(businessType)
        : null;

    // Helper pour formater les limites avec locale français
    const formatLimit = (value: number, label: string) => {
        if (value === -1) return `${label} illimités`;
        return `${value.toLocaleString("fr-FR")} ${label}`;
    };

    // Générer les plans dynamiquement depuis PLANS_CONFIG
    const plans = Object.values(PLAN_ABONNEMENT).map((planId) => {
        const config = PLANS_CONFIG[planId];
        const limits = config.limits;

        // Features spécifiques basées sur le plan
        let features: string[] = [];
        let limitations: string[] | undefined;
        let cta = "Sélectionner";
        let trialDays: number | undefined;

        switch (planId) {
            case PLAN_ABONNEMENT.FREE:
                features = [
                    `${limits.maxUsers} utilisateur`,
                    formatLimit(limits.maxClients, "clients max"),
                    `${limits.maxDocumentsPerMonth} documents/mois`,
                    formatLimit(limits.maxProducts, "produits max"),
                    "Stock basique",
                    "Devis & Factures",
                ];
                limitations = [
                    "Pas d'IA",
                    "Pas de campagnes",
                    "Fonctions limitées",
                ];
                cta = "Commencer gratuitement";
                break;

            case PLAN_ABONNEMENT.STARTER:
                features = [
                    formatLimit(limits.maxUsers, "utilisateurs"),
                    formatLimit(limits.maxClients, "clients"),
                    `${limits.maxDocumentsPerMonth} documents/mois`,
                    formatLimit(limits.maxProducts, "produits"),
                    "Stock avancé",
                    "Programme fidélité",
                    "Assistant IA (100 Q/mois)",
                    "Champs personnalisés",
                ];
                trialDays = 14;
                cta = "Essayer 14 jours";
                break;

            case PLAN_ABONNEMENT.PRO:
                features = [
                    formatLimit(limits.maxUsers, "utilisateurs"),
                    formatLimit(limits.maxClients, "clients"),
                    "Documents illimités",
                    formatLimit(limits.maxProducts, "produits"),
                    "Assistant IA illimité",
                    "API & Webhooks",
                    "Analytics avancées",
                    "Multi-emplacements",
                    "Support prioritaire",
                ];
                trialDays = 14;
                cta = "Essayer 14 jours";
                break;

            case PLAN_ABONNEMENT.ENTERPRISE:
                features = [
                    "Utilisateurs illimités",
                    "Clients illimités",
                    "Tout illimité",
                    "White-label",
                    "Support 24/7 dédié",
                    "Formation équipe",
                    "SLA garantis",
                    "Développements sur mesure",
                ];
                trialDays = 14;
                cta = "Nous contacter";
                break;
        }

        return {
            id: planId,
            name: config.name,
            priceMonthly: config.price.monthly,
            priceYearly: config.price.yearly,
            description: config.description,
            features,
            limitations,
            trialDays,
            cta,
            popular: planId === PLAN_ABONNEMENT.STARTER,
        };
    });

    const isRecommended = (planId: PlanAbonnement) => {
        return recommendation?.recommendedPlan === planId;
    };

    const isTrialAvailable = (planId: PlanAbonnement) => {
        if (!recommendation) return false;
        return (
            recommendation.autoTrialIfFree &&
            planId === recommendation.trialPlan &&
            recommendation.recommendedPlan !== PLAN_ABONNEMENT.FREE
        );
    };

    return (
        <div className={className}>
            {/* Grid de cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {plans.map((plan) => {
                    const recommended = isRecommended(plan.id);
                    const trialAvailable = isTrialAvailable(plan.id);
                    const selected = selectedPlan === plan.id;

                    return (
                        <div
                            key={plan.id}
                            className={cn(
                                "group relative flex cursor-pointer flex-col rounded-lg border bg-white p-6 shadow-sm transition-all duration-200",
                                selected
                                    ? "border-black shadow-md"
                                    : "border-black/10 hover:border-black/20 hover:shadow-md",
                                recommended && "ring-1 ring-black/20"
                            )}
                            onClick={() => onSelectPlan(plan.id)}
                        >
                            {/* Badge recommandé */}
                            {recommended && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <div className="flex items-center gap-1 rounded-full bg-black px-3 py-1 text-[11px] font-medium text-white">
                                        <Sparkles
                                            className="h-3 w-3"
                                            strokeWidth={2}
                                        />
                                        Recommandé
                                    </div>
                                </div>
                            )}

                            {/* Badge populaire */}
                            {plan.popular && !recommended && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <div className="rounded-full bg-black/5 px-3 py-1 text-[11px] font-medium text-black/60">
                                        Plus populaire
                                    </div>
                                </div>
                            )}

                            {/* Header */}
                            <div className="mb-4">
                                <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-black">
                                    {plan.name}
                                </h3>
                                <p className="mt-1 text-[13px] text-black/40">
                                    {plan.description}
                                </p>
                            </div>

                            {/* Prix */}
                            <div className="mb-4">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-[32px] font-semibold tracking-[-0.02em] text-black">
                                        {billingPeriod === "monthly"
                                            ? plan.priceMonthly
                                            : Math.round(plan.priceYearly / 12)}
                                        €
                                    </span>
                                    <span className="text-[14px] text-black/40">
                                        /mois
                                    </span>
                                </div>
                                {plan.priceMonthly > 0 && (
                                    <div className="mt-1 text-[12px] text-black/40">
                                        {billingPeriod === "monthly"
                                            ? `ou ${plan.priceYearly}€/an`
                                            : `Facturé ${plan.priceYearly}€/an`}
                                    </div>
                                )}

                                {/* Badge trial */}
                                {plan.trialDays && (
                                    <div className="mt-2 text-[12px] text-black/60">
                                        {trialAvailable ? (
                                            <span className="font-medium">
                                                ✨ Essai gratuit{" "}
                                                {plan.trialDays} jours inclus
                                            </span>
                                        ) : (
                                            <span>
                                                {plan.trialDays} jours
                                                d&apos;essai gratuit
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Features */}
                            <div className="mb-4 flex-1">
                                <ul className="space-y-2">
                                    {plan.features.map((feature, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-2"
                                        >
                                            <Check
                                                className="mt-0.5 h-4 w-4 flex-shrink-0 text-black/40"
                                                strokeWidth={2}
                                            />
                                            <span className="text-[13px] text-black/60">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Limitations (FREE uniquement) */}
                                {plan.limitations && (
                                    <div className="mt-3 space-y-1 border-t border-black/5 pt-3">
                                        {plan.limitations.map(
                                            (limitation, index) => (
                                                <div
                                                    key={index}
                                                    className="text-[12px] text-black/40 line-through"
                                                >
                                                    {limitation}
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* CTA */}
                            <Button
                                type="button"
                                onClick={() => onSelectPlan(plan.id)}
                                className={cn(
                                    "h-11 w-full text-[14px] font-medium",
                                    selected
                                        ? "bg-black text-white hover:bg-black/90"
                                        : "border-black/10 bg-white text-black hover:bg-black/5",
                                    !selected && "border"
                                )}
                                variant={selected ? "default" : "outline"}
                            >
                                {selected ? "Sélectionné" : plan.cta}
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
