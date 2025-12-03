"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SettingsSection } from "@/components/ui/settings-section";
import { LimitIndicator } from "@/components/paywall";
import { useLimitDialog } from "@/components/providers";
import { useArticles } from "@/hooks/use-articles";
import { useClients } from "@/hooks/use-clients";
import { PLANS_CONFIG } from "@/lib/config/plans.config";
import {
    ArrowRight,
    CreditCard,
    FileText,
    Package,
    Sparkles,
    TrendingUp,
    Users,
} from "lucide-react";
import Link from "next/link";

interface UsageCardProps {
    icon: React.ElementType;
    title: string;
    value: number | string;
    children: React.ReactNode;
}

function UsageCard({ icon: Icon, title, value, children }: UsageCardProps) {
    return (
        <Card className="border-black/8 shadow-sm overflow-hidden">
            <div className="bg-black/[0.02] p-5 border-b border-black/8">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm border border-black/8">
                        <Icon className="w-5 h-5 text-black" strokeWidth={2} />
                    </div>
                    <div>
                        <h4 className="text-[13px] font-medium text-black/60 uppercase tracking-wide">
                            {title}
                        </h4>
                        <p className="text-[22px] font-bold text-black tracking-tight mt-0.5">
                            {value}
                        </p>
                    </div>
                </div>
            </div>
            <CardContent className="p-5">{children}</CardContent>
        </Card>
    );
}

export function SubscriptionTab() {
    const { userPlan } = useLimitDialog();
    const { data: clients = [] } = useClients();
    const { data: articles = [] } = useArticles();

    const currentPlanConfig = PLANS_CONFIG[userPlan];
    const documentsLimit = currentPlanConfig.limits.maxDocumentsPerMonth;

    return (
        <div className="space-y-8">
            <SettingsSection
                icon={TrendingUp}
                title="Utilisation"
                description="Consommation actuelle par rapport aux limites de votre plan"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <UsageCard icon={Users} title="Clients" value={clients.length}>
                        <LimitIndicator
                            userPlan={userPlan}
                            limitKey="maxClients"
                            currentValue={clients.length}
                            label="Clients"
                            showProgress
                            showUpgradeLink={false}
                        />
                    </UsageCard>

                    <UsageCard icon={Package} title="Articles" value={articles.length}>
                        <LimitIndicator
                            userPlan={userPlan}
                            limitKey="maxProducts"
                            currentValue={articles.length}
                            label="Articles"
                            showProgress
                            showUpgradeLink={false}
                        />
                    </UsageCard>

                    <UsageCard
                        icon={FileText}
                        title="Documents"
                        value={documentsLimit === -1 ? "∞" : documentsLimit}
                    >
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] text-black/60">Limite mensuelle</span>
                                <span className="text-[13px] font-semibold text-black">
                                    {documentsLimit === -1 ? "Illimité" : `${documentsLimit} docs`}
                                </span>
                            </div>
                            <p className="text-[12px] text-black/50">
                                {documentsLimit === -1
                                    ? "Créez autant de devis et factures que nécessaire"
                                    : "Devis et factures combinés"}
                            </p>
                        </div>
                    </UsageCard>
                </div>
            </SettingsSection>

            <SettingsSection
                icon={CreditCard}
                title="Abonnement"
                description="Gérer votre plan et vos options de paiement"
            >
                <Card className="border-black/8 shadow-sm max-w-2xl">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/5">
                                    <Sparkles className="w-6 h-6 text-black" strokeWidth={2} />
                                </div>
                                <div>
                                    <h3 className="text-[18px] font-semibold tracking-tight text-black">
                                        Besoin de plus ?
                                    </h3>
                                    <p className="text-[14px] text-black/60 mt-0.5">
                                        Découvrez nos plans et trouvez celui qui vous convient
                                    </p>
                                </div>
                            </div>

                            <Button
                                asChild
                                className="bg-black hover:bg-black/90 text-white h-11 px-6"
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
