"use client";

import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { Save } from "lucide-react";

interface SettingsSaveButtonProps {
    isSaving: boolean;
    onClick?: () => void;
}

export function SettingsSaveButton({
    isSaving,
    onClick,
}: SettingsSaveButtonProps) {
    return (
        <div className="flex justify-center mt-8">
            <PrimaryActionButton
                type="submit"
                disabled={isSaving}
                onClick={onClick}
                className="px-8 transition-all duration-200"
            >
                <Save className="w-4 h-4 mr-2" strokeWidth={2} />
                {isSaving ? "Enregistrement..." : "Enregistrer les paramètres"}
            </PrimaryActionButton>
        </div>
    );
}
