"use client";

import { RachatCreateDialog } from "@/components/rachats/rachat-create-dialog";
import { RachatDetailDialog } from "@/components/rachats/rachat-detail-dialog";
import { RachatsDeleteDialog } from "@/components/rachats/rachats-delete-dialog";
import { RachatsEmptyState } from "@/components/rachats/rachats-empty-state";
import { RachatsLoadingState } from "@/components/rachats/rachats-loading-state";
import { RachatsSearchBar } from "@/components/rachats/rachats-search-bar";
import { RachatsTable } from "@/components/rachats/rachats-table";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useRachatsPage } from "@/hooks/use-rachats-page";
import { Plus } from "lucide-react";

export default function RachatsPage() {
    const handlers = useRachatsPage();

    return (
        <div className="space-y-6 p-8">
            <PageHeader
                title="Rachats"
                description="Gérez vos rachats d'articles d'occasion"
                actions={
                    <Button
                        onClick={handlers.handleCreateClick}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
                        Nouveau rachat
                    </Button>
                }
            />

            <RachatsSearchBar
                value={handlers.search}
                onChange={handlers.setSearch}
            />

            <Card className="border-black/8 shadow-sm">
                <CardHeader className="border-b border-black/8 p-6">
                    <CardTitle className="text-[18px] font-semibold text-black">
                        Liste des rachats
                    </CardTitle>
                    <CardDescription className="text-[14px] text-black/60">
                        {handlers.pagination?.total || 0} rachat(s)
                        enregistré(s)
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {handlers.isLoading ? (
                        <RachatsLoadingState />
                    ) : handlers.rachats.length > 0 ? (
                        <RachatsTable
                            rachats={handlers.rachats}
                            onView={handlers.handleView}
                            onDelete={handlers.handleDelete}
                        />
                    ) : (
                        <RachatsEmptyState />
                    )}
                </CardContent>
            </Card>

            <RachatDetailDialog
                rachatId={handlers.viewId}
                open={!!handlers.viewId}
                onOpenChange={(open) => {
                    if (!open) handlers.handleViewClose();
                }}
            />

            <RachatsDeleteDialog
                open={!!handlers.deleteId}
                onOpenChange={handlers.handleDeleteCancel}
                onConfirm={handlers.handleDeleteConfirm}
                isLoading={handlers.isDeleting}
            />

            <RachatCreateDialog
                open={handlers.createDialogOpen}
                onOpenChange={handlers.setCreateDialogOpen}
                onSuccess={handlers.handleCreateSuccess}
            />
        </div>
    );
}
