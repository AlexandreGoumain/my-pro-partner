"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { PLAN_ABONNEMENT } from "@/lib/config/activity-plan-mapping";
import { PLANS_CONFIG } from "@/lib/config/plans.config";
import { cn } from "@/lib/utils";
import { Check, Sparkles, X } from "lucide-react";

type PlanAbonnement = (typeof PLAN_ABONNEMENT)[keyof typeof PLAN_ABONNEMENT];

interface PlanComparisonModalProps {
    open: boolean;
    onClose: () => void;
    onSelectPlan: (plan: PlanAbonnement) => void;
}

/**
 * Modal de comparaison détaillée des plans
 * Design élégant et sobre inspiré d'Apple
 * Structure en grille unifiée pour alignement parfait
 */
export function PlanComparisonModal({
    open,
    onClose,
    onSelectPlan,
}: PlanComparisonModalProps) {
    // Plans avec indicateur de popularité
    const plans = Object.values(PLAN_ABONNEMENT).map((id) => ({
        id,
        name: PLANS_CONFIG[id].name,
        popular: id === PLAN_ABONNEMENT.STARTER,
    }));

    // Fonction helper pour formater les valeurs illimitées
    const formatLimit = (value: number, isEnterprise: boolean) => {
        if (isEnterprise) return "Illimité";
        return value === -1 ? "Illimité" : value.toLocaleString("fr-FR");
    };

    const features = [
        {
            category: "Limites",
            items: [
                {
                    name: "Utilisateurs",
                    values: plans.map((p) =>
                        formatLimit(
                            PLANS_CONFIG[p.id].limits.maxUsers,
                            p.id === PLAN_ABONNEMENT.ENTERPRISE
                        )
                    ),
                },
                {
                    name: "Clients",
                    values: plans.map((p) =>
                        formatLimit(
                            PLANS_CONFIG[p.id].limits.maxClients,
                            p.id === PLAN_ABONNEMENT.ENTERPRISE
                        )
                    ),
                },
                {
                    name: "Documents/mois",
                    values: plans.map((p) =>
                        formatLimit(
                            PLANS_CONFIG[p.id].limits.maxDocumentsPerMonth,
                            p.id === PLAN_ABONNEMENT.ENTERPRISE
                        )
                    ),
                },
                {
                    name: "Produits",
                    values: plans.map((p) =>
                        formatLimit(
                            PLANS_CONFIG[p.id].limits.maxProducts,
                            p.id === PLAN_ABONNEMENT.ENTERPRISE
                        )
                    ),
                },
            ],
        },
        {
            category: "Documents",
            items: [
                { name: "Devis & Factures", values: [true, true, true, true] },
                { name: "Avoirs", values: [false, true, true, true] },
                {
                    name: "Templates personnalisés",
                    values: [false, true, true, true],
                },
                { name: "Export Excel", values: [false, true, true, true] },
            ],
        },
        {
            category: "Gestion",
            items: [
                { name: "Stock avancé", values: [false, true, true, true] },
                {
                    name: "Champs personnalisés",
                    values: [false, true, true, true],
                },
                {
                    name: "Programme fidélité",
                    values: [false, true, true, true],
                },
                {
                    name: "Multi-emplacements",
                    values: [false, false, true, true],
                },
            ],
        },
        {
            category: "Intelligence Artificielle",
            items: [
                {
                    name: "Assistant IA",
                    values: [false, "100 Q/mois", "Illimité", "Illimité"],
                },
            ],
        },
        {
            category: "Marketing",
            items: [
                { name: "Campagnes email", values: [false, true, true, true] },
                { name: "Automations", values: [false, false, true, true] },
            ],
        },
        {
            category: "Intégrations",
            items: [
                { name: "API REST", values: [false, false, true, true] },
                { name: "Webhooks", values: [false, false, true, true] },
                {
                    name: "Intégrations tierces",
                    values: [false, false, true, true],
                },
            ],
        },
        {
            category: "Support",
            items: [
                {
                    name: "Support",
                    values: ["Aucun", "Email 24h", "Prioritaire", "24/7 dédié"],
                },
                {
                    name: "Formation équipe",
                    values: [false, false, false, true],
                },
            ],
        },
    ];

    const renderCell = (value: boolean | string, planIndex: number) => {
        const isPopular = plans[planIndex].popular;

        if (typeof value === "boolean") {
            return value ? (
                <div
                    className={cn(
                        "inline-flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200",
                        isPopular ? "bg-black/5" : "bg-black/2"
                    )}
                >
                    <Check
                        className={cn(
                            "h-4 w-4 transition-all duration-200",
                            isPopular ? "text-black" : "text-black/60"
                        )}
                        strokeWidth={2}
                    />
                </div>
            ) : (
                <X className="h-4 w-4 text-black/15" strokeWidth={2} />
            );
        }
        return (
            <span
                className={cn(
                    "text-[13px] font-medium tracking-[-0.01em] transition-all duration-200",
                    isPopular ? "text-black" : "text-black/60"
                )}
            >
                {value}
            </span>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="max-h-[90vh] max-w-[95vw] overflow-y-auto p-0 lg:max-w-7xl"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader className="sticky top-0 z-20 border-b border-black/8 bg-white/95 px-4 pb-6 pt-8 backdrop-blur-sm md:px-8">
                    {/* Bouton de fermeture */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-md p-1.5 text-black/40 transition-colors hover:bg-black/5 hover:text-black md:right-8 md:top-8"
                    >
                        <X className="h-5 w-5" strokeWidth={2} />
                        <span className="sr-only">Fermer</span>
                    </button>

                    <DialogTitle className="text-[24px] font-semibold tracking-[-0.02em] text-black md:text-[28px]">
                        Comparer les plans
                    </DialogTitle>
                    <DialogDescription className="mt-2 text-[14px] leading-relaxed text-black/40 md:text-[15px]">
                        Trouvez le plan qui correspond le mieux à vos besoins
                    </DialogDescription>
                </DialogHeader>

                <div className="px-4 py-6 md:px-8">
                    {/* Structure en grille unifiée pour alignement parfait */}
                    {/* Header des plans - Grille avec colonne vide pour labels */}
                    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-[180px,repeat(4,1fr)] lg:grid-cols-[220px,repeat(4,1fr)]">
                        {/* Colonne vide pour aligner avec les labels de features */}
                        <div className="hidden md:block" />

                        {/* Cards des plans */}
                        {plans.map((plan) => (
                            <Card
                                key={plan.id}
                                className={cn(
                                    "relative border transition-all duration-300",
                                    plan.popular
                                        ? "border-black/20 bg-black/2 shadow-sm"
                                        : "border-black/8 bg-white hover:border-black/15"
                                )}
                            >
                                <div className="p-4 lg:p-5">
                                    {plan.popular && (
                                        <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-black text-[11px] font-medium text-white">
                                            <Sparkles
                                                className="mr-1 h-3 w-3"
                                                strokeWidth={2}
                                            />
                                            Populaire
                                        </Badge>
                                    )}
                                    <div className="text-center">
                                        <div className="text-[16px] font-semibold tracking-[-0.01em] text-black lg:text-[18px]">
                                            {plan.name}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Catégories et features - Même structure de grille */}
                    <div className="space-y-8">
                        {features.map((category, categoryIndex) => (
                            <div key={category.category}>
                                {categoryIndex > 0 && (
                                    <Separator className="mb-8 bg-black/5" />
                                )}
                                <div className="mb-4 flex items-center gap-2">
                                    <div className="text-[15px] font-semibold tracking-[-0.01em] text-black lg:text-[16px]">
                                        {category.category}
                                    </div>
                                    <div className="h-px flex-1 bg-black/5" />
                                </div>
                                <div className="space-y-1">
                                    {category.items.map((item) => (
                                        <div
                                            key={item.name}
                                            className="grid grid-cols-1 gap-4 rounded-lg px-3 py-3 transition-all duration-200 hover:bg-black/2 md:grid-cols-[180px,repeat(4,1fr)] md:px-4 lg:grid-cols-[220px,repeat(4,1fr)]"
                                        >
                                            <div className="text-[13px] font-medium tracking-[-0.01em] text-black md:text-[14px] md:font-normal md:text-black/60">
                                                {item.name}
                                            </div>
                                            {item.values.map((value, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-center"
                                                >
                                                    {renderCell(value, index)}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Actions - Même structure de grille */}
                    <div className="sticky bottom-0 z-20 mt-10 border-t border-black/8 bg-white/95 pb-2 pt-6 backdrop-blur-sm">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-[180px,repeat(4,1fr)] lg:grid-cols-[220px,repeat(4,1fr)]">
                            {/* Colonne vide pour aligner avec les labels */}
                            <div className="hidden md:block" />

                            {/* Boutons de sélection */}
                            {plans.map((plan) => (
                                <Button
                                    key={plan.id}
                                    type="button"
                                    onClick={() => {
                                        onSelectPlan(plan.id);
                                        onClose();
                                    }}
                                    className={cn(
                                        "h-11 text-[14px] font-medium shadow-sm transition-all duration-200",
                                        plan.popular
                                            ? "bg-black text-white hover:bg-black/90"
                                            : "border border-black/10 bg-white text-black hover:bg-black/5"
                                    )}
                                    variant={
                                        plan.popular ? "default" : "outline"
                                    }
                                >
                                    Choisir
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
