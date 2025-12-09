import { Gift } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PlanTrialHighlightProps {
    trialDays?: number;
    trialPlan?: string;
    className?: string;
}

export function PlanTrialHighlight({
    trialDays = 14,
    trialPlan = "PRO",
    className,
}: PlanTrialHighlightProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-center gap-3 rounded-lg border border-black/8 bg-black/[0.02] px-5 py-3",
                className
            )}
        >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5">
                <Gift className="h-4 w-4 text-black/60" strokeWidth={2} />
            </div>
            <div className="text-left">
                <p className="text-[14px] font-medium text-black">
                    {trialDays} jours d&apos;essai {trialPlan} offerts
                </p>
                <p className="text-[13px] text-black/50">
                    Toutes les fonctionnalités, aucun engagement
                </p>
            </div>
        </div>
    );
}
