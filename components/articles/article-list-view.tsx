import { DataTable } from "@/components/ui/data-table";
import { type Article } from "@/lib/types/article";
import { ColumnDef } from "@tanstack/react-table";
import type { PaginationInfo } from "@/components/ui/data-table/pagination";

const ARTICLE_COLUMN_LABELS: Record<string, string> = {
    nom: "Article",
    reference: "Référence",
    categorie: "Catégorie",
    prix: "Prix",
    stock: "Stock",
    statut: "Statut",
    actions: "Actions",
};

export interface ArticleListViewProps {
    articles: Article[];
    columns: ColumnDef<Article>[];
    isLoading: boolean;
    emptyMessage: string;
    pagination?: PaginationInfo;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    className?: string;
}

export function ArticleListView({
    articles,
    columns,
    isLoading,
    emptyMessage,
    pagination,
    onPageChange,
    onPageSizeChange,
}: ArticleListViewProps) {
    if (isLoading) {
        // Loading state is handled by DataTable
    }

    return (
        <DataTable
            columns={columns}
            data={articles}
            emptyMessage={emptyMessage}
            itemLabel="article(s)"
            columnLabels={ARTICLE_COLUMN_LABELS}
            pagination={pagination}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
        />
    );
}
