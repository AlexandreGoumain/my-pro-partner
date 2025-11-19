"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AccountInfoFieldProps {
    label: string;
    value: string;
    id?: string;
    type?: "text" | "email";
}

/**
 * Champ d'information en lecture seule
 * Utilisé pour afficher les données du compte utilisateur
 */
export function AccountInfoField({
    label,
    value,
    id,
    type = "text",
}: AccountInfoFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-[14px] font-medium">
                {label}
            </Label>
            <Input
                id={id}
                type={type}
                value={value}
                placeholder={`Votre ${label.toLowerCase()}`}
                className="h-11 border-black/10"
                readOnly
            />
        </div>
    );
}
