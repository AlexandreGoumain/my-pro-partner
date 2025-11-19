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
import { Filter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MESSAGES = {
    CONFIRM_REQUIRED: "Veuillez cocher la case de confirmation",
    SUCCESS: "Tous les segments ont été supprimés avec succès",
    DEFAULT_ERROR: "Erreur lors de la suppression",
    GENERIC_ERROR: "Une erreur est survenue",
} as const;

export function DeleteAllSegmentsDialog() {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!isConfirmed) {
            toast.error(MESSAGES.CONFIRM_REQUIRED);
            return;
        }

        setIsDeleting(true);

        try {
            const response = await fetch("/api/admin/delete-all-segments", {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || MESSAGES.DEFAULT_ERROR);
            }

            toast.success(MESSAGES.SUCCESS);
            setIsConfirmed(false);

            // Refresh the page to update the UI
            window.location.reload();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : MESSAGES.GENERIC_ERROR
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    className="border-orange-200 hover:bg-orange-50 text-orange-900 h-10 px-4 text-[14px] font-medium"
                >
                    <Filter className="w-4 h-4 mr-2" strokeWidth={2} />
                    Supprimer tous les segments
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-orange-900 text-[20px] font-semibold tracking-[-0.02em]">
                        Supprimer tous les segments ?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3 text-[14px]">
                        <p>
                            Cette action{" "}
                            <strong className="text-orange-900">
                                supprimera définitivement tous les segments
                            </strong>{" "}
                            de votre entreprise:
                        </p>
                        <ul className="list-disc ml-4 space-y-1 text-[13px] text-black/60">
                            <li>Tous les segments prédéfinis</li>
                            <li>Tous les segments personnalisés</li>
                            <li>Toutes les configurations de critères</li>
                        </ul>
                        <p className="font-semibold text-orange-900 mt-4 text-[14px]">
                            Les clients ne seront pas supprimés, uniquement les
                            segments.
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-start gap-3">
                        <Checkbox
                            id="confirm-delete-segments"
                            checked={isConfirmed}
                            onCheckedChange={(checked) =>
                                setIsConfirmed(checked as boolean)
                            }
                            className="mt-1"
                        />
                        <label
                            htmlFor="confirm-delete-segments"
                            className="text-[13px] cursor-pointer leading-5 text-black/60"
                        >
                            Je comprends que cette action supprimera tous les
                            segments de manière irréversible
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
                        className="bg-orange-600 hover:bg-orange-700 text-white h-11 px-6 text-[14px] font-medium"
                    >
                        {isDeleting ? (
                            <>
                                <Spinner className="mr-2 w-4 h-4" />
                                Suppression...
                            </>
                        ) : (
                            "Supprimer tous les segments"
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
