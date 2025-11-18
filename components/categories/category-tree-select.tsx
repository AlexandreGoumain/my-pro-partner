"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
    Check,
    ChevronDown,
    ChevronRight,
    Folder,
    FolderOpen,
    FolderTree,
    Tag,
} from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Category {
    id: string;
    nom: string;
    parentId: string | null;
    enfants?: Category[];
}

interface CategoryTreeSelectProps {
    categories: Category[];
    value: string;
    onValueChange: (value: string) => void;
    disabled?: boolean;
}

interface CategoryItemProps {
    category: Category;
    selectedId: string;
    onSelect: (id: string) => void;
    level: number;
    expandedIds: Set<string>;
    onToggleExpand: (id: string) => void;
    searchValue: string;
}

function buildTree(categories: Category[]): Category[] {
    const map = new Map<string, Category>();
    const roots: Category[] = [];

    // Créer une copie de chaque catégorie avec un tableau enfants vide
    categories.forEach((cat) => {
        map.set(cat.id, { ...cat, enfants: [] });
    });

    // Construire l'arbre
    categories.forEach((cat) => {
        const node = map.get(cat.id)!;
        if (cat.parentId) {
            const parent = map.get(cat.parentId);
            if (parent) {
                parent.enfants!.push(node);
            }
        } else {
            roots.push(node);
        }
    });

    return roots;
}

function CategoryItem({
    category,
    selectedId,
    onSelect,
    level,
    expandedIds,
    onToggleExpand,
    searchValue,
}: CategoryItemProps) {
    const hasChildren = category.enfants && category.enfants.length > 0;
    const isExpanded = expandedIds.has(category.id);
    const isSelected = selectedId === category.id;

    // Filtrage par recherche
    const matchesSearch =
        searchValue === "" ||
        category.nom.toLowerCase().includes(searchValue.toLowerCase());

    const childrenMatch =
        category.enfants?.some((child) =>
            child.nom.toLowerCase().includes(searchValue.toLowerCase())
        ) || false;

    if (!matchesSearch && !childrenMatch && searchValue !== "") {
        return null;
    }

    return (
        <div>
            <CommandItem
                value={category.id}
                onSelect={() => onSelect(category.id)}
                className={cn(
                    "flex items-center gap-2 cursor-pointer rounded-md transition-all",
                    isSelected &&
                        "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                )}
                style={{ paddingLeft: `${level * 16 + 8}px` }}
            >
                {hasChildren ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 hover:bg-transparent"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleExpand(category.id);
                        }}
                    >
                        {isExpanded ? (
                            <ChevronDown className="h-3 w-3 text-muted-foreground" />
                        ) : (
                            <ChevronRight className="h-3 w-3 text-muted-foreground" />
                        )}
                    </Button>
                ) : (
                    <div className="w-5" />
                )}

                {hasChildren ? (
                    isExpanded ? (
                        <FolderOpen className="h-4 w-4 text-amber-500" />
                    ) : (
                        <Folder className="h-4 w-4 text-amber-500" />
                    )
                ) : (
                    <Tag className="h-4 w-4 text-blue-500" />
                )}

                <span className="flex-1">{category.nom}</span>

                {isSelected && <Check className="h-4 w-4 text-primary" />}

                {hasChildren && (
                    <Badge
                        variant="secondary"
                        className="h-5 px-1.5 text-xs font-normal"
                    >
                        {category.enfants!.length}
                    </Badge>
                )}
            </CommandItem>

            {hasChildren && isExpanded && (
                <div className="animate-in slide-in-from-top-1 duration-200">
                    {category.enfants!.map((child) => (
                        <CategoryItem
                            key={child.id}
                            category={child}
                            selectedId={selectedId}
                            onSelect={onSelect}
                            level={level + 1}
                            expandedIds={expandedIds}
                            onToggleExpand={onToggleExpand}
                            searchValue={searchValue}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function CategoryTreeSelect({
    categories,
    value,
    onValueChange,
    disabled = false,
}: CategoryTreeSelectProps) {
    const [open, setOpen] = useState(false);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [searchValue, setSearchValue] = useState("");

    const tree = buildTree(categories);

    const selectedCategory = categories.find((cat) => cat.id === value);

    // Fonction pour construire le chemin complet de la catégorie
    const getCategoryPath = (categoryId: string): string => {
        const category = categories.find((c) => c.id === categoryId);
        if (!category) return "";

        const path: string[] = [category.nom];
        let currentCategory = category;

        // Remonter la hiérarchie jusqu'à la racine
        while (currentCategory.parentId) {
            const parent = categories.find((c) => c.id === currentCategory.parentId);
            if (!parent) break;
            path.unshift(parent.nom);
            currentCategory = parent;
        }

        return path.join(" → ");
    };

    const handleToggleExpand = (id: string) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedIds(newExpanded);
    };

    const handleExpandAll = () => {
        const allIds = new Set(
            categories
                .filter((cat) => cat.enfants && cat.enfants.length > 0)
                .map((cat) => cat.id)
        );
        setExpandedIds(allIds);
    };

    const handleCollapseAll = () => {
        setExpandedIds(new Set());
    };

    const handleSelect = (categoryId: string) => {
        onValueChange(categoryId);
        setOpen(false);
        setSearchValue("");
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between font-normal",
                        !value && "text-muted-foreground"
                    )}
                    disabled={disabled}
                >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        {selectedCategory ? (
                            <>
                                <FolderTree className="h-4 w-4 text-amber-500 shrink-0" />
                                <span className="truncate">{getCategoryPath(value)}</span>
                            </>
                        ) : (
                            <>
                                <FolderTree className="h-4 w-4" />
                                <span>Sélectionner une catégorie</span>
                            </>
                        )}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                    <div className="flex items-center border-b px-3">
                        <CommandInput
                            placeholder="Rechercher une catégorie..."
                            value={searchValue}
                            onValueChange={setSearchValue}
                            className="flex-1"
                        />
                    </div>

                    {tree.length > 0 && (
                        <div className="flex items-center justify-end gap-2 border-b px-3 py-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleExpandAll}
                                className="h-7 text-xs"
                            >
                                Tout déplier
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCollapseAll}
                                className="h-7 text-xs"
                            >
                                Tout replier
                            </Button>
                        </div>
                    )}

                    <CommandEmpty>Aucune catégorie trouvée.</CommandEmpty>
                    <CommandGroup>
                        <ScrollArea className="h-[300px]">
                            {tree.map((category) => (
                                <CategoryItem
                                    key={category.id}
                                    category={category}
                                    selectedId={value}
                                    onSelect={handleSelect}
                                    level={0}
                                    expandedIds={expandedIds}
                                    onToggleExpand={handleToggleExpand}
                                    searchValue={searchValue}
                                />
                            ))}
                        </ScrollArea>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
