"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { AlertCircle } from "lucide-react";

interface DeleteConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void | Promise<void>;
    isLoading?: boolean;
    title: string;
    description: string;
}

export function DeleteConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    isLoading = false,
    title,
    description,
}: DeleteConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader className="space-y-4">
                    <div className="flex flex-col items-center text-center space-y-3">
                        {/* Icon */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-black/5 rounded-full blur-xl" />
                            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-black/5 border border-black/10">
                                <AlertCircle
                                    className="w-7 h-7 text-black/70"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>

                        {/* Title */}
                        <DialogTitle className="text-[20px] font-semibold text-black tracking-[-0.02em]">
                            {title}
                        </DialogTitle>

                        {/* Description */}
                        <DialogDescription className="text-[14px] text-black/60 leading-relaxed max-w-sm">
                            {description}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="w-full sm:w-auto border-black/10 hover:bg-black/5 h-11 px-6 text-[14px] font-medium"
                    >
                        Annuler
                    </Button>
                    <PrimaryActionButton
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="w-full sm:w-auto h-11 px-6 text-[14px] font-medium"
                    >
                        {isLoading ? "Suppression..." : "Confirmer"}
                    </PrimaryActionButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
