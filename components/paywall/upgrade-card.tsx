"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { PlanType, PLAN_PRICING } from "@/lib/pricing-config";

interface UpgradeCardProps {
    message: string;
    recommendedPlan?: PlanType | null;
    compact?: boolean;
}

/**
 * Carte pour inciter à l'upgrade de plan
 */
export function UpgradeCard({ message, recommendedPlan, compact = false }: UpgradeCardProps) {
    const planInfo = recommendedPlan ? PLAN_PRICING[recommendedPlan] : null;

    if (compact) {
        return (
            <Card className="border-black/10">
                <CardContent className="p-4 space-y-3">
                    <p className="text-[13px] text-black/60">{message}</p>
                    <Link href={recommendedPlan ? `/pricing?plan=${recommendedPlan}` : "/pricing"}>
                        <Button
                            size="sm"
                            className="bg-black hover:bg-black/90 text-white rounded-md h-9 px-4 text-[13px] font-medium w-full"
                        >
                            {recommendedPlan ? `Passer au plan ${planInfo?.name}` : "Voir les plans"}
                            <ArrowRight className="ml-2 h-3 w-3" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-black/10 max-w-md mx-auto">
            <CardHeader className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black/5 mx-auto">
                    <Sparkles className="w-6 h-6 text-black/60" strokeWidth={2} />
                </div>
                <CardTitle className="text-[20px] font-semibold tracking-[-0.02em] text-black">
                    Fonctionnalité premium
                </CardTitle>
                <CardDescription className="text-[14px] text-black/60">{message}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pb-6">
                {planInfo && (
                    <div className="p-4 bg-black/[0.02] rounded-lg border border-black/8">
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-[28px] font-semibold text-black tracking-[-0.02em]">
                                {planInfo.price}€
                            </span>
                            <span className="text-[14px] text-black/40">/mois</span>
                        </div>
                        <p className="text-[13px] text-black/60">{planInfo.tagline}</p>
                    </div>
                )}

                <div className="space-y-2">
                    <Link href={recommendedPlan ? `/pricing?plan=${recommendedPlan}` : "/pricing"}>
                        <Button
                            className="bg-black hover:bg-black/90 text-white rounded-md h-11 px-6 text-[14px] font-medium w-full"
                        >
                            {recommendedPlan ? `Passer au plan ${planInfo?.name}` : "Voir tous les plans"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        className="border-black/10 hover:bg-black/5 h-11 px-6 text-[14px] font-medium w-full"
                        asChild
                    >
                        <Link href="/pricing">Comparer les plans</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
