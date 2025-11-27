import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface DialogActionButtonsProps {
    /** Callback when cancel is clicked */
    onCancel: () => void;
    /** Label for cancel button */
    cancelLabel?: string;
    /** Label for submit button */
    submitLabel?: string;
    /** Label shown while loading (defaults to submitLabel + "...") */
    loadingLabel?: string;
    /** Whether an action is in progress */
    isLoading?: boolean;
    /** Whether this is an edit operation (affects default labels) */
    isEditing?: boolean;
    /** Whether to disable the submit button */
    disabled?: boolean;
    /** Button type (submit for forms, button for click handlers) */
    type?: "submit" | "button";
    /** Click handler for submit button (not needed if type="submit") */
    onSubmit?: () => void;
    /** Variant for submit button */
    variant?: "default" | "destructive";
    /** Additional className for the container */
    className?: string;
}

/**
 * DialogActionButtons - Standardized dialog footer buttons
 *
 * Provides consistent Cancel/Submit button pattern for dialogs.
 *
 * @example
 * // Simple form submit
 * <DialogActionButtons
 *   onCancel={() => onOpenChange(false)}
 *   isLoading={isPending}
 *   isEditing={!!existingItem}
 * />
 *
 * @example
 * // Custom labels
 * <DialogActionButtons
 *   onCancel={handleClose}
 *   submitLabel="Envoyer"
 *   loadingLabel="Envoi en cours..."
 *   isLoading={isSending}
 * />
 *
 * @example
 * // Destructive action
 * <DialogActionButtons
 *   onCancel={handleClose}
 *   onSubmit={handleDelete}
 *   submitLabel="Supprimer"
 *   variant="destructive"
 *   type="button"
 * />
 */
export function DialogActionButtons({
    onCancel,
    cancelLabel = "Annuler",
    submitLabel,
    loadingLabel,
    isLoading = false,
    isEditing = false,
    disabled = false,
    type = "submit",
    onSubmit,
    variant = "default",
    className,
}: DialogActionButtonsProps) {
    // Smart default labels
    const defaultSubmitLabel = isEditing ? "Enregistrer" : "Créer";
    const finalSubmitLabel = submitLabel || defaultSubmitLabel;
    const finalLoadingLabel =
        loadingLabel || `${finalSubmitLabel.replace(/er$/, "ation")}...`;

    return (
        <DialogFooter className={cn("pt-4", className)}>
            <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="h-11 px-6 text-[14px] border-black/10"
            >
                {cancelLabel}
            </Button>
            <Button
                type={type}
                onClick={type === "button" ? onSubmit : undefined}
                disabled={isLoading || disabled}
                className={cn(
                    "h-11 px-6 text-[14px]",
                    variant === "destructive"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-black hover:bg-black/90"
                )}
            >
                {isLoading ? finalLoadingLabel : finalSubmitLabel}
            </Button>
        </DialogFooter>
    );
}
