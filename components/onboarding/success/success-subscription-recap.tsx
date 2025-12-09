"use client";

import { CreditCard, Calendar, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessSubscriptionRecapProps {
    planName: string;
    price: string;
    billingPeriod: string;
    trialDays?: number;
    className?: string;
}

/**
 * Récapitulatif de l'abonnement souscrit
 */
export function SuccessSubscriptionRecap({
    planName,
    price,
    billingPeriod,
    trialDays = 14,
    className,
}: SuccessSubscriptionRecapProps) {
    return (
        <div
            className={cn(
                "p-6 rounded-2xl bg-black/[0.02] border border-black/5",
                className
            )}
        >
            <h3 className="text-[13px] font-medium text-black/40 uppercase tracking-wide mb-4">
                Votre abonnement
            </h3>

            <div className="space-y-4">
                {/* Plan */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-black/5 flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-black/60" strokeWidth={2} />
                        </div>
                        <div>
                            <p className="text-[15px] font-medium text-black">
                                Plan {planName}
                            </p>
                            <p className="text-[13px] text-black/50">
                                {billingPeriod}
                            </p>
                        </div>
                    </div>
                    <span className="text-[18px] font-semibold text-black">
                        {price}
                    </span>
                </div>

                {/* Période d'essai */}
                {trialDays > 0 && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-black/[0.03]">
                        <div className="h-8 w-8 rounded-lg bg-black/5 flex items-center justify-center">
                            <Gift className="h-4 w-4 text-black/60" strokeWidth={2} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[14px] font-medium text-black">
                                {trialDays} jours d'essai offerts
                            </p>
                            <p className="text-[12px] text-black/50">
                                Vous ne serez débité qu'à la fin de la période d'essai
                            </p>
                        </div>
                    </div>
                )}

                {/* Date prochaine facturation */}
                <div className="flex items-center gap-3 pt-3 border-t border-black/5">
                    <Calendar className="h-4 w-4 text-black/40" strokeWidth={2} />
                    <p className="text-[13px] text-black/50">
                        Prochaine facturation le{" "}
                        <span className="text-black/70 font-medium">
                            {new Date(
                                Date.now() + trialDays * 24 * 60 * 60 * 1000
                            ).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
