"use client";

import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PLAN_ABONNEMENT } from "@/lib/config/activity-plan-mapping";
import { PLANS_CONFIG } from "@/lib/config/plans.config";
import { PlanFeatureItem } from "./plan-feature-item";
import { PlanSocialProof } from "./plan-social-proof";

type PlanAbonnement = (typeof PLAN_ABONNEMENT)[keyof typeof PLAN_ABONNEMENT];

export interface PlanCardProps {
    planId: PlanAbonnement;
    billingPeriod: "monthly" | "yearly";
    isSelected: boolean;
    isRecommended: boolean;
    onSelect: () => void;
    className?: string;
}

// Données des plans avec features outcome-focused
const PLAN_DATA: Record<
    Exclude<PlanAbonnement, "ENTERPRISE">,
    {
        targetAudience: string;
        features: string[];
        ctaText: string;
        ctaSelectedText: string;
    }
> = {
    [PLAN_ABONNEMENT.FREE]: {
        targetAudience: "Pour démarrer",
        features: [
            "Gérez jusqu'à 50 clients",
            "Créez 20 devis et factures/mois",
            "Gestion de stock basique",
            "Accès au portail client",
        ],
        ctaText: "Commencer gratuitement",
        ctaSelectedText: "Plan sélectionné",
    },
    [PLAN_ABONNEMENT.STARTER]: {
        targetAudience: "Pour les équipes",
        features: [
            "Gagnez 5h/semaine sur la facturation",
            "Fidélisez vos clients, augmentez les ventes",
            "Réponses instantanées avec l'IA",
            "Gestion multi-utilisateurs (3)",
            "Export Excel et PDF",
        ],
        ctaText: "Démarrer avec Starter",
        ctaSelectedText: "Plan sélectionné",
    },
    [PLAN_ABONNEMENT.PRO]: {
        targetAudience: "Pour la croissance",
        features: [
            "Prenez de meilleures décisions avec vos données",
            "Automatisez vos relances et campagnes",
            "IA illimitée pour répondre à vos clients",
            "Connectez vos outils (API & Webhooks)",
            "Support prioritaire",
        ],
        ctaText: "Démarrer avec Pro",
        ctaSelectedText: "Plan sélectionné",
    },
};

export function PlanCard({
    planId,
    billingPeriod,
    isSelected,
    isRecommended,
    onSelect,
    className,
}: PlanCardProps) {
    // Ne pas afficher Enterprise ici (page dédiée)
    if (planId === PLAN_ABONNEMENT.ENTERPRISE) return null;

    const planConfig = PLANS_CONFIG[planId];
    const planData = PLAN_DATA[planId];
    const price =
        billingPeriod === "monthly"
            ? planConfig.price.monthly
            : Math.round(planConfig.price.yearly / 12);

    const isPopular = planId === PLAN_ABONNEMENT.STARTER;

    return (
        <div
            className={cn(
                "relative flex flex-col rounded-2xl border bg-white p-6 transition-all duration-300",
                // État par défaut
                "border-black/10 hover:border-black/20",
                // État recommandé (STARTER)
                isPopular && !isSelected && "ring-1 ring-black/10 shadow-lg scale-[1.02]",
                // État sélectionné
                isSelected && "ring-2 ring-black shadow-xl scale-[1.02]",
                // Hover
                !isSelected && "hover:shadow-md hover:-translate-y-1",
                className
            )}
            onClick={onSelect}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect();
                }
            }}
        >
            {/* Badge populaire / recommandé */}
            {(isPopular || isRecommended) && !isSelected && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1 shadow-sm">
                        <Sparkles className="h-3 w-3 text-white" strokeWidth={2} />
                        <span className="text-[11px] font-semibold text-white whitespace-nowrap">
                            Le plus populaire
                        </span>
                    </div>
                </div>
            )}

            {/* Badge sélectionné */}
            {isSelected && (
                <div className="absolute -top-3 right-4">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black shadow-sm">
                        <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="mb-4">
                <h3 className="text-[20px] font-semibold tracking-[-0.01em] text-black">
                    {planConfig.name}
                </h3>
                <p className="text-[13px] text-black/50 mt-0.5">
                    {planData.targetAudience}
                </p>
            </div>

            {/* Prix */}
            <div className="mb-6">
                <div className="flex items-baseline gap-1">
                    <span className="text-[44px] font-semibold tracking-[-0.02em] text-black">
                        {price}€
                    </span>
                    <span className="text-[14px] text-black/40">/mois</span>
                </div>
                {billingPeriod === "yearly" && price > 0 && (
                    <p className="text-[12px] text-black/40 mt-1">
                        Facturé {planConfig.price.yearly}€/an
                    </p>
                )}
                {price === 0 && (
                    <p className="text-[12px] text-black/40 mt-1">
                        Gratuit pour toujours
                    </p>
                )}
            </div>

            {/* Social Proof */}
            <div className="mb-4">
                <PlanSocialProof planId={planId} />
            </div>

            {/* Features */}
            <div className="flex-1 space-y-3 mb-6">
                {planData.features.map((feature, index) => (
                    <PlanFeatureItem
                        key={index}
                        text={feature}
                        highlighted={isSelected || isPopular}
                    />
                ))}
            </div>

            {/* CTA */}
            <Button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect();
                }}
                className={cn(
                    "w-full transition-all duration-200",
                    isSelected || isPopular
                        ? "h-12 bg-black hover:bg-black/90 text-white text-[15px] font-medium"
                        : "h-11 bg-white hover:bg-black/5 text-black text-[14px] font-medium border border-black/10"
                )}
            >
                {isSelected ? (
                    <span className="flex items-center gap-2">
                        <Check className="h-4 w-4" strokeWidth={2.5} />
                        {planData.ctaSelectedText}
                    </span>
                ) : (
                    planData.ctaText
                )}
            </Button>
        </div>
    );
}
