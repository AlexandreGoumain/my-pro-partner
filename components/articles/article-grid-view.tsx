import { ArticleCard } from "@/components/article-card";
import { ArticleCardSkeleton } from "@/components/skeletons";
import { EmptyState } from "@/components/ui/empty-state";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { cn } from "@/lib/utils";
import { Article } from "@/app/(dashboard)/dashboard/articles/_components/data-table/columns";
import { type ArticleTypeFilter } from "@/lib/types/article";
import { LucideIcon, Plus } from "lucide-react";

export interface ArticleGridViewProps {
    articles: Article[];
    isLoading: boolean;
    emptyState: {
        title: string;
        description: string;
        buttonText: string;
        icon: LucideIcon;
    };
    typeFilter: ArticleTypeFilter;
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
            <GridSkeleton
                itemCount={8}
                gridColumns={{ md: 2, lg: 3, xl: 4 }}
                gap={6}
                itemSkeleton={<ArticleCardSkeleton />}
                className={className}
            />
        );
    }

    if (articles.length === 0) {
        return (
            <EmptyState
                icon={emptyState.icon}
                title={emptyState.title}
                description={emptyState.description}
                action={{
                    label: emptyState.buttonText,
                    onClick: onCreateClick,
                    icon: Plus,
                }}
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
