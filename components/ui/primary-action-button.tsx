import { cn } from "@/lib/utils";
import { DS } from "@/lib/constants/design-system";
import { LucideIcon } from "lucide-react";
import * as React from "react";

export interface PrimaryActionButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: LucideIcon;
    children: React.ReactNode;
    className?: string;
}

/**
 * PrimaryActionButton component
 *
 * Primary action button with optional icon.
 * Uses Design System constants for consistent styling.
 */
export function PrimaryActionButton({
    icon: Icon,
    children,
    className,
    ...props
}: PrimaryActionButtonProps) {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center gap-2",
                DS.component.button.primary,
                "disabled:opacity-50 disabled:pointer-events-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20",
                className
            )}
            {...props}
        >
            {Icon && <Icon className={DS.size.icon.small} strokeWidth={DS.size.icon.strokeWidth} />}
            {children}
        </button>
    );
}
