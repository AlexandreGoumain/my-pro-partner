"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { DialogHeaderSection } from "@/components/ui/dialog-header-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useClients } from "@/hooks/use-clients";
import { useCreateSegment, useUpdateSegment } from "@/hooks/use-segments";
import {
    CreateSegmentForm,
    Segment,
    SegmentCriterion,
    SegmentField,
    SegmentOperator,
} from "@/lib/types";
import { applySegmentCriteria } from "@/lib/utils/segment-filters";
import { Plus, Trash2, Users } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface SegmentBuilderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    segment?: Segment | null; // Segment to edit (null for create mode)
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

export function SegmentBuilderDialog({
    open,
    onOpenChange,
    onSuccess,
    segment,
}: SegmentBuilderDialogProps) {
    const createMutation = useCreateSegment();
    const updateMutation = useUpdateSegment();
    const { data: clients = [] } = useClients();

    const isEditMode = !!segment;

    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");
    const [conditions, setConditions] = useState<SegmentCriterion[]>([
        { field: "email", operator: "exists" },
    ]);
    const [logic, setLogic] = useState<"AND" | "OR">("AND");

    // Initialize form with segment data when in edit mode
    useEffect(() => {
        if (segment && open) {
            setNom(segment.nom);
            setDescription(segment.description || "");
            const criteriaData = segment.criteres as { conditions?: SegmentCriterion[]; logic?: "AND" | "OR" } | null | undefined;
            if (criteriaData?.conditions) {
                setConditions(criteriaData.conditions);
            }
            if (criteriaData?.logic) {
                setLogic(criteriaData.logic);
            }
        } else if (!open) {
            // Reset form when dialog closes
            setNom("");
            setDescription("");
            setConditions([{ field: "email", operator: "exists" }]);
            setLogic("AND");
        }
    }, [segment, open]);

    // Preview matching clients
    const matchingClients = useMemo(() => {
        try {
            return applySegmentCriteria(clients, { conditions, logic });
        } catch {
            return [];
        }
    }, [clients, conditions, logic]);

    const handleAddCondition = useCallback(() => {
        setConditions((prev) => [
            ...prev,
            { field: "email", operator: "exists" },
        ]);
    }, []);

    const handleRemoveCondition = useCallback((index: number) => {
        setConditions((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const handleUpdateCondition = useCallback(
        (index: number, updates: Partial<SegmentCriterion>) => {
            setConditions((prev) =>
                prev.map((cond, i) =>
                    i === index ? { ...cond, ...updates } : cond
                )
            );
        },
        []
    );

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nom.trim()) {
            toast.error("Le nom du segment est requis");
            return;
        }

        if (conditions.length === 0) {
            toast.error("Ajoutez au moins un critère");
            return;
        }

        const data: CreateSegmentForm = {
            nom,
            description: description || undefined,
            icone: segment?.icone || "Filter",
            couleur: segment?.couleur || "#f3f4f6",
            criteres: {
                conditions,
                logic,
            },
        };

        try {
            if (isEditMode && segment) {
                await updateMutation.mutateAsync({
                    id: segment.id,
                    data,
                });
                toast.success("Segment modifié avec succès");
            } else {
                await createMutation.mutateAsync(data);
                toast.success("Segment créé avec succès");
            }
            onSuccess?.();
            handleClose();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : `Erreur lors de ${isEditMode ? "la modification" : "la création"} du segment`;
            toast.error(errorMessage);
        }
    };

    const handleClose = () => {
        setNom("");
        setDescription("");
        setConditions([{ field: "email", operator: "exists" }]);
        setLogic("AND");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeaderSection
                    title={isEditMode ? "Modifier le segment" : "Créer un segment personnalisé"}
                    description="Définissez des critères pour segmenter automatiquement vos clients"
                    titleClassName="text-[20px] font-semibold tracking-[-0.01em]"
                    descriptionClassName="text-[14px] text-black/60"
                />

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div>
                            <Label
                                htmlFor="nom"
                                className="text-[14px] font-medium mb-2"
                            >
                                Nom du segment *
                            </Label>
                            <Input
                                id="nom"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
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
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
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
                                value={logic}
                                onValueChange={(v: "AND" | "OR") => setLogic(v)}
                            >
                                <SelectTrigger className="w-32 h-9 border-black/10 text-[13px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AND">
                                        ET (AND)
                                    </SelectItem>
                                    <SelectItem value="OR">OU (OR)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            {conditions.map((condition, index) => (
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
                                                        handleUpdateCondition(
                                                            index,
                                                            {
                                                                field: value,
                                                                operator:
                                                                    "exists",
                                                                value: undefined,
                                                            }
                                                        );
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
                                                        handleUpdateCondition(
                                                            index,
                                                            {
                                                                operator: value,
                                                            }
                                                        )
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
                                                            handleUpdateCondition(
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

                                        {conditions.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleRemoveCondition(index)
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
                            onClick={handleAddCondition}
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
                                        {matchingClients.length > 1
                                            ? "s"
                                            : ""}{" "}
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
                            disabled={
                                createMutation.isPending ||
                                updateMutation.isPending
                            }
                            className="h-11 px-5 text-[14px] border-black/10 hover:bg-black/5"
                        >
                            Annuler
                        </Button>
                        <PrimaryActionButton
                            type="submit"
                            disabled={
                                createMutation.isPending ||
                                updateMutation.isPending ||
                                !nom.trim()
                            }
                        >
                            {createMutation.isPending ||
                            updateMutation.isPending ? (
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
