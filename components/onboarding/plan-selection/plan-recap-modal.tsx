"use client";

import { Check, Building2, CreditCard, Calendar, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { PLAN_ABONNEMENT } from "@/lib/config/activity-plan-mapping";
import { PLANS_CONFIG } from "@/lib/config/plans.config";
import { BUSINESS_TEMPLATES } from "@/lib/services/business-templates-data";
import { BusinessType } from "@/lib/types/business";

type PlanAbonnement = (typeof PLAN_ABONNEMENT)[keyof typeof PLAN_ABONNEMENT];

export interface PlanRecapModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    businessType: BusinessType | null;
    companyName: string;
    selectedPlan: PlanAbonnement | null;
    billingPeriod: "monthly" | "yearly";
    isLoading?: boolean;
}

export function PlanRecapModal({
    open,
    onClose,
    onConfirm,
    businessType,
    companyName,
    selectedPlan,
    billingPeriod,
    isLoading = false,
}: PlanRecapModalProps) {
    if (!selectedPlan) return null;

    const planConfig = PLANS_CONFIG[selectedPlan];
    const businessTemplate = businessType ? BUSINESS_TEMPLATES[businessType] : null;

    const price = billingPeriod === "monthly"
        ? planConfig.price.monthly
        : planConfig.price.yearly;

    const monthlyPrice = billingPeriod === "monthly"
        ? planConfig.price.monthly
        : Math.round(planConfig.price.yearly / 12);

    const isFree = selectedPlan === PLAN_ABONNEMENT.FREE;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.01em] text-black">
                        Récapitulatif
                    </DialogTitle>
                    <DialogDescription className="text-[14px] text-black/50">
                        Vérifiez les informations avant de continuer
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Entreprise */}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-black/[0.02] border border-black/5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/5">
                            <Building2 className="h-4 w-4 text-black/60" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[12px] text-black/40 uppercase tracking-wide">
                                Entreprise
                            </p>
                            <p className="text-[15px] font-medium text-black truncate">
                                {companyName || "Non renseigné"}
                            </p>
                            {businessTemplate && (
                                <p className="text-[13px] text-black/50">
                                    {businessTemplate.label}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Plan sélectionné */}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-black/[0.02] border border-black/5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/5">
                            <CreditCard className="h-4 w-4 text-black/60" strokeWidth={2} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[12px] text-black/40 uppercase tracking-wide">
                                Plan choisi
                            </p>
                            <p className="text-[15px] font-medium text-black">
                                {planConfig.name}
                            </p>
                            <p className="text-[13px] text-black/50">
                                {planConfig.description}
                            </p>
                        </div>
                    </div>

                    {/* Facturation */}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-black/[0.02] border border-black/5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/5">
                            <Calendar className="h-4 w-4 text-black/60" strokeWidth={2} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[12px] text-black/40 uppercase tracking-wide">
                                Facturation
                            </p>
                            <p className="text-[15px] font-medium text-black">
                                {billingPeriod === "monthly" ? "Mensuelle" : "Annuelle"}
                            </p>
                            {billingPeriod === "yearly" && !isFree && (
                                <p className="text-[13px] text-black/50">
                                    Économisez 20% par rapport au mensuel
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Prix total */}
                    <div className="pt-4 border-t border-black/10">
                        <div className="flex items-baseline justify-between">
                            <span className="text-[14px] text-black/60">
                                {isFree ? "Prix" : billingPeriod === "monthly" ? "Par mois" : "Par an"}
                            </span>
                            <div className="text-right">
                                <span className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                                    {isFree ? "Gratuit" : `${price}€`}
                                </span>
                                {!isFree && billingPeriod === "yearly" && (
                                    <p className="text-[12px] text-black/40">
                                        soit {monthlyPrice}€/mois
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 h-11 text-[14px] font-medium border-black/10 hover:bg-black/5"
                    >
                        Modifier
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 h-11 bg-black hover:bg-black/90 text-white text-[14px] font-medium"
                    >
                        {isLoading ? (
                            "Chargement..."
                        ) : isFree ? (
                            <span className="flex items-center gap-2">
                                <Check className="h-4 w-4" strokeWidth={2.5} />
                                Créer mon espace
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Procéder au paiement
                                <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
                            </span>
                        )}
                    </Button>
                </div>

                {/* Note de sécurité */}
                {!isFree && (
                    <div className="flex items-center justify-center gap-2 pt-2">
                        <Shield className="h-3.5 w-3.5 text-black/40" strokeWidth={2} />
                        <p className="text-[11px] text-black/40">
                            Paiement sécurisé par Stripe · S'ouvre dans un nouvel onglet
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
