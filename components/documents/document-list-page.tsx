"use client";

import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Plus, LucideIcon } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
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
                <LoadingState variant="card" />
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
                        <PrimaryActionButton icon={Plus} onClick={onCreate}>
                            {createButtonLabel}
                        </PrimaryActionButton>
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
                    <PrimaryActionButton icon={Plus} onClick={onCreate}>
                        {createButtonLabel}
                    </PrimaryActionButton>
                }
            />

            {additionalContent}

            <DataTable
                columns={columns}
                data={documents}
                emptyMessage={emptyMessage}
                itemLabel={itemLabel}
                columnLabels={columnLabels}
            />
        </div>
    );
}
