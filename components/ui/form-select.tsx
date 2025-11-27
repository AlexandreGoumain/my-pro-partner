import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Control, FieldPath, FieldValues } from "react-hook-form";

export interface FormSelectOption {
    value: string;
    label: string;
    description?: string;
}

export interface FormSelectProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
    /**
     * Contrôle du formulaire react-hook-form
     */
    control: Control<TFieldValues>;

    /**
     * Nom du champ dans le formulaire
     */
    name: TName;

    /**
     * Label du champ
     */
    label: string;

    /**
     * Options du select
     */
    options: FormSelectOption[];

    /**
     * Placeholder
     */
    placeholder?: string;

    /**
     * Description/aide sous le champ
     */
    description?: string;

    /**
     * Si le champ est désactivé
     */
    disabled?: boolean;

    /**
     * Si le champ est requis (ajoute * au label)
     */
    required?: boolean;

    /**
     * Classes CSS personnalisées pour le trigger
     */
    className?: string;

    /**
     * Classes CSS personnalisées pour le FormItem
     */
    itemClassName?: string;

    /**
     * Classes CSS personnalisées pour le label
     */
    labelClassName?: string;
}

/**
 * Composant réutilisable pour les selects avec react-hook-form
 * Simplifie le pattern FormField + FormItem + FormLabel + FormControl + Select + FormMessage
 *
 * @example Utilisation basique
 * ```tsx
 * <FormSelect
 *     control={form.control}
 *     name="status"
 *     label="Statut"
 *     options={[
 *         { value: "ACTIF", label: "Actif" },
 *         { value: "INACTIF", label: "Inactif" },
 *     ]}
 *     placeholder="Sélectionner un statut"
 *     required
 * />
 * ```
 *
 * @example Avec description
 * ```tsx
 * <FormSelect
 *     control={form.control}
 *     name="periodicite"
 *     label="Périodicité"
 *     options={periodiciteOptions}
 *     description="Fréquence de facturation"
 * />
 * ```
 */
export function FormSelect<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    control,
    name,
    label,
    options,
    placeholder = "Sélectionner...",
    description,
    disabled = false,
    required = false,
    className,
    itemClassName,
    labelClassName,
}: FormSelectProps<TFieldValues, TName>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={itemClassName}>
                    <FormLabel className={labelClassName}>
                        {label}
                        {required && (
                            <span className="text-destructive ml-1">*</span>
                        )}
                    </FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={disabled}
                    >
                        <FormControl>
                            <SelectTrigger
                                className={cn(
                                    "h-11 border-black/10",
                                    className
                                )}
                            >
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.description ? (
                                        <div className="flex flex-col">
                                            <span>{option.label}</span>
                                            <span className="text-[11px] text-black/40">
                                                {option.description}
                                            </span>
                                        </div>
                                    ) : (
                                        option.label
                                    )}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
