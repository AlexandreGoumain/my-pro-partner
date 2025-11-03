"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Plus, LucideIcon } from "lucide-react";
import { LoadingCard } from "@/components/ui/loading-card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { ReactNode } from "react";

interface DocumentListPageProps<T> {
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
    createButtonLabel: string;
    emptyIcon: LucideIcon;
    documents: T[];
    columns: ColumnDef<T>[];
    isLoading: boolean;
    emptyMessage: string;
    itemLabel: string;
    columnLabels: Record<string, string>;
    onCreate: () => void;
    additionalContent?: ReactNode;
}

export function DocumentListPage<T>({
    title,
    description,
    emptyTitle,
    emptyDescription,
    createButtonLabel,
    emptyIcon,
    documents,
    columns,
    isLoading,
    emptyMessage,
    itemLabel,
    columnLabels,
    onCreate,
    additionalContent,
}: DocumentListPageProps<T>) {
    if (isLoading) {
        return (
            <div className="space-y-6">
                <PageHeader title={title} description={description} />
                <LoadingCard />
            </div>
        );
    }

    if (documents.length === 0 && !isLoading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title={title}
                    description={description}
                    actions={
                        <Button
                            onClick={onCreate}
                            className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm"
                        >
                            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                            {createButtonLabel}
                        </Button>
                    }
                />
                <EmptyState
                    icon={emptyIcon}
                    title={emptyTitle}
                    description={emptyDescription}
                    action={{
                        label: createButtonLabel,
                        onClick: onCreate,
                    }}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={title}
                description={description}
                actions={
                    <Button
                        onClick={onCreate}
                        className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                        {createButtonLabel}
                    </Button>
                }
            />

            <DataTable
                columns={columns}
                data={documents}
                emptyMessage={emptyMessage}
                itemLabel={itemLabel}
                columnLabels={columnLabels}
            />

            {additionalContent}
        </div>
    );
}
