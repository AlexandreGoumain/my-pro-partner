import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    helpText?: string;
}

/**
 * Champ de mot de passe réutilisable
 * Utilisé dans les formulaires de changement/création de mot de passe
 */
export function PasswordField({
    id,
    label,
    value,
    onChange,
    placeholder,
    helpText,
}: PasswordFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-[14px] font-medium">
                {label}
            </Label>
            <Input
                id={id}
                type="password"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="h-11 max-w-md border-black/10"
                required
            />
            {helpText && (
                <p className="text-[12px] text-black/40">{helpText}</p>
            )}
        </div>
    );
}
