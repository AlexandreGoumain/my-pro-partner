import type { TimelineStepProps } from "@/lib/types/subscription";

/**
 * Timeline Step component for subscription success page
 * Displays a numbered step with icon, title and description
 */
export function TimelineStep({
    number,
    icon: Icon,
    title,
    description,
    delay = 0,
}: TimelineStepProps) {
    return (
        <div
            className="flex items-start gap-3.5 animate-in fade-in slide-in-from-left-4 duration-500"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex-shrink-0">
                <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white shadow-sm">
                        <span className="text-[15px] font-semibold">
                            {number}
                        </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white border border-black/10">
                        <Icon
                            className="h-2.5 w-2.5 text-black"
                            strokeWidth={2.5}
                        />
                    </div>
                </div>
            </div>
            <div className="flex-1 pt-0.5">
                <h3 className="text-[15px] font-semibold text-black mb-1 leading-tight">
                    {title}
                </h3>
                <p className="text-[13px] text-black/60 leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
}
