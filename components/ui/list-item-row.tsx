import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface ListItemRowProps {
    /** Lucide icon component */
    icon?: LucideIcon;
    /** Main label */
    label: ReactNode;
    /** Value displayed on the right */
    value?: ReactNode;
    /** Additional details below label */
    details?: ReactNode;
    /** Extra content below details */
    extra?: ReactNode;
    /** Additional className */
    className?: string;
    /** Click handler */
    onClick?: () => void;
}

/**
 * ListItemRow - List item with icon, label, value and details
 *
 * @example
 * <ListItemRow
 *   icon={CreditCard}
 *   label="Carte bancaire"
 *   value="150,00 €"
 *   details="12 janvier 2025"
 * />
 *
 * @example
 * // Without icon
 * <ListItemRow
 *   label="Article XYZ"
 *   value="12 unités"
 *   details="Stock faible"
 * />
 */
export function ListItemRow({
    icon: Icon,
    label,
    value,
    details,
    extra,
    className,
    onClick,
}: ListItemRowProps) {
    return (
        <div
            className={cn(
                "flex items-start gap-3 p-3 rounded-md border border-black/5 bg-black/2",
                onClick && "cursor-pointer hover:bg-black/5 transition-colors",
                className
            )}
            onClick={onClick}
        >
            {Icon && (
                <div className="mt-0.5 flex-shrink-0">
                    <Icon className="w-4 h-4 text-black/40" strokeWidth={2} />
                </div>
            )}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-medium text-black">
                        {label}
                    </span>
                    {value && (
                        <span className="text-[14px] font-semibold text-black">
                            {value}
                        </span>
                    )}
                </div>
                {details && (
                    <div className="text-[12px] text-black/60">{details}</div>
                )}
                {extra && <div className="mt-1">{extra}</div>}
            </div>
        </div>
    );
}
