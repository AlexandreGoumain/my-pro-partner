"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "default" | "destructive";
    isLoading?: boolean;
}

export function ConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    title = "Êtes-vous sûr ?",
    description = "Cette action est irréversible.",
    confirmLabel = "Confirmer",
    cancelLabel = "Annuler",
    variant = "destructive",
    isLoading = false,
}: ConfirmDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-[18px] font-semibold tracking-[-0.02em]">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-[14px] text-black/50">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        className="h-11 px-6 text-[14px] border-black/10"
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        disabled={isLoading}
                        className={`h-11 px-6 text-[14px] ${
                            variant === "destructive"
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-black hover:bg-black/90 text-white"
                        }`}
                    >
                        {isLoading ? "En cours..." : confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
