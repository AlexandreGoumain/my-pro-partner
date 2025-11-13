"use client";

import { Button } from "@/components/ui/button";
import { SettingsSection } from "@/components/ui/settings-section";
import { Card, CardContent } from "@/components/ui/card";
import {
    CreditCard,
    TrendingUp,
    Users,
    FileText,
    Package,
    ArrowRight,
    Sparkles,
} from "lucide-react";
import { useLimitDialog } from "@/components/providers";
import { LimitIndicator } from "@/components/paywall";
import { PRICING_PLANS } from "@/lib/pricing-config";
import { useClients } from "@/hooks/use-clients";
import { useArticles } from "@/hooks/use-articles";
import Link from "next/link";

export function SubscriptionTab() {
    const { userPlan } = useLimitDialog();
    const { data: clients = [] } = useClients();
    const { data: articles = [] } = useArticles();

    const currentPlanLimits = PRICING_PLANS[userPlan];

    return (
        <div className="space-y-10">
            {/* Statistiques d'utilisation */}
            <SettingsSection
                icon={TrendingUp}
                title="Utilisation"
                description="Suivez votre consommation actuelle par rapport aux limites"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Clients */}
                    <Card className="border-black/8 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-br from-black/[0.02] to-black/[0.04] p-5 border-b border-black/8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm border border-black/8">
                                    <Users className="w-5 h-5 text-black" strokeWidth={2} />
                                </div>
                                <div>
                                    <h4 className="text-[13px] font-medium text-black/60 tracking-[-0.01em] uppercase">
                                        Clients
                                    </h4>
                                    <p className="text-[22px] font-bold text-black tracking-[-0.02em] mt-0.5">
                                        {clients.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <CardContent className="p-5">
                            <LimitIndicator
                                userPlan={userPlan}
                                limitKey="maxClients"
                                currentValue={clients.length}
                                label="Clients"
                                showProgress
                                showUpgradeLink={false}
                            />
                        </CardContent>
                    </Card>

                    {/* Articles */}
                    <Card className="border-black/8 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-br from-black/[0.02] to-black/[0.04] p-5 border-b border-black/8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm border border-black/8">
                                    <Package className="w-5 h-5 text-black" strokeWidth={2} />
                                </div>
                                <div>
                                    <h4 className="text-[13px] font-medium text-black/60 tracking-[-0.01em] uppercase">
                                        Articles
                                    </h4>
                                    <p className="text-[22px] font-bold text-black tracking-[-0.02em] mt-0.5">
                                        {articles.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <CardContent className="p-5">
                            <LimitIndicator
                                userPlan={userPlan}
                                limitKey="maxProducts"
                                currentValue={articles.length}
                                label="Articles"
                                showProgress
                                showUpgradeLink={false}
                            />
                        </CardContent>
                    </Card>

                    {/* Documents */}
                    <Card className="border-black/8 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-br from-black/[0.02] to-black/[0.04] p-5 border-b border-black/8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm border border-black/8">
                                    <FileText className="w-5 h-5 text-black" strokeWidth={2} />
                                </div>
                                <div>
                                    <h4 className="text-[13px] font-medium text-black/60 tracking-[-0.01em] uppercase">
                                        Documents
                                    </h4>
                                    <p className="text-[22px] font-bold text-black tracking-[-0.02em] mt-0.5">
                                        {currentPlanLimits.maxDocumentsPerMonth === -1
                                            ? "∞"
                                            : currentPlanLimits.maxDocumentsPerMonth}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <CardContent className="p-5">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] text-black/60">Limite mensuelle</span>
                                    <span className="text-[13px] font-semibold text-black">
                                        {currentPlanLimits.maxDocumentsPerMonth === -1
                                            ? "Illimité"
                                            : `${currentPlanLimits.maxDocumentsPerMonth} docs`}
                                    </span>
                                </div>
                                <p className="text-[12px] text-black/40 leading-relaxed">
                                    {currentPlanLimits.maxDocumentsPerMonth === -1
                                        ? "Créez autant de devis et factures que nécessaire"
                                        : "Devis et factures combinés"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </SettingsSection>

            {/* CTA vers la page des plans */}
            <SettingsSection
                icon={CreditCard}
                title="Gérer mon abonnement"
                description="Changer de plan, mettre à jour le paiement ou annuler"
            >
                <Card className="border-black/8 shadow-sm max-w-2xl">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-black/5 to-black/10">
                                    <Sparkles className="w-7 h-7 text-black" strokeWidth={2} />
                                </div>
                                <div>
                                    <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-black mb-1">
                                        Besoin de plus ?
                                    </h3>
                                    <p className="text-[14px] text-black/60 leading-relaxed">
                                        Explorez nos plans et trouvez celui qui correspond à vos besoins
                                    </p>
                                </div>
                            </div>

                            <Button
                                asChild
                                className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                            >
                                <Link href="/dashboard/pricing">
                                    Voir les plans
                                    <ArrowRight className="w-4 h-4 ml-2" strokeWidth={2} />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </SettingsSection>
        </div>
    );
}
