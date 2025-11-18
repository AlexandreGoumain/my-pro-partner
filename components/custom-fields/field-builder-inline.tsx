"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChampPersonnaliseCreateInput,
    TYPE_CHAMP_INFO,
    TypeChampCustom,
} from "@/lib/types/custom-fields";
import {
    AlignLeft,
    Calendar,
    CheckSquare,
    Edit2,
    GripVertical,
    Hash,
    Laptop,
    Link,
    List,
    ListChecks,
    Mail,
    Palette,
    Plus,
    Shirt,
    Smartphone,
    Sparkles,
    Trash2,
    Type,
    X,
} from "lucide-react";
import { useState } from "react";

interface FieldBuilderInlineProps {
    fields: ChampPersonnaliseCreateInput[];
    onChange: (fields: ChampPersonnaliseCreateInput[]) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Type: Type,
    AlignLeft: AlignLeft,
    Hash: Hash,
    List: List,
    ListChecks: ListChecks,
    CheckSquare: CheckSquare,
    Calendar: Calendar,
    Palette: Palette,
    Link: Link,
    Mail: Mail,
};

const FIELD_TEMPLATES = {
    smartphone: [
        {
            nom: "Marque",
            code: "marque",
            type: "TEXT" as TypeChampCustom,
            obligatoire: true,
            placeholder: "Ex: Apple, Samsung...",
        },
        {
            nom: "Modèle",
            code: "modele",
            type: "TEXT" as TypeChampCustom,
            obligatoire: true,
            placeholder: "Ex: iPhone 15 Pro",
        },
        {
            nom: "Stockage",
            code: "stockage",
            type: "SELECT" as TypeChampCustom,
            obligatoire: true,
            options: ["64GB", "128GB", "256GB", "512GB", "1TB"],
        },
        {
            nom: "Couleur",
            code: "couleur",
            type: "SELECT" as TypeChampCustom,
            obligatoire: false,
            options: ["Noir", "Blanc", "Bleu", "Rouge", "Or"],
        },
        {
            nom: "État",
            code: "etat",
            type: "SELECT" as TypeChampCustom,
            obligatoire: true,
            options: ["Neuf", "Reconditionné", "Occasion"],
        },
    ],
    ordinateur: [
        {
            nom: "Marque",
            code: "marque",
            type: "TEXT" as TypeChampCustom,
            obligatoire: true,
        },
        {
            nom: "Processeur",
            code: "processeur",
            type: "TEXT" as TypeChampCustom,
            obligatoire: true,
            placeholder: "Ex: Intel Core i7",
        },
        {
            nom: "RAM",
            code: "ram",
            type: "SELECT" as TypeChampCustom,
            obligatoire: true,
            options: ["8GB", "16GB", "32GB", "64GB"],
        },
        {
            nom: "Stockage",
            code: "stockage",
            type: "SELECT" as TypeChampCustom,
            obligatoire: true,
            options: ["256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD"],
        },
        {
            nom: "Carte graphique",
            code: "carte_graphique",
            type: "TEXT" as TypeChampCustom,
            obligatoire: false,
        },
    ],
    vetement: [
        {
            nom: "Taille",
            code: "taille",
            type: "SELECT" as TypeChampCustom,
            obligatoire: true,
            options: ["XS", "S", "M", "L", "XL", "XXL"],
        },
        {
            nom: "Couleur",
            code: "couleur",
            type: "SELECT" as TypeChampCustom,
            obligatoire: true,
            options: ["Noir", "Blanc", "Bleu", "Rouge", "Vert", "Gris"],
        },
        {
            nom: "Matière",
            code: "matiere",
            type: "TEXT" as TypeChampCustom,
            obligatoire: false,
            placeholder: "Ex: Coton, Polyester...",
        },
        {
            nom: "Saison",
            code: "saison",
            type: "SELECT" as TypeChampCustom,
            obligatoire: false,
            options: ["Printemps/Été", "Automne/Hiver", "Toute saison"],
        },
    ],
};

export function FieldBuilderInline({
    fields,
    onChange,
}: FieldBuilderInlineProps) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [showQuickAdd, setShowQuickAdd] = useState(false);

    const handleAddField = (field: Partial<ChampPersonnaliseCreateInput>) => {
        const newField: ChampPersonnaliseCreateInput = {
            nom: field.nom || "",
            code: field.code || "",
            type: field.type || "TEXT",
            ordre: fields.length,
            obligatoire: field.obligatoire || false,
            placeholder: field.placeholder,
            description: field.description,
            options: field.options,
        };
        onChange([...fields, newField]);
        setEditingIndex(fields.length);
    };

    const handleUpdateField = (
        index: number,
        updates: Partial<ChampPersonnaliseCreateInput>
    ) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], ...updates };
        onChange(newFields);
    };

    const handleRemoveField = (index: number) => {
        const newFields = fields.filter((_, i) => i !== index);
        onChange(newFields);
        setEditingIndex(null);
    };

    const handleApplyTemplate = (templateKey: keyof typeof FIELD_TEMPLATES) => {
        onChange(FIELD_TEMPLATES[templateKey]);
        setShowQuickAdd(false);
    };

    const autoGenerateCode = (nom: string) => {
        return nom
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, "_")
            .replace(/_{2,}/g, "_")
            .replace(/^_|_$/g, "");
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-semibold flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Champs personnalisés
                    </h4>
                    <p className="text-xs text-muted-foreground">
                        Définissez les informations spécifiques à cette
                        catégorie
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowQuickAdd(!showQuickAdd)}
                >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Templates
                </Button>
            </div>

            {showQuickAdd && (
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Templates prédéfinis
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="justify-start"
                                onClick={() =>
                                    handleApplyTemplate("smartphone")
                                }
                            >
                                <Smartphone className="h-4 w-4 mr-2" />
                                Smartphones
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="justify-start"
                                onClick={() =>
                                    handleApplyTemplate("ordinateur")
                                }
                            >
                                <Laptop className="h-4 w-4 mr-2" />
                                Ordinateurs
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="justify-start"
                                onClick={() => handleApplyTemplate("vetement")}
                            >
                                <Shirt className="h-4 w-4 mr-2" />
                                Vêtements
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Ces templates pré-remplissent les champs courants.
                            Vous pouvez les modifier ensuite.
                        </p>
                    </CardContent>
                </Card>
            )}

            {fields.length > 0 && (
                <div className="space-y-2">
                    {fields.map((field, index) => {
                        const isEditing = editingIndex === index;
                        const typeInfo = TYPE_CHAMP_INFO[field.type];
                        const IconComponent = iconMap[typeInfo?.icon] || Type;

                        return (
                            <Card key={index} className="group">
                                <CardContent className="p-3">
                                    <Collapsible
                                        open={isEditing}
                                        onOpenChange={(open) =>
                                            setEditingIndex(open ? index : null)
                                        }
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="cursor-grab">
                                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10">
                                                <IconComponent className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-sm">
                                                        {field.nom ||
                                                            "Nouveau champ"}
                                                    </span>
                                                    {field.obligatoire && (
                                                        <Badge
                                                            variant="destructive"
                                                            className="h-4 text-xs px-1"
                                                        >
                                                            *
                                                        </Badge>
                                                    )}
                                                    <Badge
                                                        variant="outline"
                                                        className="h-4 text-xs px-1"
                                                    >
                                                        {typeInfo?.label}
                                                    </Badge>
                                                </div>
                                                {field.code && (
                                                    <code className="text-xs text-muted-foreground">
                                                        {field.code}
                                                    </code>
                                                )}
                                            </div>
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Edit2 className="h-3 w-3" />
                                                </Button>
                                            </CollapsibleTrigger>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleRemoveField(index)
                                                }
                                            >
                                                <Trash2 className="h-3 w-3 text-destructive" />
                                            </Button>
                                        </div>

                                        <CollapsibleContent className="mt-3 space-y-3 border-t pt-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">
                                                        Nom
                                                    </Label>
                                                    <Input
                                                        value={field.nom}
                                                        onChange={(e) => {
                                                            const nom =
                                                                e.target.value;
                                                            handleUpdateField(
                                                                index,
                                                                {
                                                                    nom,
                                                                    code: autoGenerateCode(
                                                                        nom
                                                                    ),
                                                                }
                                                            );
                                                        }}
                                                        className="h-8 text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">
                                                        Type
                                                    </Label>
                                                    <Select
                                                        value={field.type}
                                                        onValueChange={(
                                                            value
                                                        ) =>
                                                            handleUpdateField(
                                                                index,
                                                                {
                                                                    type: value as TypeChampCustom,
                                                                }
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="h-8 text-sm">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Object.entries(
                                                                TYPE_CHAMP_INFO
                                                            ).map(
                                                                ([
                                                                    key,
                                                                    info,
                                                                ]) => (
                                                                    <SelectItem
                                                                        key={
                                                                            key
                                                                        }
                                                                        value={
                                                                            key
                                                                        }
                                                                    >
                                                                        {
                                                                            info.label
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            {typeInfo?.hasOptions && (
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">
                                                        Options
                                                    </Label>
                                                    <div className="flex flex-wrap gap-1">
                                                        {field.options?.map(
                                                            (option, i) => (
                                                                <Badge
                                                                    key={i}
                                                                    variant="secondary"
                                                                    className="text-xs"
                                                                >
                                                                    {option}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const newOptions =
                                                                                field.options?.filter(
                                                                                    (
                                                                                        _,
                                                                                        idx
                                                                                    ) =>
                                                                                        idx !==
                                                                                        i
                                                                                );
                                                                            handleUpdateField(
                                                                                index,
                                                                                {
                                                                                    options:
                                                                                        newOptions,
                                                                                }
                                                                            );
                                                                        }}
                                                                        className="ml-1"
                                                                    >
                                                                        <X className="h-2 w-2" />
                                                                    </button>
                                                                </Badge>
                                                            )
                                                        )}
                                                        <Input
                                                            placeholder="Ajouter..."
                                                            className="h-6 w-24 text-xs"
                                                            onKeyPress={(e) => {
                                                                if (
                                                                    e.key ===
                                                                    "Enter"
                                                                ) {
                                                                    e.preventDefault();
                                                                    const input =
                                                                        e.currentTarget;
                                                                    if (
                                                                        input.value.trim()
                                                                    ) {
                                                                        handleUpdateField(
                                                                            index,
                                                                            {
                                                                                options:
                                                                                    [
                                                                                        ...(field.options ||
                                                                                            []),
                                                                                        input.value.trim(),
                                                                                    ],
                                                                            }
                                                                        );
                                                                        input.value =
                                                                            "";
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id={`obligatoire-${index}`}
                                                    checked={field.obligatoire}
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        handleUpdateField(
                                                            index,
                                                            {
                                                                obligatoire:
                                                                    checked as boolean,
                                                            }
                                                        )
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`obligatoire-${index}`}
                                                    className="text-xs cursor-pointer"
                                                >
                                                    Champ obligatoire
                                                </Label>
                                            </div>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddField({ type: "TEXT" })}
                className="w-full"
            >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un champ
            </Button>
        </div>
    );
}
