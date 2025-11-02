"use client";

import { BulkEmailDialog } from "@/components/bulk-email-dialog";
import { SegmentBuilderDialog } from "@/components/segment-builder-dialog";
import { SegmentComparisonDialog } from "@/components/segment-comparison-dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { EmptySegmentState } from "@/components/ui/empty-segment-state";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { SegmentCard } from "@/components/ui/segment-card";
import { SegmentSectionHeader } from "@/components/ui/segment-section-header";
import { SegmentStatsCard } from "@/components/ui/segment-stats-card";
import { useSegmentsPage } from "@/hooks/use-segments-page";
import { getSegmentIcon } from "@/lib/constants/segment-config";
import {
    BarChart3,
    Filter,
    GitCompare,
    Loader2,
    Plus,
    Star,
    Users,
} from "lucide-react";

export default function ClientSegmentsPage() {
    const {
        segments,
        isLoading,
        totalClients,
        searchQuery,
        setSearchQuery,
        predefinedSegments,
        customSegments,
        stats,
        builderDialogOpen,
        setBuilderDialogOpen,
        emailDialogOpen,
        setEmailDialogOpen,
        comparisonDialogOpen,
        setComparisonDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        selectedSegmentForEmail,
        selectedSegmentForEdit,
        setSelectedSegmentForEdit,
        seedMutation,
        deleteMutation,
        handleSeedSegments,
        handleExportSegment,
        handleDeleteSegment,
        confirmDelete,
        handleSendEmail,
        handleEditSegment,
        handleViewAnalytics,
    } = useSegmentsPage();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Segments clients"
                description="Organisez et analysez vos clients par segments"
                actions={
                    <>
                        <Button
                            variant="outline"
                            className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5"
                            onClick={() => setComparisonDialogOpen(true)}
                            disabled={segments.length < 2}
                        >
                            <GitCompare
                                className="w-4 h-4 mr-2"
                                strokeWidth={2}
                            />
                            Comparer
                        </Button>
                        <Button
                            className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm cursor-pointer"
                            onClick={() => setBuilderDialogOpen(true)}
                            title="Raccourci: Ctrl+N"
                        >
                            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                            Créer un segment
                        </Button>
                    </>
                }
            />

            <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Rechercher un segment..."
            />

            {segments.length > 0 && (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    <SegmentStatsCard
                        icon={Filter}
                        label="Total segments"
                        value={stats.totalSegments}
                    />
                    <SegmentStatsCard
                        icon={Users}
                        label="Clients total"
                        value={totalClients}
                    />
                    <SegmentStatsCard
                        icon={Star}
                        label="Segments actifs"
                        value={stats.activeSegments}
                    />
                    <SegmentStatsCard
                        icon={BarChart3}
                        label="Moyenne/segment"
                        value={stats.averageClientsPerSegment}
                    />
                </div>
            )}

            <div>
                <SegmentSectionHeader
                    title="Segments prédéfinis"
                    description="Segments créés automatiquement selon vos données clients"
                    action={
                        predefinedSegments.length === 0 && !isLoading ? (
                            <Button
                                onClick={handleSeedSegments}
                                disabled={seedMutation.isPending}
                                variant="outline"
                                className="h-10 px-5 text-[13px] font-medium border-black/10 hover:bg-black/5"
                            >
                                {seedMutation.isPending && (
                                    <Loader2
                                        className="w-4 h-4 mr-2 animate-spin"
                                        strokeWidth={2}
                                    />
                                )}
                                Créer les segments prédéfinis
                            </Button>
                        ) : undefined
                    }
                />

                {isLoading ? (
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="p-6 animate-pulse border border-black/8 shadow-sm rounded-lg bg-white"
                            >
                                <div className="h-24 bg-black/5 rounded" />
                            </div>
                        ))}
                    </div>
                ) : predefinedSegments.length === 0 ? (
                    <EmptySegmentState
                        icon={Filter}
                        title="Aucun segment prédéfini"
                        description="Créez les segments prédéfinis pour commencer à organiser vos clients."
                        buttonText="Créer les segments prédéfinis"
                        onButtonClick={handleSeedSegments}
                        isLoading={seedMutation.isPending}
                    />
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {predefinedSegments.map((segment) => {
                            const Icon = getSegmentIcon(segment.icone);
                            const percentage =
                                totalClients > 0
                                    ? ((segment.nombreClients ?? 0) /
                                          totalClients) *
                                      100
                                    : 0;

                            return (
                                <SegmentCard
                                    key={segment.id}
                                    segment={segment}
                                    icon={Icon}
                                    percentage={percentage}
                                    totalClients={totalClients}
                                    type="predefined"
                                    onExport={handleExportSegment}
                                    onSendEmail={handleSendEmail}
                                    onViewAnalytics={handleViewAnalytics}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            <div>
                <SegmentSectionHeader
                    title="Segments personnalisés"
                    description="Créez vos propres segments avec des critères personnalisés"
                />

                {customSegments.length === 0 ? (
                    <EmptySegmentState
                        icon={Filter}
                        title="Aucun segment personnalisé"
                        description="Créez des segments personnalisés en combinant plusieurs critères pour mieux cibler vos actions marketing."
                        buttonText="Créer un segment"
                        onButtonClick={() => setBuilderDialogOpen(true)}
                    />
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {customSegments.map((segment) => {
                            const Icon = getSegmentIcon(segment.icone);
                            const percentage =
                                totalClients > 0
                                    ? ((segment.nombreClients ?? 0) /
                                          totalClients) *
                                      100
                                    : 0;

                            return (
                                <SegmentCard
                                    key={segment.id}
                                    segment={segment}
                                    icon={Icon}
                                    percentage={percentage}
                                    totalClients={totalClients}
                                    type="custom"
                                    onExport={handleExportSegment}
                                    onSendEmail={handleSendEmail}
                                    onEdit={handleEditSegment}
                                    onDelete={handleDeleteSegment}
                                    onViewAnalytics={handleViewAnalytics}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Dialogs */}
            <SegmentBuilderDialog
                open={builderDialogOpen}
                onOpenChange={(open) => {
                    setBuilderDialogOpen(open);
                    if (!open) {
                        setSelectedSegmentForEdit(null);
                    }
                }}
                segment={selectedSegmentForEdit}
                onSuccess={() => {
                    // Toast is already shown in the dialog
                }}
            />

            <BulkEmailDialog
                open={emailDialogOpen}
                onOpenChange={setEmailDialogOpen}
                segment={selectedSegmentForEmail}
                clientCount={selectedSegmentForEmail?.nombreClients ?? 0}
            />

            <SegmentComparisonDialog
                open={comparisonDialogOpen}
                onOpenChange={setComparisonDialogOpen}
            />

            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent className="border-black/10">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[17px] font-semibold tracking-[-0.01em]">
                            Supprimer ce segment ?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-[14px] text-black/60">
                            Cette action est irréversible. Le segment sera
                            définitivement supprimé de votre base de données.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5">
                            Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={deleteMutation.isPending}
                            className="h-11 px-6 text-[14px] font-medium bg-red-600 hover:bg-red-700 text-white"
                        >
                            {deleteMutation.isPending ? (
                                <>
                                    <Loader2
                                        className="w-4 h-4 mr-2 animate-spin"
                                        strokeWidth={2}
                                    />
                                    Suppression...
                                </>
                            ) : (
                                "Supprimer"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
