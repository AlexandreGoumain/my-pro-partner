"use client";

import { LimitIndicator } from "@/components/paywall";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanLimits, PlanType } from "@/lib/pricing-config";
import { LucideIcon } from "lucide-react";

export interface UsageLimitCardProps {
    /**
     * Plan de l'utilisateur
     */
    userPlan: PlanType;

    /**
     * Clé de la limite à afficher
     */
    limitKey: keyof PlanLimits;

    /**
     * Valeur actuelle
     */
    currentValue: number;

    /**
     * Label à afficher (ex: "Clients", "Articles")
     */
    label: string;

    /**
     * Icône à afficher dans le header
     */
    icon: LucideIcon;

    /**
     * Titre de la carte (par défaut: "Utilisation")
     */
    title?: string;
}

/**
 * Carte d'utilisation avec indicateur de limite de plan
 *
 * Composant réutilisable pour afficher l'utilisation d'une ressource
 * avec une barre de progression et des alertes de limite.
 *
 * @example
 * ```tsx
 * <UsageLimitCard
 *   userPlan={user.plan}
 *   limitKey="maxClients"
 *   currentValue={clients.length}
 *   label="Clients"
 *   icon={Users}
 * />
 * ```
 */
export function UsageLimitCard({
    userPlan,
    limitKey,
    currentValue,
    label,
    icon: Icon,
    title = "Utilisation",
}: UsageLimitCardProps) {
    return (
        <Card className="border-black/10">
            <CardHeader>
                <CardTitle className="text-[16px] font-semibold text-black flex items-center gap-2">
                    <Icon className="w-5 h-5 text-black/60" strokeWidth={2} />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <LimitIndicator
                    userPlan={userPlan}
                    limitKey={limitKey}
                    currentValue={currentValue}
                    label={label}
                    showProgress
                    showUpgradeLink
                />
            </CardContent>
        </Card>
    );
}
