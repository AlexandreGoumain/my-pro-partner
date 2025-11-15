"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { DialogHeaderSection } from "@/components/ui/dialog-header-section";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UpgradeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    featureName: string;
    currentPlan: string;
}

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

const upgradeOptions = {
    demarrage: [
        {
            name: "Pro",
            basePrice: 99,
            slug: "pro",
            description: "Pour développer votre activité",
            benefits: [
                "Clients illimités",
                "Multi-utilisateurs (jusqu'à 5)",
                "Automatisation incluse",
                "Support prioritaire",
            ],
        },
        {
            name: "Entreprise",
            basePrice: 199,
            slug: "entreprise",
            description: "Pour les équipes qui grandissent",
            benefits: [
                "Utilisateurs illimités",
                "API complète",
                "Support dédié 24/7",
                "Infrastructure dédiée",
            ],
        },
    ],
    pro: [
        {
            name: "Entreprise",
            basePrice: 199,
            slug: "entreprise",
            description: "Pour les équipes qui grandissent",
            benefits: [
                "Utilisateurs illimités",
                "API complète",
                "Support dédié 24/7",
                "Infrastructure dédiée",
            ],
        },
    ],
};

export function UpgradeDialog({
    open,
    onOpenChange,
    featureName,
    currentPlan,
}: UpgradeDialogProps) {
    const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("annual");
    const options =
        upgradeOptions[currentPlan as keyof typeof upgradeOptions] || [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeaderSection
                    title={`Débloquez : ${featureName}`}
                    description="Cette fonctionnalité est disponible dans les plans suivants"
                    titleClassName="text-[24px] font-semibold tracking-[-0.01em]"
                    descriptionClassName="text-[15px] text-black/60"
                />

                {/* Billing Period Tabs */}
                <div className="flex justify-center pt-2">
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

                <div className="space-y-4 pt-2">
                    {options.map((option) => {
                        const discountedPrice = calculatePrice(option.basePrice, billingPeriod);
                        const discount = billingConfig[billingPeriod].discount;

                        return (
                        <div
                            key={option.slug}
                            className="border border-black/[0.08] rounded-lg p-6 hover:border-black/[0.12] hover:shadow-lg transition-all duration-200"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-[20px] font-semibold text-black">
                                        Plan {option.name}
                                    </h3>
                                    <p className="text-[14px] text-black/60 mt-1">
                                        {option.description}
                                    </p>
                                </div>
                                <div className="text-right space-y-1">
                                    <div className="flex items-baseline gap-2 justify-end">
                                        <span className="text-[18px] font-medium text-black/30 line-through">
                                            {option.basePrice.toFixed(2)}€
                                        </span>
                                        <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-600">
                                            -{discount}%
                                        </span>
                                    </div>
                                    <div className="flex items-baseline gap-1 justify-end">
                                        <div className="text-[32px] font-semibold tracking-[-0.02em] text-black">
                                            {discountedPrice}€
                                        </div>
                                        <div className="text-[13px] text-black/60">
                                            /mois
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-semibold text-orange-600">
                                        Sur le {billingConfig[billingPeriod].duration}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2.5 mb-5">
                                {option.benefits.map((benefit, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2.5"
                                    >
                                        <Check
                                            className="w-4 h-4 text-black flex-shrink-0"
                                            strokeWidth={2.5}
                                        />
                                        <span className="text-[14px] text-black/70">
                                            {benefit}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <Link href="/auth/register" className="flex-1">
                                    <Button className="w-full bg-black hover:bg-black/90 text-white rounded-full h-10 text-[13px] font-semibold">
                                        Commencer l'essai gratuit
                                    </Button>
                                </Link>
                                <Link href={`/pricing/${option.slug}`}>
                                    <Button
                                        variant="outline"
                                        className="rounded-full h-10 px-6 text-[13px] font-semibold border-black/[0.12] hover:bg-black/5"
                                    >
                                        En savoir plus
                                        <ArrowRight className="w-3.5 h-3.5 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        );
                    })}
                </div>

                <div className="text-center pt-4 pb-2">
                    <p className="text-[12px] text-black/50">
                        Essai gratuit de 14 jours · Sans carte bancaire
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
