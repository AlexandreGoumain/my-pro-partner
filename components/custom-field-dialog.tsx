"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonWithSpinner } from "@/components/ui/button-with-spinner";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
    useCreateCustomField,
    useUpdateCustomField,
} from "@/hooks/use-custom-fields";
import { useFormReset } from "@/hooks/use-form-reset";
import {
    ChampPersonnalise,
    TYPE_CHAMP_INFO,
    TypeChampCustom,
} from "@/lib/types/custom-fields";
import { champPersonnaliseCreateSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    AlignLeft,
    Calendar,
    CheckSquare,
    Hash,
    Link,
    List,
    ListChecks,
    Mail,
    Palette,
    Plus,
    Type,
    X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface CustomFieldDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categorieId: string;
    field?: ChampPersonnalise | null;
    onSuccess: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Type: Type,
    AlignLeft: AlignLeft,
    Hash: Hash,
    HashIcon: Hash,
    List: List,
    ListChecks: ListChecks,
    CheckSquare: CheckSquare,
    Calendar: Calendar,
    Palette: Palette,
    Link: Link,
    Mail: Mail,
};

type FormData = z.infer<typeof champPersonnaliseCreateSchema>;

export function CustomFieldDialog({
    open,
    onOpenChange,
    categorieId,
    field,
    onSuccess,
}: CustomFieldDialogProps) {
    const isEdit = !!field;
    const [optionInput, setOptionInput] = useState("");

    const createMutation = useCreateCustomField(categorieId);
    const updateMutation = useUpdateCustomField(categorieId, field?.id || "");

    // Calculate form values from field using useMemo
    const formValues = useMemo<FormData>(() => {
        if (field) {
            return {
                nom: field.nom,
                code: field.code,
                type: field.type as TypeChampCustom,
                ordre: field.ordre,
                obligatoire: field.obligatoire,
                placeholder: field.placeholder || "",
                description: field.description || "",
                options: (field.options as string[]) || [],
            };
        }
        return {
            nom: "",
            code: "",
            type: "TEXT",
            ordre: 0,
            obligatoire: false,
            placeholder: "",
            description: "",
            options: [],
        };
    }, [field]);

    const form = useForm<FormData>({
        resolver: zodResolver(champPersonnaliseCreateSchema),
        defaultValues: formValues,
    });

    // Reset form when dialog opens using custom hook
    useFormReset(form, open, formValues);

    // Reset option input when dialog opens
    useEffect(() => {
        if (open) {
            setOptionInput("");
        }
    }, [open]);

    const selectedType = form.watch("type");
    const currentOptions = form.watch("options") || [];
    const typeInfo = TYPE_CHAMP_INFO[selectedType as TypeChampCustom];

    // Auto-générer le code à partir du nom
    const handleNomChange = (value: string) => {
        form.setValue("nom", value);
        if (!isEdit) {
            const code = value
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]/g, "_")
                .replace(/_{2,}/g, "_")
                .replace(/^_|_$/g, "");
            form.setValue("code", code);
        }
    };

    const handleAddOption = () => {
        if (optionInput.trim()) {
            const newOptions = [...currentOptions, optionInput.trim()];
            form.setValue("options", newOptions);
            setOptionInput("");
        }
    };

    const handleRemoveOption = (index: number) => {
        const newOptions = currentOptions.filter((_, i) => i !== index);
        form.setValue("options", newOptions);
    };

    function onSubmit(values: FormData) {
        const mutation = isEdit ? updateMutation : createMutation;

        mutation.mutate(values, {
            onSuccess: () => {
                onSuccess();
                onOpenChange(false);
            },
            onError: (error) => {
                form.setError("root", {
                    message:
                        error instanceof Error
                            ? error.message
                            : "Une erreur est survenue",
                });
            },
        });
    }

    const IconComponent = iconMap[typeInfo?.icon] || Type;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Modifier" : "Ajouter"} un champ personnalisé
                    </DialogTitle>
                    <DialogDescription>
                        Définissez un champ qui sera demandé lors de la création
                        d&apos;articles dans cette catégorie
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Type de champ */}
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field: formField }) => (
                                <FormItem>
                                    <FormLabel>Type de champ *</FormLabel>
                                    <Select
                                        onValueChange={formField.onChange}
                                        value={formField.value}
                                        disabled={isEdit}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.entries(
                                                TYPE_CHAMP_INFO
                                            ).map(([key, info]) => {
                                                const Icon =
                                                    iconMap[info.icon] || Type;
                                                return (
                                                    <SelectItem
                                                        key={key}
                                                        value={key}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Icon className="h-4 w-4" />
                                                            <span>
                                                                {info.label}
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                    {typeInfo && (
                                        <FormDescription>
                                            {typeInfo.description}
                                        </FormDescription>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                            {/* Nom */}
                            <FormField
                                control={form.control}
                                name="nom"
                                render={({ field: formField }) => (
                                    <FormItem>
                                        <FormLabel>Nom du champ *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: Marque, Capacité..."
                                                {...formField}
                                                onChange={(e) =>
                                                    handleNomChange(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Label affiché à l&apos;utilisateur
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Code */}
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field: formField }) => (
                                    <FormItem>
                                        <FormLabel>Code technique *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: marque, capacite"
                                                {...formField}
                                                disabled={isEdit}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Identifiant unique (a-z, 0-9, _)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Placeholder */}
                        <FormField
                            control={form.control}
                            name="placeholder"
                            render={({ field: formField }) => (
                                <FormItem>
                                    <FormLabel>Placeholder</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Texte d'aide affiché dans le champ..."
                                            {...formField}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field: formField }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Information complémentaire sur ce champ..."
                                            className="resize-none"
                                            rows={2}
                                            {...formField}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Options pour SELECT et MULTISELECT */}
                        {typeInfo?.hasOptions && (
                            <FormField
                                control={form.control}
                                name="options"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Options *</FormLabel>
                                        <Card className="p-4 space-y-3">
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Ajouter une option..."
                                                    value={optionInput}
                                                    onChange={(e) =>
                                                        setOptionInput(
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            handleAddOption();
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={handleAddOption}
                                                    size="sm"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            {currentOptions.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {currentOptions.map(
                                                        (option, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant="secondary"
                                                                className="flex items-center gap-1"
                                                            >
                                                                {option}
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleRemoveOption(
                                                                            index
                                                                        )
                                                                    }
                                                                    className="ml-1 hover:text-destructive"
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </button>
                                                            </Badge>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </Card>
                                        <FormDescription>
                                            Ajoutez les valeurs possibles pour
                                            ce champ
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Obligatoire */}
                        <FormField
                            control={form.control}
                            name="obligatoire"
                            render={({ field: formField }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={formField.value}
                                            onCheckedChange={formField.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Champ obligatoire</FormLabel>
                                        <FormDescription>
                                            L&apos;utilisateur devra remplir ce
                                            champ
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {form.formState.errors.root && (
                            <div className="text-sm text-destructive">
                                {form.formState.errors.root.message}
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Annuler
                            </Button>
                            <ButtonWithSpinner
                                type="submit"
                                isLoading={
                                    createMutation.isPending ||
                                    updateMutation.isPending
                                }
                            >
                                {isEdit ? "Modifier" : "Créer"}
                            </ButtonWithSpinner>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
