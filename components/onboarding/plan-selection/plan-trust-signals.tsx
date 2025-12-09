import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PlanTrustSignalsProps {
    className?: string;
}

const TRUST_ITEMS = [
    "Sans engagement",
    "Annulez quand vous voulez",
    "Satisfait ou remboursé 30 jours",
];

export function PlanTrustSignals({ className }: PlanTrustSignalsProps) {
    return (
        <div
            className={cn(
                "flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0",
                className
            )}
        >
            <Shield
                className="h-4 w-4 text-black/30 mb-2 sm:mb-0 sm:mr-3"
                strokeWidth={1.5}
            />
            <div className="flex flex-wrap items-center justify-center gap-y-1">
                {TRUST_ITEMS.map((item, index) => (
                    <span key={item} className="flex items-center">
                        <span className="text-[13px] text-black/40">{item}</span>
                        {index < TRUST_ITEMS.length - 1 && (
                            <span className="mx-3 text-black/20">·</span>
                        )}
                    </span>
                ))}
            </div>
        </div>
    );
}
