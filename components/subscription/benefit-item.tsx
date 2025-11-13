import type { BenefitItemProps } from "@/lib/types/subscription";

/**
 * Benefit Item component for subscription success page
 * Displays a benefit with icon and text
 */
export function BenefitItem({ icon: Icon, text }: BenefitItemProps) {
    return (
        <li className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/5 flex-shrink-0">
                <Icon className="h-3.5 w-3.5 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-[13px] text-black/80 font-medium leading-snug">
                {text}
            </span>
        </li>
    );
}
