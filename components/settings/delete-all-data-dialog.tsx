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
import { Trash2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

// Constantes
const REDIRECT_DELAY_MS = 1500;
const MESSAGES = {
    CONFIRM_REQUIRED: "Veuillez cocher la case de confirmation",
    SUCCESS: "Vos données ont été supprimées avec succès",
    DEFAULT_ERROR: "Erreur lors de la suppression",
    GENERIC_ERROR: "Une erreur est survenue",
} as const;

export function DeleteAllDataDialog() {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!isConfirmed) {
            toast.error(MESSAGES.CONFIRM_REQUIRED);
            return;
        }

        setIsDeleting(true);

        try {
            const response = await fetch("/api/user/delete-all-data", {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || MESSAGES.DEFAULT_ERROR);
            }

            toast.success(MESSAGES.SUCCESS);

            // Invalider la session et rediriger après un court délai
            setTimeout(() => {
                signOut({ redirect: false }).then(() => {
                    window.location.href = "/auth/login";
                });
            }, REDIRECT_DELAY_MS);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : MESSAGES.GENERIC_ERROR
            );
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    className="border-red-200 hover:bg-red-50 text-red-700 h-10 px-4 text-[14px] font-medium"
                >
                    <Trash2 className="w-4 h-4 mr-2" strokeWidth={2} />
                    Supprimer mes données
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-900 text-[20px] font-semibold tracking-[-0.02em]">
                        Êtes-vous absolument sûr?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3 text-[14px]">
                        <p>
                            Cette action{" "}
                            <strong className="text-red-900">
                                supprimera définitivement et irrémédiablement
                            </strong>{" "}
                            TOUTES vos données:
                        </p>
                        <ul className="list-disc ml-4 space-y-1 text-[13px] text-black/60">
                            <li>Horaires et planning</li>
                            <li>Pointages (TimeEntry)</li>
                            <li>Activités enregistrées</li>
                            <li>Conversations IA</li>
                            <li>Mouvements de stock créés</li>
                            <li>Permissions et paramètres</li>
                            <li>Votre compte utilisateur</li>
                        </ul>
                        <p className="font-semibold text-red-900 mt-4 text-[14px]">
                            Cette action ne peut pas être annulée.
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-start gap-3">
                        <Checkbox
                            id="confirm-delete"
                            checked={isConfirmed}
                            onCheckedChange={(checked) =>
                                setIsConfirmed(checked as boolean)
                            }
                            className="mt-1"
                        />
                        <label
                            htmlFor="confirm-delete"
                            className="text-[13px] cursor-pointer leading-5 text-black/60"
                        >
                            Je comprends que cette action est irréversible et je
                            souhaite supprimer toutes mes données
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
                        className="bg-red-600 hover:bg-red-700 text-white h-11 px-6 text-[14px] font-medium"
                    >
                        {isDeleting ? (
                            <>
                                <Spinner className="mr-2 w-4 h-4" />
                                Suppression en cours...
                            </>
                        ) : (
                            "Supprimer définitivement"
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
