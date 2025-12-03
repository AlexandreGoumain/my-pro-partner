"use client";

import { LimitIndicator } from "@/components/paywall";
import { CardSection } from "@/components/ui/card-section";
import { type PlanType, type LimitKey } from "@/hooks/use-plan-limits";
import { LucideIcon } from "lucide-react";

export interface UsageLimitCardProps {
    /**
     * Plan de l'utilisateur
     */
    userPlan: PlanType;

    /**
     * Clé de la limite à afficher
     */
    limitKey: LimitKey;

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
    icon,
    title = "Utilisation",
}: UsageLimitCardProps) {
    return (
        <CardSection
            title={title}
            icon={icon}
            className="border-black/10"
            titleClassName="text-[16px]"
        >
            <LimitIndicator
                userPlan={userPlan}
                limitKey={limitKey}
                currentValue={currentValue}
                label={label}
                showProgress
                showUpgradeLink
            />
        </CardSection>
    );
}
