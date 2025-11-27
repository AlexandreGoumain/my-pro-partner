"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

export interface FormDatePickerProps<
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
     * Placeholder quand aucune date n'est sélectionnée
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
     * Classes CSS personnalisées pour le bouton trigger
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
     * Format d'affichage de la date (défaut: "d MMMM yyyy")
     */
    dateFormat?: string;

    /**
     * Date minimum sélectionnable
     */
    minDate?: Date;

    /**
     * Date maximum sélectionnable
     */
    maxDate?: Date;
}

/**
 * Composant réutilisable pour les date pickers avec react-hook-form
 * Simplifie le pattern FormField + Popover + Calendar répété dans plusieurs dialogues
 *
 * @example Utilisation basique
 * ```tsx
 * <FormDatePicker
 *     control={form.control}
 *     name="dateDebut"
 *     label="Date de début"
 *     required
 * />
 * ```
 *
 * @example Avec limites de dates
 * ```tsx
 * <FormDatePicker
 *     control={form.control}
 *     name="dateNaissance"
 *     label="Date de naissance"
 *     maxDate={new Date()}
 *     dateFormat="dd/MM/yyyy"
 * />
 * ```
 */
export function FormDatePicker<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    control,
    name,
    label,
    placeholder = "Sélectionner une date",
    description,
    disabled = false,
    required = false,
    className,
    itemClassName,
    labelClassName,
    dateFormat = "d MMMM yyyy",
    minDate,
    maxDate,
}: FormDatePickerProps<TFieldValues, TName>) {
    const [open, setOpen] = useState(false);

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
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    disabled={disabled}
                                    className={cn(
                                        "w-full justify-start h-11 border-black/10 font-normal",
                                        !field.value && "text-black/40",
                                        className
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4 text-black/40" />
                                    {field.value ? (
                                        format(field.value, dateFormat, {
                                            locale: fr,
                                        })
                                    ) : (
                                        <span>{placeholder}</span>
                                    )}
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                    field.onChange(date);
                                    setOpen(false);
                                }}
                                disabled={(date) => {
                                    if (minDate && date < minDate) return true;
                                    if (maxDate && date > maxDate) return true;
                                    return false;
                                }}
                                locale={fr}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
