import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Folder, FolderTree } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CategoryStatsGridProps {
    totalCategories: number;
    rootCategoriesCount: number;
    subCategoriesCount: number;
    className?: string;
}

export function CategoryStatsGrid({
    totalCategories,
    rootCategoriesCount,
    subCategoriesCount,
    className,
}: CategoryStatsGridProps) {
    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total catégories
                            </p>
                            <p className="text-3xl font-bold">{totalCategories}</p>
                        </div>
                        <FolderTree className="h-8 w-8 text-muted-foreground" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Catégories principales
                            </p>
                            <p className="text-3xl font-bold">{rootCategoriesCount}</p>
                        </div>
                        <Folder className="h-8 w-8 text-primary" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Sous-catégories
                            </p>
                            <p className="text-3xl font-bold">{subCategoriesCount}</p>
                        </div>
                        <ChevronRight className="h-8 w-8 text-muted-foreground" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
