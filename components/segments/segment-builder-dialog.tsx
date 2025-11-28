"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogHeaderSection } from "@/components/ui/dialog-header-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useSegmentBuilderDialog } from "@/hooks/use-segment-builder-dialog";
import { Segment, SegmentField, SegmentOperator } from "@/lib/types";
import { Plus, Trash2, Users } from "lucide-react";

interface SegmentBuilderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    segment?: Segment | null;
}

const FIELD_OPTIONS: { value: SegmentField; label: string }[] = [
    { value: "nom", label: "Nom" },
    { value: "prenom", label: "Prénom" },
    { value: "email", label: "Email" },
    { value: "telephone", label: "Téléphone" },
    { value: "ville", label: "Ville" },
    { value: "codePostal", label: "Code postal" },
    { value: "pays", label: "Pays" },
    { value: "points_solde", label: "Points fidélité" },
    { value: "createdAt", label: "Date de création" },
    { value: "updatedAt", label: "Dernière modification" },
];

const OPERATOR_OPTIONS: {
    value: SegmentOperator;
    label: string;
    types: string[];
}[] = [
    { value: "eq", label: "est égal à", types: ["string", "number"] },
    { value: "ne", label: "est différent de", types: ["string", "number"] },
    { value: "gt", label: "est supérieur à", types: ["number"] },
    { value: "gte", label: "est supérieur ou égal à", types: ["number"] },
    { value: "lt", label: "est inférieur à", types: ["number"] },
    { value: "lte", label: "est inférieur ou égal à", types: ["number"] },
    { value: "contains", label: "contient", types: ["string"] },
    { value: "startsWith", label: "commence par", types: ["string"] },
    { value: "endsWith", label: "finit par", types: ["string"] },
    { value: "exists", label: "est renseigné", types: ["string", "number"] },
    {
        value: "notExists",
        label: "n'est pas renseigné",
        types: ["string", "number"],
    },
];

const NUMBER_FIELDS: SegmentField[] = ["points_solde"];

const getFieldType = (field: SegmentField): "string" | "number" => {
    return NUMBER_FIELDS.includes(field) ? "number" : "string";
};

const getAvailableOperators = (field: SegmentField) => {
    const fieldType = getFieldType(field);
    return OPERATOR_OPTIONS.filter((op) => op.types.includes(fieldType));
};

const needsValue = (operator: SegmentOperator) => {
    return !["exists", "notExists"].includes(operator);
};

export function SegmentBuilderDialog({
    open,
    onOpenChange,
    onSuccess,
    segment,
}: SegmentBuilderDialogProps) {
    const {
        form,
        formKey,
        updateField,
        addCondition,
        removeCondition,
        updateCondition,
        clients,
        matchingClients,
        isPending,
        isEditMode,
        handleOpenChange,
        handleSubmit,
        handleClose,
    } = useSegmentBuilderDialog({
        open,
        onOpenChange,
        onSuccess,
        segment,
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeaderSection
                    title={
                        isEditMode
                            ? "Modifier le segment"
                            : "Créer un segment personnalisé"
                    }
                    description="Définissez des critères pour segmenter automatiquement vos clients"
                    titleClassName="text-[20px] font-semibold tracking-[-0.01em]"
                    descriptionClassName="text-[14px] text-black/60"
                />

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    {/* Basic Info */}
                    <div key={formKey} className="space-y-4">
                        <div>
                            <Label
                                htmlFor="nom"
                                className="text-[14px] font-medium mb-2"
                            >
                                Nom du segment *
                            </Label>
                            <Input
                                id="nom"
                                value={form.nom}
                                onChange={(e) =>
                                    updateField("nom", e.target.value)
                                }
                                placeholder="Ex: Clients VIP de Paris"
                                className="h-11 border-black/10 text-[14px]"
                            />
                        </div>

                        <div>
                            <Label
                                htmlFor="description"
                                className="text-[14px] font-medium mb-2"
                            >
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={form.description}
                                onChange={(e) =>
                                    updateField("description", e.target.value)
                                }
                                placeholder="Décrivez ce segment..."
                                className="min-h-[80px] border-black/10 text-[14px]"
                            />
                        </div>
                    </div>

                    {/* Conditions */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-[14px] font-medium">
                                Critères de filtrage *
                            </Label>
                            <Select
                                value={form.logic}
                                onValueChange={(v: "AND" | "OR") =>
                                    updateField("logic", v)
                                }
                            >
                                <SelectTrigger className="w-32 h-9 border-black/10 text-[13px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AND">ET (AND)</SelectItem>
                                    <SelectItem value="OR">OU (OR)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            {form.conditions.map((condition, index) => (
                                <Card
                                    key={index}
                                    className="p-4 border-black/10"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1 grid gap-3 md:grid-cols-3">
                                            {/* Field */}
                                            <div>
                                                <Label className="text-[13px] mb-1.5">
                                                    Champ
                                                </Label>
                                                <Select
                                                    value={condition.field}
                                                    onValueChange={(
                                                        value: SegmentField
                                                    ) => {
                                                        updateCondition(index, {
                                                            field: value,
                                                            operator: "exists",
                                                            value: undefined,
                                                        });
                                                    }}
                                                >
                                                    <SelectTrigger className="h-10 border-black/10 text-[13px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {FIELD_OPTIONS.map(
                                                            (field) => (
                                                                <SelectItem
                                                                    key={
                                                                        field.value
                                                                    }
                                                                    value={
                                                                        field.value
                                                                    }
                                                                >
                                                                    {
                                                                        field.label
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Operator */}
                                            <div>
                                                <Label className="text-[13px] mb-1.5">
                                                    Condition
                                                </Label>
                                                <Select
                                                    value={condition.operator}
                                                    onValueChange={(
                                                        value: SegmentOperator
                                                    ) =>
                                                        updateCondition(index, {
                                                            operator: value,
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger className="h-10 border-black/10 text-[13px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {getAvailableOperators(
                                                            condition.field
                                                        ).map((op) => (
                                                            <SelectItem
                                                                key={op.value}
                                                                value={op.value}
                                                            >
                                                                {op.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Value */}
                                            {needsValue(condition.operator) && (
                                                <div>
                                                    <Label className="text-[13px] mb-1.5">
                                                        Valeur
                                                    </Label>
                                                    <Input
                                                        type={
                                                            getFieldType(
                                                                condition.field
                                                            ) === "number"
                                                                ? "number"
                                                                : "text"
                                                        }
                                                        value={
                                                            condition.value?.toString() ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            updateCondition(
                                                                index,
                                                                {
                                                                    value:
                                                                        getFieldType(
                                                                            condition.field
                                                                        ) ===
                                                                        "number"
                                                                            ? Number(
                                                                                  e
                                                                                      .target
                                                                                      .value
                                                                              )
                                                                            : e
                                                                                  .target
                                                                                  .value,
                                                                }
                                                            )
                                                        }
                                                        placeholder="Valeur..."
                                                        className="h-10 border-black/10 text-[13px]"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {form.conditions.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    removeCondition(index)
                                                }
                                                className="mt-6 h-10 w-10 hover:bg-black/5"
                                            >
                                                <Trash2
                                                    className="h-4 w-4 text-black/60"
                                                    strokeWidth={2}
                                                />
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={addCondition}
                            className="w-full h-10 border-dashed border-black/20 hover:bg-black/5 text-[13px]"
                        >
                            <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
                            Ajouter un critère
                        </Button>
                    </div>

                    {/* Preview */}
                    <Card className="p-4 bg-black/2 border-black/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <Users
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                                <div>
                                    <p className="text-[14px] font-medium text-black">
                                        Aperçu du résultat
                                    </p>
                                    <p className="text-[13px] text-black/60">
                                        {matchingClients.length} client
                                        {matchingClients.length > 1 ? "s" : ""}{" "}
                                        correspondent
                                        {clients.length > 0 &&
                                            ` (${(
                                                (matchingClients.length /
                                                    clients.length) *
                                                100
                                            ).toFixed(1)}%)`}
                                    </p>
                                </div>
                            </div>
                            <Badge
                                variant="secondary"
                                className="bg-black/10 text-black/80 border-0 text-[13px]"
                            >
                                {matchingClients.length}
                            </Badge>
                        </div>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isPending}
                            className="h-11 px-5 text-[14px] border-black/10 hover:bg-black/5"
                        >
                            Annuler
                        </Button>
                        <PrimaryActionButton
                            type="submit"
                            disabled={isPending || !form.nom.trim()}
                        >
                            {isPending ? (
                                <>
                                    <Spinner className="w-4 h-4 mr-2" />
                                    {isEditMode
                                        ? "Modification..."
                                        : "Création..."}
                                </>
                            ) : isEditMode ? (
                                "Modifier le segment"
                            ) : (
                                "Créer le segment"
                            )}
                        </PrimaryActionButton>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
