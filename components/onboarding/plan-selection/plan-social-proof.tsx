import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLAN_ABONNEMENT } from "@/lib/config/activity-plan-mapping";

type PlanAbonnement = (typeof PLAN_ABONNEMENT)[keyof typeof PLAN_ABONNEMENT];

export interface PlanSocialProofProps {
    planId: PlanAbonnement;
    className?: string;
}

const SOCIAL_PROOF_DATA: Partial<Record<PlanAbonnement, string>> = {
    [PLAN_ABONNEMENT.STARTER]: "Choisi par 1,200+ artisans",
    [PLAN_ABONNEMENT.PRO]: "Le choix des entreprises en croissance",
};

export function PlanSocialProof({ planId, className }: PlanSocialProofProps) {
    const text = SOCIAL_PROOF_DATA[planId];

    if (!text) return null;

    return (
        <div
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1",
                className
            )}
        >
            <Users className="h-3 w-3 text-black/50" strokeWidth={2} />
            <span className="text-[11px] font-medium text-black/60">
                {text}
            </span>
        </div>
    );
}
