"use client";

import { Button } from "@/components/ui/button";
import { SettingsSection } from "@/components/ui/settings-section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CreditCard, TrendingUp, Users, FileText, Package, Zap } from "lucide-react";
import { EntrepriseSettings } from "@/lib/types/settings";

interface SubscriptionTabProps {
    entreprise: EntrepriseSettings | null;
}

export function SubscriptionTab({ entreprise }: SubscriptionTabProps) {
    const plans = [
        {
            name: "FREE",
            price: "0€",
            period: "gratuit",
            features: ["5 clients max", "10 documents/mois", "1 utilisateur"],
            current: entreprise?.plan === "FREE",
        },
        {
            name: "BASIC",
            price: "29€",
            period: "par mois",
            features: ["50 clients", "Docs illimités", "3 utilisateurs"],
            current: entreprise?.plan === "BASIC",
            popular: false,
        },
        {
            name: "PREMIUM",
            price: "79€",
            period: "par mois",
            features: ["Clients illimités", "Docs illimités", "10 utilisateurs", "Support prioritaire"],
            current: entreprise?.plan === "PREMIUM",
            popular: true,
        },
        {
            name: "ENTERPRISE",
            price: "Sur mesure",
            period: "",
            features: ["Tout illimité", "Support dédié", "API avancée", "SLA garanti"],
            current: entreprise?.plan === "ENTERPRISE",
        },
    ];

    const currentPlan = plans.find(p => p.current);

    return (
        <div className="space-y-6">
            <SettingsSection
                icon={CreditCard}
                title="Plan actuel"
                description="Gérez votre abonnement et votre facturation"
            >
                <div className="max-w-3xl">
                    <Card className="p-6 border-black/8 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="text-[20px] font-semibold tracking-[-0.01em] text-black">
                                        Plan {currentPlan?.name}
                                    </h3>
                                    {currentPlan?.current && (
                                        <Badge className="bg-black text-white">
                                            Plan actuel
                                        </Badge>
                                    )}
                                </div>
                                <div className="text-[28px] font-bold tracking-[-0.02em] text-black mt-2">
                                    {currentPlan?.price}
                                    {currentPlan?.period && (
                                        <span className="text-[14px] font-normal text-black/40 ml-2">
                                            {currentPlan.period}
                                        </span>
                                    )}
                                </div>
                                <ul className="mt-4 space-y-2">
                                    {currentPlan?.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-2 text-[14px] text-black/60">
                                            <span className="text-black">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {entreprise?.plan !== "ENTERPRISE" && (
                                <Button className="bg-black hover:bg-black/90 text-white h-10 px-4">
                                    <Zap className="h-4 w-4 mr-2" strokeWidth={2} />
                                    Upgrader
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>
            </SettingsSection>

            <SettingsSection
                icon={TrendingUp}
                title="Utilisation"
                description="Suivez votre consommation actuelle"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
                    <Card className="p-4 border-black/8 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
                                <Users className="h-5 w-5 text-black/60" strokeWidth={2} />
                            </div>
                            <div>
                                <div className="text-[12px] text-black/40 font-medium uppercase tracking-wide">
                                    Clients
                                </div>
                                <div className="text-[20px] font-semibold tracking-[-0.01em] text-black">
                                    {entreprise?.stats?.clients || 0}
                                    <span className="text-[14px] font-normal text-black/40 ml-1">
                                        / {entreprise?.plan === "FREE" ? "5" : entreprise?.plan === "BASIC" ? "50" : "∞"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-black/8 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
                                <FileText className="h-5 w-5 text-black/60" strokeWidth={2} />
                            </div>
                            <div>
                                <div className="text-[12px] text-black/40 font-medium uppercase tracking-wide">
                                    Documents
                                </div>
                                <div className="text-[20px] font-semibold tracking-[-0.01em] text-black">
                                    {entreprise?.stats?.documents || 0}
                                    <span className="text-[14px] font-normal text-black/40 ml-1">
                                        / mois
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 border-black/8 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
                                <Package className="h-5 w-5 text-black/60" strokeWidth={2} />
                            </div>
                            <div>
                                <div className="text-[12px] text-black/40 font-medium uppercase tracking-wide">
                                    Articles
                                </div>
                                <div className="text-[20px] font-semibold tracking-[-0.01em] text-black">
                                    {entreprise?.stats?.articles || 0}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </SettingsSection>

            {entreprise?.plan !== "FREE" && (
                <SettingsSection
                    icon={FileText}
                    title="Historique de facturation"
                    description="Consultez vos factures précédentes"
                >
                    <div className="max-w-3xl">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-3 border-b border-black/8">
                                <div>
                                    <div className="text-[14px] font-medium text-black">
                                        Janvier 2025
                                    </div>
                                    <p className="text-[13px] text-black/40 mt-0.5">
                                        Plan {currentPlan?.name} • Payée le 01/01/2025
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[14px] font-semibold text-black">
                                        {currentPlan?.price}
                                    </span>
                                    <Button variant="outline" size="sm" className="h-8 border-black/10 hover:bg-black/5">
                                        Télécharger
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-black/8">
                                <div>
                                    <div className="text-[14px] font-medium text-black">
                                        Décembre 2024
                                    </div>
                                    <p className="text-[13px] text-black/40 mt-0.5">
                                        Plan {currentPlan?.name} • Payée le 01/12/2024
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[14px] font-semibold text-black">
                                        {currentPlan?.price}
                                    </span>
                                    <Button variant="outline" size="sm" className="h-8 border-black/10 hover:bg-black/5">
                                        Télécharger
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between py-3">
                                <div>
                                    <div className="text-[14px] font-medium text-black">
                                        Novembre 2024
                                    </div>
                                    <p className="text-[13px] text-black/40 mt-0.5">
                                        Plan {currentPlan?.name} • Payée le 01/11/2024
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[14px] font-semibold text-black">
                                        {currentPlan?.price}
                                    </span>
                                    <Button variant="outline" size="sm" className="h-8 border-black/10 hover:bg-black/5">
                                        Télécharger
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </SettingsSection>
            )}
        </div>
    );
}
