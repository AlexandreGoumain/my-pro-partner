import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CategorieWithCount } from "@/lib/types/category";
import { FolderTree, Plus } from "lucide-react";
import { CategoryNode } from "./category-node";
import { cn } from "@/lib/utils";

type Category = CategorieWithCount;

export interface CategoryTreeViewProps {
    categories: Category[];
    isLoading: boolean;
    expandedIds: Set<string>;
    onToggleExpand: (id: string) => void;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    onCreateSubCategory: (parentId: string) => void;
    onCreateCategory: () => void;
    className?: string;
}

export function CategoryTreeView({
    categories,
    isLoading,
    expandedIds,
    onToggleExpand,
    onEdit,
    onDelete,
    onCreateSubCategory,
    onCreateCategory,
    className,
}: CategoryTreeViewProps) {
    return (
        <Card className={cn(className)}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FolderTree className="h-5 w-5" />
                    Votre organisation
                    <Badge variant="secondary" className="text-xs font-normal">
                        2 niveaux max
                    </Badge>
                </CardTitle>
                <CardDescription>
                    Cliquez sur les flèches pour déplier/replier • Survolez pour voir
                    les actions • Catégories et sous-catégories uniquement
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="h-14 bg-muted animate-pulse rounded-lg"
                            />
                        ))}
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-16">
                        <FolderTree className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">
                            Commencez votre organisation
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Créez votre première catégorie principale pour commencer à
                            organiser vos produits et services
                        </p>
                        <Button onClick={onCreateCategory} size="lg">
                            <Plus className="h-5 w-5 mr-2" />
                            Créer ma première catégorie
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {categories.map((category) => (
                            <CategoryNode
                                key={category.id}
                                category={category}
                                isExpanded={expandedIds.has(category.id)}
                                onToggleExpand={onToggleExpand}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onCreateSubCategory={onCreateSubCategory}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
