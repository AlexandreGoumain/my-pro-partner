"use client";

import { PlanType, PLAN_PRICING } from "@/lib/pricing-config";
import { Crown, Star, Zap } from "lucide-react";

interface FeatureBadgeProps {
    /**
     * Plan minimum requis pour cette feature
     */
    requiredPlan: PlanType;

    /**
     * Style compact ou normal
     */
    compact?: boolean;
}

/**
 * Badge pour indiquer qu'une feature nécessite un plan spécifique
 *
 * @example
 * ```tsx
 * <div className="flex items-center gap-2">
 *   <span>Segmentation clients</span>
 *   <FeatureBadge requiredPlan="PRO" />
 * </div>
 * ```
 */
export function FeatureBadge({ requiredPlan, compact = false }: FeatureBadgeProps) {
    const planInfo = PLAN_PRICING[requiredPlan];

    const getBadgeStyle = () => {
        switch (requiredPlan) {
            case "ENTERPRISE":
                return "bg-gradient-to-r from-black to-black/80 text-white border-black";
            case "PRO":
                return "bg-black/5 text-black border-black/10";
            case "STARTER":
                return "bg-black/[0.03] text-black/60 border-black/8";
            default:
                return "bg-black/[0.02] text-black/40 border-black/5";
        }
    };

    const getIcon = () => {
        switch (requiredPlan) {
            case "ENTERPRISE":
                return <Crown className="w-3 h-3" strokeWidth={2} />;
            case "PRO":
                return <Star className="w-3 h-3" strokeWidth={2} />;
            case "STARTER":
                return <Zap className="w-3 h-3" strokeWidth={2} />;
            default:
                return null;
        }
    };

    if (compact) {
        return (
            <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium ${getBadgeStyle()}`}
            >
                {getIcon()}
                {planInfo.name}
            </span>
        );
    }

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-medium ${getBadgeStyle()}`}
        >
            {getIcon()}
            {planInfo.name}
        </span>
    );
}
