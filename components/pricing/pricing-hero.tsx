"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useState } from "react";

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

interface PricingHeroProps {
    planName: string;
    basePrice: number;
    tagline: string;
    badge?: string;
}

export function PricingHero({ planName, basePrice, tagline, badge }: PricingHeroProps) {
    const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("annual");
    const discountedPrice = calculatePrice(basePrice, billingPeriod);
    const discount = billingConfig[billingPeriod].discount;

    return (
        <div className="space-y-6">
            {badge && (
                <div className="inline-block">
                    <span className="bg-black text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                        {badge}
                    </span>
                </div>
            )}
            <div className="space-y-3">
                <h1 className="text-[56px] font-semibold tracking-[-0.02em] text-black leading-[1.05]">
                    Plan {planName}
                </h1>
                <p className="text-[24px] text-black/60 leading-[1.4]">
                    {tagline}
                </p>
            </div>

            {/* Billing Period Selector */}
            <div className="space-y-3 pt-2">
                <Tabs
                    value={billingPeriod}
                    onValueChange={(value) => setBillingPeriod(value as BillingPeriod)}
                    className="w-auto"
                >
                    <TabsList className="bg-neutral-100 p-1 h-auto rounded-full">
                        <TabsTrigger
                            value="monthly"
                            className="rounded-full px-4 py-2 text-[12px] font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                            Mensuel
                            <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-600">
                                -15%
                            </span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="quarterly"
                            className="rounded-full px-4 py-2 text-[12px] font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                            Trimestriel
                            <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-600">
                                -20%
                            </span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="annual"
                            className="rounded-full px-4 py-2 text-[12px] font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                            Annuel
                            <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-600">
                                -30%
                            </span>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="space-y-3 pt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-600 text-[11px] font-bold tracking-wide uppercase">
                    <span>🔥</span>
                    Offre de lancement -{discount}%
                </div>
                <div className="space-y-1">
                    <div className="flex items-baseline gap-3">
                        <span className="text-[32px] font-medium tracking-[-0.02em] text-black/30 line-through">
                            {basePrice.toFixed(2)}€
                        </span>
                        <span className="text-[14px] font-bold px-2 py-1 rounded bg-orange-100 text-orange-600">
                            -{discount}%
                        </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-[72px] font-semibold tracking-[-0.03em] text-black leading-none">
                            {discountedPrice}€
                        </span>
                        <span className="text-[20px] text-black/60 font-medium">
                            /mois
                        </span>
                    </div>
                    <p className="text-[13px] font-semibold text-orange-600">
                        Réduction sur le {billingConfig[billingPeriod].duration}
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Link href="/auth/register">
                    <Button
                        size="lg"
                        className="bg-black hover:bg-black/90 text-white rounded-full h-12 px-8 text-[14px] font-semibold"
                    >
                        Commencer l&apos;essai gratuit
                    </Button>
                </Link>
                <Link href="/auth/login">
                    <Button
                        size="lg"
                        variant="outline"
                        className="rounded-full h-12 px-8 text-[14px] font-semibold border-black/[0.12]"
                    >
                        Me connecter
                    </Button>
                </Link>
            </div>

            <p className="text-[13px] text-black/50 pt-2">
                Essai gratuit de 14 jours · Sans carte bancaire
            </p>
        </div>
    );
}
