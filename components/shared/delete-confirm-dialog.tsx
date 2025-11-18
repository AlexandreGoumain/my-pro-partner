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
import { ButtonWithSpinner } from "@/components/ui/button-with-spinner";
import { AlertTriangle } from "lucide-react";

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
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-destructive/10 p-2">
                            <AlertTriangle className="w-5 h-5 text-destructive" />
                        </div>
                        <DialogTitle>{title}</DialogTitle>
                    </div>
                    <DialogDescription className="pt-3">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Annuler
                    </Button>
                    <ButtonWithSpinner
                        variant="destructive"
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        Supprimer
                    </ButtonWithSpinner>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
