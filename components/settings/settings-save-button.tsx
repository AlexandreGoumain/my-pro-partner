"use client";

import { Button } from "@/components/ui/button";
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
            <Button
                type="submit"
                disabled={isSaving}
                onClick={onClick}
                className="h-11 px-8 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm transition-all duration-200"
            >
                <Save className="w-4 h-4 mr-2" strokeWidth={2} />
                {isSaving ? "Enregistrement..." : "Enregistrer les paramètres"}
            </Button>
        </div>
    );
}
