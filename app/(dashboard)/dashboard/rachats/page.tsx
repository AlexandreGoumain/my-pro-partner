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
import { RouteGuard } from "@/components/ui/route-guard";
import { useRachatsPage } from "@/hooks/use-rachats-page";
import { Plus } from "lucide-react";

export default function RachatsPage() {
    const handlers = useRachatsPage();

    return (
        <RouteGuard capability="atelier">
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

                <Card className="group relative overflow-hidden border-black/[0.08] bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="relative border-b border-black/[0.08] p-6">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                            <CardTitle className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                                Liste des rachats
                            </CardTitle>
                        </div>
                        <CardDescription className="text-[13px] text-black/60 ml-3">
                            {handlers.pagination?.total || 0} rachat(s)
                            enregistré(s)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="relative p-0">
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
        </RouteGuard>
    );
}
