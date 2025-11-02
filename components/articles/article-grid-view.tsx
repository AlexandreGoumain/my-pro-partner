import { ArticleCard } from "@/components/article-card";
import { ArticleCardSkeleton } from "@/components/skeletons";
import { ArticleEmptyState } from "./article-empty-state";
import { cn } from "@/lib/utils";
import { Article } from "@/app/(dashboard)/dashboard/articles/_components/data-table/columns";
import { LucideIcon } from "lucide-react";

export interface ArticleGridViewProps {
    articles: Article[];
    isLoading: boolean;
    emptyState: {
        title: string;
        description: string;
        buttonText: string;
        icon: LucideIcon;
    };
    typeFilter: "TOUS" | "PRODUIT" | "SERVICE";
    hasNoDataAtAll: boolean;
    onView: (article: Article) => void;
    onEdit: (article: Article) => void;
    onDuplicate: (article: Article) => void;
    onDelete: (article: Article) => void;
    onCreateClick: () => void;
    className?: string;
}

export function ArticleGridView({
    articles,
    isLoading,
    emptyState,
    typeFilter,
    hasNoDataAtAll,
    onView,
    onEdit,
    onDuplicate,
    onDelete,
    onCreateClick,
    className,
}: ArticleGridViewProps) {
    if (isLoading) {
        return (
            <div
                className={cn(
                    "grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                    className
                )}
            >
                {Array.from({ length: 8 }).map((_, i) => (
                    <ArticleCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <ArticleEmptyState
                title={emptyState.title}
                description={emptyState.description}
                buttonText={emptyState.buttonText}
                icon={emptyState.icon}
                onAction={onCreateClick}
                typeFilter={typeFilter}
                hasNoDataAtAll={hasNoDataAtAll}
                className={className}
            />
        );
    }

    return (
        <div
            className={cn(
                "grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                className
            )}
        >
            {articles.map((article) => (
                <ArticleCard
                    key={article.id}
                    article={article}
                    onView={onView}
                    onEdit={onEdit}
                    onDuplicate={onDuplicate}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
