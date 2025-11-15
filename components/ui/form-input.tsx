import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

export interface FormInputProps<
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
     * Placeholder de l'input
     */
    placeholder?: string;

    /**
     * Type de l'input (text, email, password, tel, etc.)
     */
    type?: "text" | "email" | "password" | "tel" | "number" | "url" | "search";

    /**
     * Utiliser un textarea au lieu d'un input
     */
    textarea?: boolean;

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
     * Classes CSS personnalisées pour l'input
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

    /**
     * Afficher les erreurs avec le style border-destructive
     */
    showErrorBorder?: boolean;

    /**
     * Icône ou élément à afficher avant l'input
     */
    startAdornment?: ReactNode;

    /**
     * Icône ou élément à afficher après l'input
     */
    endAdornment?: ReactNode;

    /**
     * Rows pour textarea (uniquement si textarea=true)
     */
    rows?: number;

    /**
     * Autocomplete attribute
     */
    autoComplete?: string;
}

/**
 * Composant réutilisable pour les champs de formulaire avec react-hook-form
 * Simplifie le pattern FormField + FormItem + FormLabel + FormControl + Input + FormMessage
 * Répété dans 100+ occurrences
 *
 * @example Input texte basique
 * ```tsx
 * <FormInput
 *     control={form.control}
 *     name="email"
 *     label="Email"
 *     type="email"
 *     placeholder="votre@email.com"
 *     required
 * />
 * ```
 *
 * @example Input avec description
 * ```tsx
 * <FormInput
 *     control={form.control}
 *     name="password"
 *     label="Mot de passe"
 *     type="password"
 *     description="8 caractères minimum"
 *     required
 * />
 * ```
 *
 * @example Textarea
 * ```tsx
 * <FormInput
 *     control={form.control}
 *     name="description"
 *     label="Description"
 *     textarea
 *     rows={4}
 *     placeholder="Décrivez votre produit..."
 * />
 * ```
 *
 * @example Input désactivé
 * ```tsx
 * <FormInput
 *     control={form.control}
 *     name="email"
 *     label="Email"
 *     type="email"
 *     disabled={isLoading || isPreFilled}
 * />
 * ```
 *
 * @example Avec bordure d'erreur
 * ```tsx
 * <FormInput
 *     control={form.control}
 *     name="username"
 *     label="Nom d'utilisateur"
 *     showErrorBorder
 * />
 * ```
 */
export function FormInput<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    control,
    name,
    label,
    placeholder,
    type = "text",
    textarea = false,
    description,
    disabled = false,
    required = false,
    className,
    itemClassName,
    labelClassName,
    showErrorBorder = false,
    startAdornment,
    endAdornment,
    rows = 3,
    autoComplete,
}: FormInputProps<TFieldValues, TName>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <FormItem className={itemClassName}>
                    <FormLabel className={labelClassName}>
                        {label}
                        {required && <span className="text-destructive ml-1">*</span>}
                    </FormLabel>
                    <FormControl>
                        <div className="relative">
                            {startAdornment && (
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    {startAdornment}
                                </div>
                            )}
                            {textarea ? (
                                <Textarea
                                    {...field}
                                    placeholder={placeholder}
                                    disabled={disabled}
                                    rows={rows}
                                    className={cn(
                                        className,
                                        showErrorBorder &&
                                            fieldState.error &&
                                            "border-destructive",
                                        startAdornment && "pl-10",
                                        endAdornment && "pr-10"
                                    )}
                                />
                            ) : (
                                <Input
                                    {...field}
                                    type={type}
                                    placeholder={placeholder}
                                    disabled={disabled}
                                    autoComplete={autoComplete}
                                    className={cn(
                                        className,
                                        showErrorBorder &&
                                            fieldState.error &&
                                            "border-destructive",
                                        startAdornment && "pl-10",
                                        endAdornment && "pr-10"
                                    )}
                                />
                            )}
                            {endAdornment && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {endAdornment}
                                </div>
                            )}
                        </div>
                    </FormControl>
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
