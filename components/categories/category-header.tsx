import { Button } from "@/components/ui/button";
import { FolderTree, Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CategoryHeaderProps {
    showExamples: boolean;
    onToggleExamples: () => void;
    onCreateCategory: () => void;
    className?: string;
}

export function CategoryHeader({
    showExamples,
    onToggleExamples,
    onCreateCategory,
    className,
}: CategoryHeaderProps) {
    return (
        <div className={cn("flex items-center justify-between", className)}>
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <FolderTree className="h-8 w-8 text-primary" />
                    Organisation des catégories
                </h1>
                <p className="text-muted-foreground mt-1">
                    Créez une hiérarchie claire pour mieux ranger vos produits et
                    services
                </p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={onToggleExamples}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {showExamples ? "Masquer" : "Voir"} exemples
                </Button>
                <Button onClick={onCreateCategory}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle catégorie
                </Button>
            </div>
        </div>
    );
}
