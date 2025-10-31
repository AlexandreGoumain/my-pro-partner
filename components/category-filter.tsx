"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCategories, type Categorie } from "@/hooks/use-categories";
import { getAllChildrenIds } from "@/lib/types/category";
import { cn } from "@/lib/utils";
import {
    ChevronDown,
    ChevronRight,
    Filter,
    Folder,
    FolderOpen,
    X,
} from "lucide-react";
import { memo, useMemo, useState } from "react";

interface CategoryFilterProps {
    selectedCategoryIds: string[];
    onSelectionChange: (categoryIds: string[]) => void;
}

export function CategoryFilter({
    selectedCategoryIds,
    onSelectionChange,
}: CategoryFilterProps) {
    const { data: categories = [], isLoading } = useCategories();
    const [open, setOpen] = useState(false);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    // Organiser les catégories racines (celles sans parent)
    const rootCategories = useMemo(
        () => categories.filter((cat) => !cat.parentId),
        [categories]
    );

    // Créer une map pour un accès rapide aux catégories
    const categoryMap = useMemo(() => {
        const map = new Map<string, Categorie>();
        categories.forEach((cat) => map.set(cat.id, cat));
        return map;
    }, [categories]);

    // Toggle expansion d'une catégorie
    const toggleExpanded = (categoryId: string) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedIds(newExpanded);
    };

    // Toggle sélection d'une catégorie
    const toggleSelection = (categoryId: string) => {
        const newSelection = new Set(selectedCategoryIds);

        if (newSelection.has(categoryId)) {
            // Décocher : retirer cette catégorie et tous ses enfants
            newSelection.delete(categoryId);
            const childIds = getAllChildrenIds(categoryId, categories);
            childIds.forEach((id) => newSelection.delete(id));
        } else {
            // Cocher : ajouter cette catégorie
            newSelection.add(categoryId);
        }

        onSelectionChange(Array.from(newSelection));
    };

    // Vérifier si une catégorie est cochée (directement ou via un parent)
    const isChecked = (categoryId: string): boolean => {
        return selectedCategoryIds.includes(categoryId);
    };

    // Vérifier si une catégorie est partiellement cochée (certains enfants cochés)
    const isIndeterminate = (categoryId: string): boolean => {
        if (isChecked(categoryId)) return false;

        const childIds = getAllChildrenIds(categoryId, categories);
        if (childIds.length === 0) return false;

        return childIds.some((id) => selectedCategoryIds.includes(id));
    };

    // Effacer toutes les sélections
    const clearAll = () => {
        onSelectionChange([]);
    };

    // Obtenir les noms des catégories sélectionnées
    const selectedCategoryNames = useMemo(() => {
        return selectedCategoryIds
            .map((id) => categoryMap.get(id)?.nom)
            .filter(Boolean) as string[];
    }, [selectedCategoryIds, categoryMap]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full sm:w-[280px] justify-between"
                >
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>
                            {selectedCategoryIds.length === 0
                                ? "Toutes les catégories"
                                : `${selectedCategoryIds.length} sélectionnée${
                                      selectedCategoryIds.length > 1 ? "s" : ""
                                  }`}
                        </span>
                    </div>
                    {selectedCategoryIds.length > 0 && (
                        <Badge
                            variant="secondary"
                            className="ml-2 h-5 px-1.5 text-xs"
                        >
                            {selectedCategoryIds.length}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-0" align="start">
                <div className="p-3 border-b">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">
                            Filtrer par catégorie
                        </h4>
                        {selectedCategoryIds.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearAll}
                                className="h-auto p-1 text-xs"
                            >
                                Tout effacer
                            </Button>
                        )}
                    </div>
                    {selectedCategoryIds.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {selectedCategoryNames.map((name, index) => (
                                <Badge
                                    key={selectedCategoryIds[index]}
                                    variant="secondary"
                                    className="text-xs"
                                >
                                    {name}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSelection(
                                                selectedCategoryIds[index]
                                            );
                                        }}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    <div className="p-2">
                        {isLoading ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                Chargement...
                            </div>
                        ) : rootCategories.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                Aucune catégorie disponible
                            </div>
                        ) : (
                            rootCategories.map((category) => (
                                <CategoryNode
                                    key={category.id}
                                    category={category}
                                    level={0}
                                    expandedIds={expandedIds}
                                    selectedIds={selectedCategoryIds}
                                    onToggleExpanded={toggleExpanded}
                                    onToggleSelection={toggleSelection}
                                    isChecked={isChecked}
                                    isIndeterminate={isIndeterminate}
                                />
                            ))
                        )}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}

interface CategoryNodeProps {
    category: Categorie;
    level: number;
    expandedIds: Set<string>;
    selectedIds: string[];
    onToggleExpanded: (id: string) => void;
    onToggleSelection: (id: string) => void;
    isChecked: (id: string) => boolean;
    isIndeterminate: (id: string) => boolean;
}

const CategoryNode = memo(function CategoryNode({
    category,
    level,
    expandedIds,
    selectedIds,
    onToggleExpanded,
    onToggleSelection,
    isChecked,
    isIndeterminate,
}: CategoryNodeProps) {
    const hasChildren = Boolean(
        category.enfants && category.enfants.length > 0
    );
    const isExpanded = expandedIds.has(category.id);
    const checked = isChecked(category.id);
    const indeterminate = isIndeterminate(category.id);

    return (
        <div>
            <div
                className={cn(
                    "flex items-center gap-2 py-2 px-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors",
                    checked && "bg-primary/5"
                )}
                style={{ paddingLeft: `${level * 20 + 8}px` }}
            >
                <div className="flex items-center gap-1 flex-1">
                    {/* Chevron pour expansion */}
                    {hasChildren ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleExpanded(category.id);
                            }}
                            className="p-0.5 hover:bg-muted rounded"
                        >
                            {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                        </button>
                    ) : (
                        <div className="w-5" />
                    )}

                    {/* Checkbox */}
                    <Checkbox
                        checked={checked}
                        onCheckedChange={() => onToggleSelection(category.id)}
                        className={cn(
                            indeterminate &&
                                "data-[state=checked]:bg-primary/50"
                        )}
                    />

                    {/* Icône de dossier */}
                    {hasChildren ? (
                        isExpanded ? (
                            <FolderOpen className="h-4 w-4 text-primary" />
                        ) : (
                            <Folder className="h-4 w-4 text-primary" />
                        )
                    ) : (
                        <Folder className="h-4 w-4 text-muted-foreground" />
                    )}

                    {/* Nom de la catégorie */}
                    <span
                        className={cn(
                            "text-sm flex-1",
                            checked && "font-medium"
                        )}
                        onClick={() => onToggleSelection(category.id)}
                    >
                        {category.nom}
                    </span>

                    {/* Badge avec nombre d'articles */}
                    {category.articles && category.articles.length > 0 && (
                        <Badge variant="outline" className="text-xs h-5 px-1.5">
                            {category.articles.length}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Sous-catégories */}
            {isExpanded && hasChildren && category.enfants && (
                <div>
                    {category.enfants.map((child) => (
                        <CategoryNode
                            key={child.id}
                            category={child}
                            level={level + 1}
                            expandedIds={expandedIds}
                            selectedIds={selectedIds}
                            onToggleExpanded={onToggleExpanded}
                            onToggleSelection={onToggleSelection}
                            isChecked={isChecked}
                            isIndeterminate={isIndeterminate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});
