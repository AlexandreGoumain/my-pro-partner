"use client";

import { PasswordField } from "@/components/settings/password-field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { toast } from "sonner";

interface PasswordChangeFormProps {
    onCancel: () => void;
}

// Constantes
const MIN_PASSWORD_LENGTH = 8;
const MESSAGES = {
    MIN_LENGTH: `Le nouveau mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères`,
    NO_MATCH: "Les mots de passe ne correspondent pas",
    DEFAULT_ERROR: "Erreur lors du changement de mot de passe",
    GENERIC_ERROR: "Une erreur est survenue",
    SUCCESS: "Mot de passe modifié avec succès",
} as const;

/**
 * Formulaire de changement de mot de passe
 * Gère la validation et l'envoi de la requête API
 */
export function PasswordChangeForm({ onCancel }: PasswordChangeFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Helper pour mettre à jour un champ sans répéter le spread
    const updateField = (field: keyof typeof passwordData, value: string) => {
        setPasswordData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation côté client
        if (passwordData.newPassword.length < MIN_PASSWORD_LENGTH) {
            toast.error(MESSAGES.MIN_LENGTH);
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error(MESSAGES.NO_MATCH);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/user/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(passwordData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || MESSAGES.DEFAULT_ERROR);
            }

            toast.success(MESSAGES.SUCCESS);

            // Réinitialiser et fermer
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            onCancel();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : MESSAGES.GENERIC_ERROR
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordField
                id="current_password"
                label="Mot de passe actuel"
                value={passwordData.currentPassword}
                onChange={(value) => updateField("currentPassword", value)}
                placeholder="Entrez votre mot de passe actuel"
            />

            <PasswordField
                id="new_password"
                label="Nouveau mot de passe"
                value={passwordData.newPassword}
                onChange={(value) => updateField("newPassword", value)}
                placeholder="Entrez un nouveau mot de passe"
                helpText={`Minimum ${MIN_PASSWORD_LENGTH} caractères avec lettres et chiffres`}
            />

            <PasswordField
                id="confirm_password"
                label="Confirmer le mot de passe"
                value={passwordData.confirmPassword}
                onChange={(value) => updateField("confirmPassword", value)}
                placeholder="Confirmez le nouveau mot de passe"
            />

            <div className="flex gap-3">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 bg-black px-4 text-white hover:bg-black/90"
                >
                    {isSubmitting ? (
                        <>
                            <Spinner className="mr-2 h-4 w-4" />
                            Mise à jour...
                        </>
                    ) : (
                        "Mettre à jour le mot de passe"
                    )}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={onCancel}
                    className="h-10 border-black/10 px-4 hover:bg-black/5"
                >
                    Annuler
                </Button>
            </div>
        </form>
    );
}
