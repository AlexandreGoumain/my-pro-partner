"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Check, Infinity, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const basePlans = [
    {
        name: "Démarrage",
        basePrice: 49,
        description: "Idéal pour démarrer",
        features: [
            { text: "Jusqu'à 50 clients", status: "limited", limit: "50" },
            { text: "Devis & factures illimités", status: "available" },
            { text: "Catalogue produits", status: "limited", limit: "100" },
            { text: "Suivi de stock basique", status: "available" },
            { text: "Support par email", status: "available" },
            { text: "Multi-utilisateurs", status: "unavailable" },
            { text: "Automatisation", status: "unavailable" },
            { text: "API", status: "unavailable" },
        ],
    },
    {
        name: "Pro",
        basePrice: 99,
        description: "Pour développer votre activité",
        features: [
            { text: "Clients illimités", status: "available" },
            { text: "Devis & factures illimités", status: "available" },
            { text: "Catalogue illimité", status: "available" },
            { text: "Suivi de stock avancé", status: "available" },
            { text: "Support prioritaire", status: "available" },
            { text: "Multi-utilisateurs", status: "limited", limit: "5" },
            { text: "Automatisation", status: "available" },
            { text: "API", status: "unavailable" },
        ],
        popular: true,
        badge: "Recommandé",
    },
    {
        name: "Entreprise",
        basePrice: 199,
        description: "Pour les équipes qui grandissent",
        features: [
            { text: "Clients illimités", status: "available" },
            { text: "Devis & factures illimités", status: "available" },
            { text: "Catalogue illimité", status: "available" },
            { text: "Suivi de stock avancé", status: "available" },
            { text: "Support dédié 24/7", status: "available" },
            { text: "Utilisateurs illimités", status: "available" },
            { text: "Automatisation avancée", status: "available" },
            { text: "API complète", status: "available" },
        ],
    },
];

type BillingPeriod = "monthly" | "quarterly" | "annual";

const billingConfig = {
    monthly: { discount: 15, label: "Mensuel", duration: "1er mois" },
    quarterly: { discount: 20, label: "Trimestriel", duration: "1er trimestre" },
    annual: { discount: 30, label: "Annuel", duration: "1ère année" },
};

function calculatePrice(basePrice: number, period: BillingPeriod) {
    const discount = billingConfig[period].discount;
    return (basePrice * (1 - discount / 100)).toFixed(2);
}

export function PricingCards() {
    const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("annual");
    return (
        <section id="pricing" className="py-32 px-6 sm:px-8 bg-white">
            <div className="max-w-[1120px] mx-auto">
                <div className="text-center space-y-6 mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-[12px] font-bold tracking-wide uppercase mb-4">
                        <span className="animate-pulse">🔥</span>
                        Offre de lancement jusqu'à -30%
                        <span className="animate-pulse">🔥</span>
                    </div>
                    <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-[-0.02em] text-black leading-[1.05]">
                        Tarifs simples
                    </h2>
                    <p className="text-[19px] text-black/60 max-w-[600px] mx-auto leading-[1.5] tracking-[-0.01em]">
                        Choisissez votre période de paiement et profitez de nos réductions de lancement.
                    </p>

                    {/* Billing Period Tabs */}
                    <div className="flex justify-center pt-4">
                        <Tabs
                            value={billingPeriod}
                            onValueChange={(value) => setBillingPeriod(value as BillingPeriod)}
                            className="w-auto"
                        >
                            <TabsList className="bg-neutral-100 p-1 h-auto rounded-full">
                                <TabsTrigger
                                    value="monthly"
                                    className="rounded-full px-6 py-2.5 text-[13px] font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                >
                                    Mensuel
                                    <span className="ml-2 text-[11px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-600">
                                        -15%
                                    </span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="quarterly"
                                    className="rounded-full px-6 py-2.5 text-[13px] font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                >
                                    Trimestriel
                                    <span className="ml-2 text-[11px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-600">
                                        -20%
                                    </span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="annual"
                                    className="rounded-full px-6 py-2.5 text-[13px] font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                >
                                    Annuel
                                    <span className="ml-2 text-[11px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-600">
                                        -30%
                                    </span>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <p className="text-[13px] text-orange-600 font-semibold">
                        Réduction valable uniquement sur le {billingConfig[billingPeriod].duration}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[1200px] mx-auto">
                    {basePlans.map((plan, index) => {
                        const discountedPrice = calculatePrice(plan.basePrice, billingPeriod);
                        const discount = billingConfig[billingPeriod].discount;

                        return (
                        <Card
                            key={index}
                            className={`group relative overflow-hidden transition-all duration-300 flex flex-col ${
                                plan.popular
                                    ? "bg-black text-white border-black shadow-xl shadow-black/10"
                                    : "bg-white border-black/[0.08] hover:border-black/[0.12] hover:shadow-lg hover:shadow-black/5"
                            }`}
                        >
                            {/* Badge */}
                            {plan.badge && (
                                <div className="absolute top-6 right-6">
                                    <div className="bg-white text-black px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                                        {plan.badge}
                                    </div>
                                </div>
                            )}

                            <div className="relative z-10 p-8 flex flex-col flex-1">
                                {/* Header */}
                                <div className="space-y-6 pb-6 border-b border-black/[0.08] dark:border-white/[0.08]">
                                    <div className="space-y-1">
                                        <h3
                                            className={`text-[24px] font-semibold tracking-[-0.01em] ${
                                                plan.popular
                                                    ? "text-white"
                                                    : "text-black"
                                            }`}
                                        >
                                            {plan.name}
                                        </h3>
                                        <p
                                            className={`text-[14px] ${
                                                plan.popular
                                                    ? "text-white/60"
                                                    : "text-black/50"
                                            }`}
                                        >
                                            {plan.description}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-baseline gap-2">
                                            <span
                                                className={`text-[24px] font-medium tracking-[-0.02em] leading-none line-through ${
                                                    plan.popular
                                                        ? "text-white/40"
                                                        : "text-black/30"
                                                }`}
                                            >
                                                {plan.basePrice.toFixed(2)}€
                                            </span>
                                            <span
                                                className={`text-[13px] font-bold px-2 py-0.5 rounded ${
                                                    plan.popular
                                                        ? "bg-orange-400/20 text-orange-300"
                                                        : "bg-orange-100 text-orange-600"
                                                }`}
                                            >
                                                -{discount}%
                                            </span>
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span
                                                className={`text-[56px] font-semibold tracking-[-0.03em] leading-none ${
                                                    plan.popular
                                                        ? "text-white"
                                                        : "text-black"
                                                }`}
                                            >
                                                {discountedPrice}€
                                            </span>
                                            <span
                                                className={`text-[15px] font-medium ${
                                                    plan.popular
                                                        ? "text-white/60"
                                                        : "text-black/50"
                                                }`}
                                            >
                                                /mois
                                            </span>
                                        </div>
                                        <p
                                            className={`text-[11px] font-semibold ${
                                                plan.popular
                                                    ? "text-orange-300"
                                                    : "text-orange-600"
                                            }`}
                                        >
                                            Réduction sur le {billingConfig[billingPeriod].duration}
                                        </p>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="py-8 space-y-3.5 flex-1">
                                    {plan.features.map((feature, i) => {
                                        const isUnlimited = feature.text
                                            .toLowerCase()
                                            .includes("illimité");
                                        const isLimited =
                                            feature.status === "limited";
                                        const isUnavailable =
                                            feature.status === "unavailable";

                                        return (
                                            <div
                                                key={i}
                                                className="flex items-center gap-3"
                                            >
                                                <div className="flex-shrink-0">
                                                    {isUnavailable ? (
                                                        <X
                                                            className={`w-4 h-4 ${
                                                                plan.popular
                                                                    ? "text-white/30"
                                                                    : "text-black/20"
                                                            }`}
                                                            strokeWidth={2.5}
                                                        />
                                                    ) : isLimited ? (
                                                        <AlertCircle
                                                            className={`w-4 h-4 ${
                                                                plan.popular
                                                                    ? "text-orange-400"
                                                                    : "text-orange-500"
                                                            }`}
                                                            strokeWidth={2.5}
                                                        />
                                                    ) : (
                                                        <Check
                                                            className={`w-4 h-4 ${
                                                                plan.popular
                                                                    ? "text-white"
                                                                    : "text-black"
                                                            }`}
                                                            strokeWidth={2.5}
                                                        />
                                                    )}
                                                </div>
                                                <span
                                                    className={`text-[14px] leading-[1.5] flex items-center gap-2 ${
                                                        isUnavailable
                                                            ? plan.popular
                                                                ? "text-white/30 line-through"
                                                                : "text-black/30 line-through"
                                                            : plan.popular
                                                            ? "text-white/90"
                                                            : "text-black/70"
                                                    }`}
                                                >
                                                    {feature.text}
                                                    {isLimited &&
                                                        feature.limit && (
                                                            <span
                                                                className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                                                                    plan.popular
                                                                        ? "bg-orange-400/20 text-orange-300"
                                                                        : "bg-orange-100 text-orange-600"
                                                                }`}
                                                            >
                                                                {feature.limit}
                                                            </span>
                                                        )}
                                                    {isUnlimited && (
                                                        <Infinity
                                                            className={`w-3.5 h-3.5 ${
                                                                plan.popular
                                                                    ? "text-white/50"
                                                                    : "text-black/30"
                                                            }`}
                                                            strokeWidth={2}
                                                        />
                                                    )}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* CTA */}
                                <div className="mt-auto space-y-3">
                                    <Link
                                        href="/auth/register"
                                        className="block"
                                    >
                                        <Button
                                            className={`w-full h-11 rounded-full text-[13px] font-semibold transition-all duration-200 ${
                                                plan.popular
                                                    ? "bg-white hover:bg-white/90 text-black"
                                                    : "bg-black hover:bg-black/90 text-white"
                                            }`}
                                        >
                                            Commencer l&apos;essai gratuit
                                        </Button>
                                    </Link>
                                    <Link
                                        href={`/pricing/${plan.name
                                            .toLowerCase()
                                            .normalize("NFD")
                                            .replace(/[\u0300-\u036f]/g, "")}`}
                                        className="block"
                                    >
                                        <Button
                                            variant="ghost"
                                            className={`w-full h-10 text-[12px] font-medium ${
                                                plan.popular
                                                    ? "text-white/70 hover:text-white hover:bg-white/10"
                                                    : "text-black/60 hover:text-black hover:bg-black/5"
                                            }`}
                                        >
                                            En savoir plus →
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                        );
                    })}
                </div>

                <div className="text-center mt-12 space-y-3">
                    <p className="text-[13px] text-black/50 font-medium">
                        Essai gratuit de 14 jours · Sans carte bancaire ·
                        Annulation à tout moment
                    </p>
                </div>
            </div>
        </section>
    );
}
