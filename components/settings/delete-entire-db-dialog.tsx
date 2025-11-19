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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Database } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

const REDIRECT_DELAY_MS = 1500;
const CONFIRMATION_TEXT = "DELETE EVERYTHING";
const MESSAGES = {
    CONFIRM_REQUIRED: "Veuillez cocher la case et taper le texte de confirmation",
    SUCCESS: "Toute la base de données a été supprimée avec succès",
    DEFAULT_ERROR: "Erreur lors de la suppression",
    GENERIC_ERROR: "Une erreur est survenue",
} as const;

export function DeleteEntireDbDialog() {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [confirmationText, setConfirmationText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!isConfirmed || confirmationText !== CONFIRMATION_TEXT) {
            toast.error(MESSAGES.CONFIRM_REQUIRED);
            return;
        }

        setIsDeleting(true);

        try {
            const response = await fetch("/api/admin/delete-entire-db", {
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
                    className="border-red-300 hover:bg-red-100 text-red-900 h-10 px-4 text-[14px] font-semibold"
                >
                    <Database className="w-4 h-4 mr-2" strokeWidth={2} />
                    Supprimer toute la DB
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-900 text-[20px] font-semibold tracking-[-0.02em]">
                        ⚠️ DANGER EXTRÊME ⚠️
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3 text-[14px]">
                        <p className="font-bold text-red-900 text-[15px]">
                            Cette action supprimera TOUTE LA BASE DE DONNÉES:
                        </p>
                        <ul className="list-disc ml-4 space-y-1 text-[13px] text-black/60">
                            <li>Toutes les entreprises</li>
                            <li>Tous les utilisateurs</li>
                            <li>Tous les clients</li>
                            <li>Tous les articles et produits</li>
                            <li>Tous les fournisseurs</li>
                            <li>Tous les segments</li>
                            <li>Toutes les factures et devis</li>
                            <li>Tous les stocks</li>
                            <li>Tous les horaires et pointages</li>
                            <li>Toutes les conversations IA</li>
                            <li>ABSOLUMENT TOUT</li>
                        </ul>
                        <p className="font-bold text-red-900 mt-4 text-[15px] bg-red-100 p-2 rounded">
                            ⛔ CETTE ACTION NE PEUT PAS ÊTRE ANNULÉE ⛔
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-start gap-3">
                        <Checkbox
                            id="confirm-delete-db"
                            checked={isConfirmed}
                            onCheckedChange={(checked) =>
                                setIsConfirmed(checked as boolean)
                            }
                            className="mt-1"
                        />
                        <label
                            htmlFor="confirm-delete-db"
                            className="text-[13px] cursor-pointer leading-5 text-black/60"
                        >
                            Je comprends que cette action supprimera TOUTES les
                            données de TOUTES les entreprises et utilisateurs de
                            manière IRRÉVERSIBLE
                        </label>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmation-text" className="text-[14px]">
                            Tapez{" "}
                            <code className="bg-red-100 text-red-900 px-2 py-1 rounded font-mono text-[13px]">
                                {CONFIRMATION_TEXT}
                            </code>{" "}
                            pour confirmer
                        </Label>
                        <Input
                            id="confirmation-text"
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                            placeholder={CONFIRMATION_TEXT}
                            className="h-10 font-mono"
                        />
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel className="h-11 px-6 text-[14px] font-medium">
                        Annuler
                    </AlertDialogCancel>
                    <Button
                        onClick={handleDelete}
                        disabled={
                            !isConfirmed ||
                            confirmationText !== CONFIRMATION_TEXT ||
                            isDeleting
                        }
                        className="bg-red-700 hover:bg-red-800 text-white h-11 px-6 text-[14px] font-semibold"
                    >
                        {isDeleting ? (
                            <>
                                <Spinner className="mr-2 w-4 h-4" />
                                Suppression...
                            </>
                        ) : (
                            "💣 SUPPRIMER TOUT 💣"
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
