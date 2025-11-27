import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

export interface FormSwitchProps<
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
     * Description/aide sous le champ
     */
    description?: string;

    /**
     * Si le champ est désactivé
     */
    disabled?: boolean;

    /**
     * Classes CSS personnalisées pour le FormItem
     */
    className?: string;

    /**
     * Classes CSS personnalisées pour le label
     */
    labelClassName?: string;

    /**
     * Icône à afficher avant le label
     */
    icon?: ReactNode;

    /**
     * Layout: "horizontal" (label à gauche, switch à droite) ou "vertical" (label au-dessus)
     */
    layout?: "horizontal" | "vertical";
}

/**
 * Composant réutilisable pour les switches avec react-hook-form
 * Simplifie le pattern FormField + Switch répété dans plusieurs dialogues
 *
 * @example Utilisation basique horizontale
 * ```tsx
 * <FormSwitch
 *     control={form.control}
 *     name="actif"
 *     label="Actif"
 * />
 * ```
 *
 * @example Avec icône
 * ```tsx
 * <FormSwitch
 *     control={form.control}
 *     name="accesIllimite"
 *     label="Accès illimité"
 *     icon={<Infinity className="w-4 h-4" />}
 * />
 * ```
 *
 * @example Avec description
 * ```tsx
 * <FormSwitch
 *     control={form.control}
 *     name="premium"
 *     label="Accès zones premium"
 *     description="Inclut sauna, spa et espaces VIP"
 * />
 * ```
 */
export function FormSwitch<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    control,
    name,
    label,
    description,
    disabled = false,
    className,
    labelClassName,
    icon,
    layout = "horizontal",
}: FormSwitchProps<TFieldValues, TName>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem
                    className={cn(
                        layout === "horizontal" &&
                            "flex items-center justify-between",
                        className
                    )}
                >
                    <div
                        className={cn(layout === "horizontal" && "space-y-0.5")}
                    >
                        <FormLabel
                            className={cn(
                                "flex items-center gap-2 text-[13px]",
                                layout === "horizontal" && "cursor-pointer",
                                labelClassName
                            )}
                        >
                            {icon}
                            {label}
                        </FormLabel>
                        {description && (
                            <FormDescription className="text-[12px]">
                                {description}
                            </FormDescription>
                        )}
                    </div>
                    <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={disabled}
                        />
                    </FormControl>
                </FormItem>
            )}
        />
    );
}
