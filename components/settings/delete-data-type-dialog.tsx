"use client";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { LucideIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteDataTypeDialogProps {
    type: string;
    title: string;
    description: string;
    buttonLabel: string;
    confirmMessage: string;
    icon: LucideIcon;
    apiEndpoint: string;
    onSuccess?: () => void;
    color?: "orange" | "red" | "yellow";
}

const MESSAGES = {
    CONFIRM_REQUIRED: "Veuillez cocher la case de confirmation",
    DEFAULT_ERROR: "Erreur lors de la suppression",
    GENERIC_ERROR: "Une erreur est survenue",
} as const;

const colorClasses = {
    orange: {
        button: "border-orange-200 hover:bg-orange-50 text-orange-900",
        title: "text-orange-900",
        actionButton: "bg-orange-600 hover:bg-orange-700",
    },
    red: {
        button: "border-red-200 hover:bg-red-50 text-red-700",
        title: "text-red-900",
        actionButton: "bg-red-600 hover:bg-red-700",
    },
    yellow: {
        button: "border-yellow-200 hover:bg-yellow-50 text-yellow-900",
        title: "text-yellow-900",
        actionButton: "bg-yellow-600 hover:bg-yellow-700",
    },
};

export function DeleteDataTypeDialog({
    title,
    description,
    buttonLabel,
    confirmMessage,
    icon: Icon,
    apiEndpoint,
    onSuccess,
    color = "orange",
}: DeleteDataTypeDialogProps) {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const colors = colorClasses[color];

    const handleDelete = async () => {
        if (!isConfirmed) {
            toast.error(MESSAGES.CONFIRM_REQUIRED);
            return;
        }

        setIsDeleting(true);

        try {
            const response = await fetch(apiEndpoint, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || MESSAGES.DEFAULT_ERROR);
            }

            const result = await response.json();
            toast.success(result.message || "Suppression réussie");

            setIsOpen(false);
            setIsConfirmed(false);

            if (onSuccess) {
                onSuccess();
            } else {
                // Refresh the page to update the UI
                setTimeout(() => window.location.reload(), 500);
            }
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : MESSAGES.GENERIC_ERROR
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    className={`${colors.button} h-9 px-4 text-[13px] font-medium`}
                >
                    <Icon className="w-4 h-4 mr-2" strokeWidth={2} />
                    {buttonLabel}
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle className={`${colors.title} text-[20px] font-semibold tracking-[-0.02em]`}>
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3 text-[14px]">
                        <p>{description}</p>
                        <p className="font-semibold text-black/80 mt-4 text-[14px]">
                            Cette action ne peut pas être annulée.
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-start gap-3">
                        <Checkbox
                            id={`confirm-delete-${apiEndpoint}`}
                            checked={isConfirmed}
                            onCheckedChange={(checked) =>
                                setIsConfirmed(checked as boolean)
                            }
                            className="mt-1"
                        />
                        <label
                            htmlFor={`confirm-delete-${apiEndpoint}`}
                            className="text-[13px] cursor-pointer leading-5 text-black/60"
                        >
                            {confirmMessage}
                        </label>
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel className="h-11 px-6 text-[14px] font-medium">
                        Annuler
                    </AlertDialogCancel>
                    <Button
                        onClick={handleDelete}
                        disabled={!isConfirmed || isDeleting}
                        className={`${colors.actionButton} text-white h-11 px-6 text-[14px] font-medium`}
                    >
                        {isDeleting ? (
                            <>
                                <Spinner className="mr-2 w-4 h-4" />
                                Suppression...
                            </>
                        ) : (
                            "Supprimer"
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
