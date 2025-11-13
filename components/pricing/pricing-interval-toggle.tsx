import { cn } from "@/lib/utils";
import { IntervalType } from "@/lib/types/pricing";

interface PricingIntervalToggleProps {
    interval: IntervalType;
    onChange: (interval: IntervalType) => void;
}

export function PricingIntervalToggle({
    interval,
    onChange,
}: PricingIntervalToggleProps) {
    return (
        <div className="inline-flex items-center gap-3 bg-black/5 p-1.5 rounded-lg">
            <button
                onClick={() => onChange("month")}
                className={cn(
                    "px-6 py-2 text-[14px] font-medium rounded-md transition-all duration-200",
                    interval === "month"
                        ? "bg-white text-black shadow-sm"
                        : "text-black/60 hover:text-black"
                )}
            >
                Mensuel
            </button>
            <button
                onClick={() => onChange("year")}
                className={cn(
                    "px-6 py-2 text-[14px] font-medium rounded-md transition-all duration-200 flex items-center gap-2",
                    interval === "year"
                        ? "bg-white text-black shadow-sm"
                        : "text-black/60 hover:text-black"
                )}
            >
                Annuel
                <span className="text-[12px] bg-black text-white px-2 py-0.5 rounded-full">
                    -17%
                </span>
            </button>
        </div>
    );
}
