"use client";

import { BulkEmailDialog } from "@/components/bulk-email-dialog";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { PlanGate } from "@/components/paywall";
import { useLimitDialog } from "@/components/providers/limit-dialog-provider";
import { SegmentBuilderDialog } from "@/components/segment-builder-dialog";
import { SegmentComparisonDialog } from "@/components/segment-comparison-dialog";
import { Button } from "@/components/ui/button";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { EmptySegmentState } from "@/components/ui/empty-segment-state";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { SegmentCard } from "@/components/ui/segment-card";
import { SegmentCardSkeleton } from "@/components/ui/segment-card-skeleton";
import { SegmentSectionHeader } from "@/components/ui/segment-section-header";
import { StatisticsGrid } from "@/components/ui/statistics-grid";
import { useSegmentsPage } from "@/hooks/use-segments-page";
import { getSegmentIcon } from "@/lib/constants/segment-config";
import {
    BarChart3,
    Filter,
    GitCompare,
    Plus,
    Star,
    Users,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function ClientSegmentsPage() {
    const { userPlan } = useLimitDialog();

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
        <PlanGate
            userPlan={userPlan}
            feature="canSegmentClients"
            upgradeMessage="La segmentation clients nécessite le plan Pro. Débloquez cette fonctionnalité pour organiser et analyser vos clients par segments."
        >
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
                            <PrimaryActionButton
                                icon={Plus}
                                onClick={() => setBuilderDialogOpen(true)}
                                title="Raccourci: Ctrl+N"
                                className="cursor-pointer"
                            >
                                Créer un segment
                            </PrimaryActionButton>
                        </>
                    }
                />

                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Rechercher un segment..."
                />

                {segments.length > 0 && (
                    <StatisticsGrid
                        stats={[
                            {
                                id: "total",
                                icon: Filter,
                                label: "Total segments",
                                value: stats.totalSegments,
                                size: "sm",
                            },
                            {
                                id: "clients",
                                icon: Users,
                                label: "Clients total",
                                value: totalClients,
                                size: "sm",
                            },
                            {
                                id: "active",
                                icon: Star,
                                label: "Segments actifs",
                                value: stats.activeSegments,
                                size: "sm",
                            },
                            {
                                id: "average",
                                icon: BarChart3,
                                label: "Moyenne/segment",
                                value: stats.averageClientsPerSegment,
                                size: "sm",
                            },
                        ]}
                        columns={{ md: 2, lg: 4 }}
                        gap={5}
                    />
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
                                        <Spinner className="w-4 h-4 mr-2" />
                                    )}
                                    Créer les segments prédéfinis
                                </Button>
                            ) : undefined
                        }
                    />

                    {isLoading ? (
                        <GridSkeleton
                            itemCount={6}
                            gridColumns={{ md: 2, lg: 3 }}
                            gap={5}
                            itemSkeleton={<SegmentCardSkeleton />}
                        />
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

                <DeleteConfirmDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={confirmDelete}
                    isLoading={deleteMutation.isPending}
                    title="Supprimer ce segment ?"
                    description="Cette action est irréversible. Le segment sera définitivement supprimé de votre base de données."
                />
            </div>
        </PlanGate>
    );
}
