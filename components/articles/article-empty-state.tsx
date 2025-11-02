import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LucideIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ArticleEmptyStateProps {
    title: string;
    description: string;
    buttonText: string;
    icon: LucideIcon;
    onAction: () => void;
    typeFilter?: "TOUS" | "PRODUIT" | "SERVICE";
    hasNoDataAtAll?: boolean;
    className?: string;
}

export function ArticleEmptyState({
    title,
    description,
    buttonText,
    icon: Icon,
    onAction,
    typeFilter = "TOUS",
    hasNoDataAtAll = false,
    className,
}: ArticleEmptyStateProps) {
    const getBgClass = () => {
        if (typeFilter === "PRODUIT") return "bg-blue-100";
        if (typeFilter === "SERVICE") return "bg-purple-100";
        if (hasNoDataAtAll) return "bg-primary/10";
        return "bg-muted";
    };

    const getIconColorClass = () => {
        if (typeFilter === "PRODUIT") return "text-blue-600";
        if (typeFilter === "SERVICE") return "text-purple-600";
        if (hasNoDataAtAll) return "text-primary";
        return "text-muted-foreground";
    };

    return (
        <Card className={cn("p-12", className)}>
            <div className="flex flex-col items-center text-center space-y-4">
                <div className={cn("rounded-full p-6", getBgClass())}>
                    <Icon className={cn("w-12 h-12", getIconColorClass())} />
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-2">{title}</h3>
                    <p className="text-muted-foreground max-w-md">
                        {description}
                    </p>
                </div>
                <Button
                    onClick={onAction}
                    size={hasNoDataAtAll ? "lg" : "default"}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    {buttonText}
                </Button>
            </div>
        </Card>
    );
}
