import { PlanType } from "@/lib/pricing-config";
import { Crown, Sparkles, Star, Zap } from "lucide-react";
import type { ReactElement } from "react";

/**
 * Retourne l'icone appropriee pour un plan donne
 */
export function getPlanIcon(plan: PlanType): ReactElement {
    switch (plan) {
        case "ENTERPRISE":
            return <Crown className="w-6 h-6" strokeWidth={2} />;
        case "PRO":
            return <Star className="w-6 h-6" strokeWidth={2} />;
        case "STARTER":
            return <Sparkles className="w-6 h-6" strokeWidth={2} />;
        default:
            return <Zap className="w-6 h-6" strokeWidth={2} />;
    }
}
