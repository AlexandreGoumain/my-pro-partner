"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-state";
import {
    useCategoryCustomFields,
    useDeleteCustomField,
    useReorderCustomFields,
} from "@/hooks/use-custom-fields";
import { ChampPersonnalise, TYPE_CHAMP_INFO } from "@/lib/types/custom-fields";
import {
    AlertCircle,
    AlignLeft,
    Calendar,
    CheckSquare,
    Edit2,
    GripVertical,
    Hash,
    Link,
    List,
    ListChecks,
    Mail,
    Palette,
    Plus,
    Trash2,
    Type,
} from "lucide-react";
import { useState } from "react";
import { CustomFieldDialog } from "./custom-field-dialog";
import { Badge } from "./ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./ui/alert-dialog";

interface CustomFieldsManagerProps {
    categorieId: string;
    categorieNom: string;
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

export function CustomFieldsManager({
    categorieId,
    categorieNom,
}: CustomFieldsManagerProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingField, setEditingField] = useState<ChampPersonnalise | null>(
        null
    );
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [fieldToDelete, setFieldToDelete] = useState<ChampPersonnalise | null>(
        null
    );

    const { data: fields = [], isLoading } =
        useCategoryCustomFields(categorieId);
    const deleteMutation = useDeleteCustomField(categorieId);
    const reorderMutation = useReorderCustomFields(categorieId);

    const handleEdit = (field: ChampPersonnalise) => {
        setEditingField(field);
        setDialogOpen(true);
    };

    const handleDelete = (field: ChampPersonnalise) => {
        setFieldToDelete(field);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (fieldToDelete) {
            deleteMutation.mutate(fieldToDelete.id, {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setFieldToDelete(null);
                },
            });
        }
    };

    const handleDialogClose = (open: boolean) => {
        setDialogOpen(open);
        if (!open) {
            setEditingField(null);
        }
    };

    if (isLoading) {
        return <LoadingState showSpinner={false} minHeight="sm" className="p-8" />;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">
                        Template : {categorieNom}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Définissez les champs spécifiques pour cette catégorie
                    </p>
                </div>
                <Button onClick={() => setDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un champ
                </Button>
            </div>

            {fields.length === 0 ? (
                <Card>
                    <CardContent className="p-12">
                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                            <div className="p-4 bg-muted rounded-full">
                                <AlertCircle className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-lg">
                                    Aucun champ personnalisé
                                </h3>
                                <p className="text-sm text-muted-foreground max-w-md">
                                    Commencez par ajouter des champs pour créer
                                    un template personnalisé pour cette
                                    catégorie
                                </p>
                            </div>
                            <Button onClick={() => setDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Créer mon premier champ
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-2">
                    {fields.map((field) => {
                        const typeInfo = TYPE_CHAMP_INFO[field.type];
                        const IconComponent = iconMap[typeInfo?.icon] || Type;

                        return (
                            <Card key={field.id} className="group">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="cursor-grab text-muted-foreground hover:text-foreground">
                                            <GripVertical className="h-5 w-5" />
                                        </div>

                                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                            <IconComponent className="h-5 w-5 text-primary" />
                                        </div>

                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">
                                                    {field.nom}
                                                </span>
                                                {field.obligatoire && (
                                                    <Badge
                                                        variant="destructive"
                                                        className="h-5 text-xs"
                                                    >
                                                        Obligatoire
                                                    </Badge>
                                                )}
                                                <Badge
                                                    variant="outline"
                                                    className="h-5 text-xs"
                                                >
                                                    {typeInfo?.label}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                <code className="px-2 py-0.5 rounded bg-muted text-xs">
                                                    {field.code}
                                                </code>
                                                {field.description && (
                                                    <span>
                                                        {field.description}
                                                    </span>
                                                )}
                                            </div>
                                            {field.options &&
                                                Array.isArray(field.options) &&
                                                field.options.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {field.options.map(
                                                            (option, index) => (
                                                                <Badge
                                                                    key={index}
                                                                    variant="secondary"
                                                                    className="text-xs"
                                                                >
                                                                    {option}
                                                                </Badge>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                        </div>

                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(field)}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(field)
                                                }
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            <CustomFieldDialog
                open={dialogOpen}
                onOpenChange={handleDialogClose}
                categorieId={categorieId}
                field={editingField}
                onSuccess={() => {}}
            />

            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Confirmer la suppression
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer le champ &quot;
                            {fieldToDelete?.nom}&quot; ? Cette action est
                            irréversible et supprimera également toutes les
                            données associées dans les articles existants.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteMutation.isPending
                                ? "Suppression..."
                                : "Supprimer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
