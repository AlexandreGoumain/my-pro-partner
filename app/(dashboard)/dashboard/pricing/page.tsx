"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Check,
    Crown,
    Star,
    Sparkles,
    Zap,
    ArrowRight,
} from "lucide-react";
import {
    PlanType,
    PLAN_PRICING,
    PLAN_FEATURES,
} from "@/lib/pricing-config";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSubscriptionStatus } from "@/hooks/use-subscription-status";
import { PlanChangeDialog, SubscriptionManagement } from "@/components/subscription";

/**
 * Page Pricing refactorisée - Version professionnelle
 *
 * Architecture claire :
 * - useSubscriptionStatus : état centralisé de l'abonnement
 * - PlanChangeDialog : dialog réutilisable pour tous les changements
 * - Logique simplifiée dans la page
 *
 * UX inspirée de Vercel, GitHub, Stripe
 */
export default function PricingPage() {
    const { update: updateSession } = useSession();
    const subscriptionState = useSubscriptionStatus();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);

    // Rafraîchir la session au chargement
    useEffect(() => {
        updateSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePlanClick = (plan: PlanType) => {
        // Ignorer si c'est le plan actuel
        if (subscriptionState.isSamePlan(plan)) return;

        // Si l'utilisateur a déjà un plan payant, ouvrir le Billing Portal
        // Sinon, ouvrir le dialog d'abonnement
        setSelectedPlan(plan);
        setDialogOpen(true);
    };

    const getPlanIcon = (plan: PlanType) => {
        switch (plan) {
            case "ENTERPRISE":
                return <Crown className="w-6 h-6" strokeWidth={2} />;
            case "PRO":
                return <Star className="w-6 h-6" strokeWidth={2} />;
            case "STARTER":
                return <Sparkles className="w-6 h-6" strokeWidth={2} />;
            default:
                return <Zap className="w-6 h-6" strokeWidth={2} />;
        }
    };

    return (
        <>
            <div className="min-h-screen">
                {/* Hero Header */}
                <div className="text-center mb-16 pt-8">
                    <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-black/5 border border-black/10 mb-6">
                        <Sparkles className="w-4 h-4 text-black/60 mr-2" strokeWidth={2} />
                        <span className="text-[13px] font-medium text-black/70">
                            Choisissez le plan parfait pour vous
                        </span>
                    </div>

                    <h1 className="text-[48px] font-bold tracking-[-0.04em] text-black mb-4">
                        Plans & Tarifs
                    </h1>

                    <p className="text-[18px] text-black/60 max-w-2xl mx-auto leading-relaxed">
                        Des tarifs simples et transparents pour accompagner votre croissance.
                        Changez de plan à tout moment.
                    </p>
                </div>

                {/* Grille des plans */}
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {(Object.keys(PLAN_PRICING) as PlanType[]).map((plan) => {
                            const planInfo = PLAN_PRICING[plan];
                            const isCurrent = subscriptionState.isSamePlan(plan);
                            const features = PLAN_FEATURES[plan];

                            return (
                                <Card
                                    key={plan}
                                    className={`relative overflow-hidden transition-all duration-300 ${
                                        isCurrent
                                            ? "ring-2 ring-black shadow-lg scale-105"
                                            : "border-black/10 shadow-sm hover:shadow-md hover:border-black/20"
                                    } ${
                                        planInfo.popular && !isCurrent
                                            ? "ring-2 ring-black/30 shadow-md scale-[1.02]"
                                            : ""
                                    }`}
                                >
                                    {/* Badge flottant */}
                                    {(planInfo.popular || isCurrent) && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                            <div className="px-4 py-1.5 rounded-full bg-black text-white shadow-lg border-2 border-white">
                                                <span className="text-[11px] font-semibold tracking-wide uppercase">
                                                    {isCurrent ? "✓ Votre plan" : "★ Populaire"}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <CardContent className="p-0">
                                        {/* Header section */}
                                        <div className={`p-8 pb-6 ${isCurrent || planInfo.popular ? "pt-10" : ""}`}>
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
                                                        ou {planInfo.annualPrice}€/mois facturé annuellement
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
                                            ) : subscriptionState.currentPlan === "FREE" ? (
                                                <Button
                                                    onClick={() => handlePlanClick(plan)}
                                                    className="w-full h-12 text-[15px] font-semibold rounded-lg transition-all duration-300 bg-black hover:bg-black/90 text-white shadow-md hover:shadow-xl"
                                                >
                                                    Obtenir {planInfo.name}
                                                    <ArrowRight className="w-4 h-4 ml-2" strokeWidth={2.5} />
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() => handlePlanClick(plan)}
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
                                                            <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />
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
                        })}
                    </div>
                </div>

                {/* Gestion de l'abonnement (si plan actif) */}
                {subscriptionState.currentPlan !== "FREE" && (
                    <div className="max-w-2xl mx-auto mt-16">
                        <SubscriptionManagement />
                    </div>
                )}

                {/* FAQ ou Note en bas */}
                <div className="text-center mt-16 mb-8">
                    <p className="text-[14px] text-black/50">
                        Tous les plans incluent un essai gratuit de 14 jours. Aucune carte bancaire requise.
                    </p>
                    <p className="text-[13px] text-black/40 mt-2">
                        Questions ? Contactez-nous à{" "}
                        <a href="mailto:support@mypropartner.com" className="text-black/60 hover:text-black underline">
                            support@mypropartner.com
                        </a>
                    </p>
                </div>
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
