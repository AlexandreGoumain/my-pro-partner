import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Label } from "./label";

interface AddressValue {
    adresse: string;
    codePostal: string;
    ville: string;
}

interface AddressInputGroupProps {
    value: AddressValue;
    onChange: (value: AddressValue) => void;
    label?: string;
    required?: boolean;
    className?: string;
    /** Compact variant with smaller inputs */
    compact?: boolean;
    /** Show as a bordered box */
    bordered?: boolean;
}

/**
 * AddressInputGroup - Reusable address input fields (adresse, code postal, ville)
 *
 * @example
 * <AddressInputGroup
 *   value={{ adresse, codePostal, ville }}
 *   onChange={({ adresse, codePostal, ville }) => {
 *     updateField("adresse", adresse);
 *     updateField("codePostal", codePostal);
 *     updateField("ville", ville);
 *   }}
 *   label="Adresse d'intervention"
 *   required
 * />
 */
function AddressInputGroup({
    value,
    onChange,
    label,
    required,
    className,
    compact = false,
    bordered = false,
}: AddressInputGroupProps) {
    const inputHeight = compact ? "h-10" : "h-11";
    const inputTextSize = compact ? "text-[13px]" : "";

    const handleChange = (field: keyof AddressValue, fieldValue: string) => {
        onChange({ ...value, [field]: fieldValue });
    };

    const content = (
        <>
            <Input
                value={value.adresse}
                onChange={(e) => handleChange("adresse", e.target.value)}
                placeholder="Adresse"
                className={cn(inputHeight, "border-black/10", inputTextSize)}
            />
            <div
                className={cn(
                    "grid gap-3",
                    compact ? "grid-cols-2 gap-2" : "grid-cols-2"
                )}
            >
                <Input
                    value={value.codePostal}
                    onChange={(e) => handleChange("codePostal", e.target.value)}
                    placeholder="Code postal"
                    maxLength={5}
                    className={cn(
                        inputHeight,
                        "border-black/10",
                        inputTextSize
                    )}
                />
                <Input
                    value={value.ville}
                    onChange={(e) => handleChange("ville", e.target.value)}
                    placeholder="Ville"
                    className={cn(
                        inputHeight,
                        "border-black/10",
                        inputTextSize
                    )}
                />
            </div>
        </>
    );

    if (bordered) {
        return (
            <div
                className={cn(
                    "space-y-3 p-3 rounded-lg bg-black/[0.02] border border-black/8",
                    className
                )}
            >
                {label && (
                    <Label className="text-[12px] font-medium text-black/60">
                        {label}
                        {required && (
                            <span className="text-red-500 ml-0.5">*</span>
                        )}
                    </Label>
                )}
                {content}
            </div>
        );
    }

    return (
        <div className={cn("space-y-3", className)}>
            {label && (
                <Label className="text-[13px] font-medium">
                    {label}
                    {required && <span className="text-red-500 ml-0.5">*</span>}
                </Label>
            )}
            {content}
        </div>
    );
}

export { AddressInputGroup };
export type { AddressInputGroupProps, AddressValue };
