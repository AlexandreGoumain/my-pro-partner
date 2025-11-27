import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface InfoRowProps {
    /** Label text */
    label: string;
    /** Value to display */
    value: ReactNode;
    /** Additional className */
    className?: string;
}

/**
 * InfoRow - Horizontal label-value pair
 *
 * @example
 * <InfoRow label="Montant" value="150 €" />
 */
export function InfoRow({ label, value, className }: InfoRowProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <span className="font-medium text-black/80">{label}:</span>
            <span>{value}</span>
        </div>
    );
}

/**
 * InfoRowDivider - Vertical divider between InfoRow items
 */
export function InfoRowDivider() {
    return <div className="h-4 w-px bg-black/10" />;
}

export interface InfoRowGroupProps {
    children: ReactNode;
    className?: string;
}

/**
 * InfoRowGroup - Container for multiple InfoRow items with dividers
 *
 * @example
 * <InfoRowGroup>
 *   <InfoRow label="Déclencheur" value="Nouveau client" />
 *   <InfoRow label="Action" value="Envoyer email" />
 *   <InfoRow label="Exécutions" value={42} />
 * </InfoRowGroup>
 */
export function InfoRowGroup({ children, className }: InfoRowGroupProps) {
    return (
        <div
            className={cn(
                "flex items-center gap-6 text-[13px] text-black/60",
                className
            )}
        >
            {children}
        </div>
    );
}
