"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const plans = [
    {
        name: "Démarrage",
        price: 29,
        annualPrice: 24,
        description: "Pour les artisans qui démarrent",
        features: [
            "Jusqu'à 50 clients",
            "Devis & factures illimités",
            "100 produits au catalogue",
            "Gestion de stock basique",
            "Support par email sous 24h",
            "Historique 12 mois",
            "Export Excel",
        ],
        cta: "Commencer gratuitement",
        usedBy: "120+ artisans",
    },
    {
        name: "Professionnel",
        price: 59,
        annualPrice: 49,
        description: "Notre plan le plus populaire",
        features: [
            "Clients illimités",
            "Devis & factures illimités",
            "Produits illimités",
            "Gestion de stock avancée",
            "Support prioritaire sous 4h",
            "Historique illimité",
            "Export comptable",
            "Multi-utilisateurs (jusqu'à 3)",
            "Automatisations",
            "Relances automatiques",
        ],
        cta: "Commencer gratuitement",
        popular: true,
        usedBy: "340+ PME",
        savings: "Économisez 15h/semaine",
    },
    {
        name: "Entreprise",
        price: 149,
        annualPrice: 129,
        description: "Pour les équipes qui grandissent",
        features: [
            "Tout du plan Professionnel",
            "Utilisateurs illimités",
            "Support dédié 24/7",
            "Gestionnaire de compte",
            "API complète",
            "Intégrations avancées",
            "Formations personnalisées",
            "SLA garanti 99.9%",
            "Audit de sécurité",
        ],
        cta: "Contacter l'équipe",
        usedBy: "40+ entreprises",
    },
];

export function PricingCards() {
    const [isAnnual, setIsAnnual] = useState(true);

    return (
        <section id="pricing" className="py-32 px-6 sm:px-8 bg-neutral-50">
            <div className="max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="text-center space-y-6 mb-16">
                    <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-[-0.02em] text-black leading-[1.05]">
                        Un prix adapté à votre entreprise
                    </h2>
                    <p className="text-[19px] text-black/60 max-w-[680px] mx-auto leading-[1.5] tracking-[-0.01em]">
                        Essayez gratuitement pendant 14 jours. Sans carte bancaire.
                        Annulez à tout moment.
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
                            className="relative inline-flex h-7 w-12 items-center rounded-full bg-black transition-colors"
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                    isAnnual ? "translate-x-6" : "translate-x-1"
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
                            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-700 text-[12px] font-semibold">
                                -17%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {plans.map((plan, index) => (
                        <Card
                            key={index}
                            className={`relative p-8 transition-all duration-300 ${
                                plan.popular
                                    ? "bg-black text-white border-black shadow-2xl scale-105 lg:scale-110 z-10"
                                    : "bg-white border-black/[0.08] hover:border-black/[0.12] hover:shadow-lg"
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-black border border-black/[0.08] shadow-lg">
                                        <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
                                        <span className="text-[12px] font-semibold">Le plus populaire</span>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-8">
                                {/* Header */}
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <h3
                                            className={`text-[24px] font-semibold tracking-[-0.01em] ${
                                                plan.popular ? "text-white" : "text-black"
                                            }`}
                                        >
                                            {plan.name}
                                        </h3>
                                        <p
                                            className={`text-[14px] ${
                                                plan.popular ? "text-white/60" : "text-black/50"
                                            }`}
                                        >
                                            {plan.description}
                                        </p>
                                    </div>

                                    {/* Price */}
                                    <div className="space-y-1">
                                        <div className="flex items-baseline gap-2">
                                            <span
                                                className={`text-[48px] font-semibold tracking-[-0.03em] leading-none ${
                                                    plan.popular ? "text-white" : "text-black"
                                                }`}
                                            >
                                                {isAnnual ? plan.annualPrice : plan.price}€
                                            </span>
                                            <span
                                                className={`text-[16px] font-medium ${
                                                    plan.popular ? "text-white/60" : "text-black/50"
                                                }`}
                                            >
                                                /mois
                                            </span>
                                        </div>
                                        {isAnnual && (
                                            <p
                                                className={`text-[13px] ${
                                                    plan.popular ? "text-white/50" : "text-black/40"
                                                }`}
                                            >
                                                Soit {plan.annualPrice * 12}€/an, facturé annuellement
                                            </p>
                                        )}
                                    </div>

                                    {/* Savings Badge */}
                                    {plan.savings && (
                                        <div className="inline-flex px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
                                            <span className="text-[12px] text-white font-medium">
                                                {plan.savings}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* CTA */}
                                <Link
                                    href={
                                        plan.name === "Entreprise"
                                            ? "/contact"
                                            : "/auth/register"
                                    }
                                    className="block"
                                >
                                    <Button
                                        className={`w-full h-11 rounded-lg text-[14px] font-medium transition-all duration-200 ${
                                            plan.popular
                                                ? "bg-white hover:bg-white/90 text-black"
                                                : "bg-black hover:bg-black/90 text-white"
                                        }`}
                                    >
                                        {plan.cta}
                                    </Button>
                                </Link>

                                {/* Features */}
                                <div className="space-y-4 pt-4 border-t border-black/[0.08] dark:border-white/[0.08]">
                                    <p
                                        className={`text-[13px] font-medium ${
                                            plan.popular ? "text-white/60" : "text-black/50"
                                        }`}
                                    >
                                        Ce qui est inclus :
                                    </p>
                                    <div className="space-y-3">
                                        {plan.features.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <Check
                                                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                                        plan.popular ? "text-white" : "text-black"
                                                    }`}
                                                    strokeWidth={2.5}
                                                />
                                                <span
                                                    className={`text-[14px] leading-[1.6] ${
                                                        plan.popular ? "text-white/80" : "text-black/70"
                                                    }`}
                                                >
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Social Proof */}
                                <div
                                    className={`pt-4 border-t ${
                                        plan.popular ? "border-white/[0.08]" : "border-black/[0.08]"
                                    }`}
                                >
                                    <p
                                        className={`text-[12px] ${
                                            plan.popular ? "text-white/50" : "text-black/40"
                                        }`}
                                    >
                                        {plan.usedBy}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Bottom Info */}
                <div className="mt-16 text-center space-y-6">
                    <div className="flex flex-wrap items-center justify-center gap-6 text-[13px] text-black/50">
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-black" strokeWidth={2} />
                            <span>Essai gratuit 14 jours</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-black" strokeWidth={2} />
                            <span>Sans carte bancaire</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-black" strokeWidth={2} />
                            <span>Annulation à tout moment</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-black" strokeWidth={2} />
                            <span>Support en français</span>
                        </div>
                    </div>

                    <p className="text-[14px] text-black/60">
                        Des questions sur nos tarifs ?{" "}
                        <Link href="/contact" className="text-black font-medium hover:underline">
                            Contactez-nous
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}
