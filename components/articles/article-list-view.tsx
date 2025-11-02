import { TableSkeleton } from "@/components/skeletons";
import { DataTable } from "@/app/(dashboard)/dashboard/articles/_components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Article } from "@/app/(dashboard)/dashboard/articles/_components/data-table/columns";
import { cn } from "@/lib/utils";

export interface ArticleListViewProps {
    articles: Article[];
    columns: ColumnDef<Article>[];
    isLoading: boolean;
    emptyMessage: string;
    className?: string;
}

export function ArticleListView({
    articles,
    columns,
    isLoading,
    emptyMessage,
    className,
}: ArticleListViewProps) {
    if (isLoading) {
        return <TableSkeleton rows={8} columns={6} className={className} />;
    }

    return (
        <DataTable
            columns={columns}
            data={articles}
            emptyMessage={emptyMessage}
            className={className}
        />
    );
}
