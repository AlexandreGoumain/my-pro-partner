import { ArticleCard } from "@/components/articles/article-card";
import { ArticleCardSkeleton } from "@/components/skeletons";
import { EmptyState } from "@/components/ui/empty-state";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { GridPagination } from "@/components/ui/grid-pagination";
import { type Article, type ArticleTypeFilter } from "@/lib/types/article";
import { cn } from "@/lib/utils";
import { LucideIcon, Plus } from "lucide-react";
import type { PaginationInfo } from "@/components/ui/data-table/pagination";

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
    pagination?: PaginationInfo;
    showPagination?: boolean;
    onView: (article: Article) => void;
    onEdit: (article: Article) => void;
    onDuplicate: (article: Article) => void;
    onDelete: (article: Article) => void;
    onCreateClick: () => void;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    className?: string;
}

export function ArticleGridView({
    articles,
    isLoading,
    emptyState,
    pagination,
    showPagination = false,
    onView,
    onEdit,
    onDuplicate,
    onDelete,
    onCreateClick,
    onPageChange,
    onPageSizeChange,
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
        <>
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
            {showPagination && pagination && onPageChange && onPageSizeChange && (
                <GridPagination
                    pagination={pagination}
                    onPageChange={onPageChange}
                    onPageSizeChange={onPageSizeChange}
                    itemLabel="article(s)"
                />
            )}
        </>
    );
}
