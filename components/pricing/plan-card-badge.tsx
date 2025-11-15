interface PlanCardBadgeProps {
    type: "current" | "popular";
}

export function PlanCardBadge({ type }: PlanCardBadgeProps) {
    return (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="px-4 py-1.5 rounded-full bg-black text-white shadow-lg border-2 border-white">
                <span className="text-[11px] font-semibold tracking-wide uppercase">
                    {type === "current" ? " Votre plan" : " Populaire"}
                </span>
            </div>
        </div>
    );
}
