import { cn } from "@/lib/utils";

export interface GuideProgressProps {
    currentTip: number;
    totalTips: number;
}

/**
 * Progress indicator dots showing current position in the guide
 */
export function GuideProgress({ currentTip, totalTips }: GuideProgressProps) {
    return (
        <div className="flex justify-center gap-1.5 mb-6">
            {Array.from({ length: totalTips }).map((_, index) => (
                <div
                    key={index}
                    className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        index === currentTip && "w-6 bg-black",
                        index < currentTip && "w-1.5 bg-black/30",
                        index > currentTip && "w-1.5 bg-black/10"
                    )}
                />
            ))}
        </div>
    );
}
