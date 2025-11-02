import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CategorieWithCount } from "@/lib/types/category";
import {
    ChevronDown,
    ChevronRight,
    Edit,
    Folder,
    FolderOpen,
    GripVertical,
    Plus,
    Sparkles,
    Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Category = CategorieWithCount;

export interface CategoryNodeProps {
    category: Category;
    level?: number;
    isExpanded: boolean;
    onToggleExpand: (id: string) => void;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    onCreateSubCategory: (parentId: string) => void;
}

export function CategoryNode({
    category,
    level = 0,
    isExpanded,
    onToggleExpand,
    onEdit,
    onDelete,
    onCreateSubCategory,
}: CategoryNodeProps) {
    const router = useRouter();
    const hasChildren = category.enfants && category.enfants.length > 0;
    const articleCount = category._count?.articles || 0;

    return (
        <div className="select-none">
            <div
                className={`flex items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors group ${
                    level === 0 ? "bg-muted/30" : ""
                }`}
                style={{ marginLeft: `${level * 24}px` }}
            >
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />

                {hasChildren ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => onToggleExpand(category.id)}
                    >
                        {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </Button>
                ) : (
                    <div className="w-6" />
                )}

                <div
                    className={`flex items-center gap-2 ${
                        level === 0 ? "text-primary" : "text-muted-foreground"
                    }`}
                >
                    {isExpanded ? (
                        <FolderOpen className="h-5 w-5" />
                    ) : (
                        <Folder className="h-5 w-5" />
                    )}
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span
                            className={`font-medium ${
                                level === 0 ? "text-base" : "text-sm"
                            }`}
                        >
                            {category.nom}
                        </span>
                        {articleCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                                {articleCount}
                            </Badge>
                        )}
                        {level === 0 && hasChildren && (
                            <Badge variant="outline" className="text-xs">
                                {category.enfants?.length} sous-cat.
                            </Badge>
                        )}
                    </div>
                    {category.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {category.description}
                        </p>
                    )}
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {level === 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onCreateSubCategory(category.id)}
                            title="Créer une sous-catégorie"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(category)}
                        title="Modifier"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    {level > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                router.push(
                                    `/dashboard/articles/categories/${category.id}/template`
                                )
                            }
                            title="Gérer le template"
                        >
                            <Sparkles className="h-4 w-4 text-primary" />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(category)}
                        title="Supprimer"
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            </div>

            {isExpanded && hasChildren && (
                <div className="mt-1">
                    {category.enfants?.map((child) => (
                        <CategoryNode
                            key={child.id}
                            category={child}
                            level={level + 1}
                            isExpanded={isExpanded}
                            onToggleExpand={onToggleExpand}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onCreateSubCategory={onCreateSubCategory}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
