import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PlanFeatureItemProps {
    text: string;
    highlighted?: boolean;
    className?: string;
}

export function PlanFeatureItem({
    text,
    highlighted = false,
    className,
}: PlanFeatureItemProps) {
    return (
        <div
            className={cn(
                "flex items-start gap-3 text-[14px]",
                highlighted ? "text-black" : "text-black/70",
                className
            )}
        >
            <Check
                className={cn(
                    "h-4 w-4 mt-0.5 flex-shrink-0",
                    highlighted ? "text-black" : "text-black/30"
                )}
                strokeWidth={2.5}
            />
            <span className="leading-relaxed">{text}</span>
        </div>
    );
}
