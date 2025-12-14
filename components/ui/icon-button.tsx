import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Button, buttonVariants } from "./button";

type IconButtonSize = "icon" | "icon-sm" | "icon-lg";

interface IconButtonProps
    extends Omit<React.ComponentProps<"button">, "aria-label">,
        Omit<VariantProps<typeof buttonVariants>, "size"> {
    /** Required label for screen readers */
    "aria-label": string;
    /** Size of the icon button */
    size?: IconButtonSize;
    /** Use Slot for composition */
    asChild?: boolean;
}

/**
 * IconButton - Accessible icon-only button
 *
 * This component enforces aria-label for all icon-only buttons,
 * ensuring accessibility compliance.
 *
 * @example
 * <IconButton aria-label="Fermer" onClick={onClose}>
 *   <X className="h-4 w-4" />
 * </IconButton>
 *
 * @example
 * <IconButton aria-label="Supprimer" variant="destructive" size="icon-sm">
 *   <Trash2 className="h-4 w-4" />
 * </IconButton>
 */
function IconButton({
    className,
    variant,
    size = "icon",
    "aria-label": ariaLabel,
    ...props
}: IconButtonProps) {
    return (
        <Button
            variant={variant}
            size={size}
            aria-label={ariaLabel}
            className={cn(className)}
            {...props}
        />
    );
}

export { IconButton };
export type { IconButtonProps };
