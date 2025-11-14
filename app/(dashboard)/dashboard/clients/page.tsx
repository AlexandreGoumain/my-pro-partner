"use client";

import {
    ClientDialogs,
    ClientGridView,
    ClientInsightsSection,
    ClientPageActions,
    ClientSearchBar,
    ClientSegmentBanner,
    ClientStatsGrid,
} from "@/components/clients";
import { InviteClientDialog } from "@/components/invite-client-dialog";
import { PendingClientsSection } from "@/components/pending-clients-section";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { UsageLimitCard } from "@/components/ui/usage-limit-card";
import { useClientsPage } from "@/hooks/use-clients-page";
import { CLIENT_COLUMN_LABELS } from "@/lib/constants/clients";
import { CLIENT_CSV_MAPPINGS } from "@/lib/constants/csv-mappings";
import { Users as UsersIcon } from "lucide-react";
import { Suspense } from "react";

function ClientsPageContent() {
    const handlers = useClientsPage();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard Clients"
                description="Vue d'ensemble et gestion de votre portefeuille clients"
                actions={
                    <ClientPageActions
                        onImportClick={() => handlers.setImportDialogOpen(true)}
                        onCreateClick={handlers.handleCreateWithLimitCheck}
                        onInviteClick={handlers.handleInviteWithLimitCheck}
                    />
                }
            />

            <ClientStatsGrid
                total={handlers.intelligence.total}
                newThisMonth={handlers.intelligence.newThisMonth}
                active={handlers.intelligence.active}
                inactive={handlers.intelligence.inactive}
                onInactiveClick={() =>
                    handlers.intelligence.inactive > 0 &&
                    handlers.navigateToSegments()
                }
            />

            <UsageLimitCard
                userPlan={handlers.userPlan}
                limitKey="maxClients"
                currentValue={handlers.intelligence.total}
                label="Clients"
                icon={UsersIcon}
            />

            <ClientInsightsSection
                completionRate={handlers.intelligence.completionRate}
                completeCount={handlers.intelligence.complete}
                onSegmentsClick={handlers.navigateToSegments}
                onStatisticsClick={handlers.navigateToStatistics}
                onImportExportClick={handlers.navigateToImportExport}
            />

            <PendingClientsSection />

            {handlers.segmentId && handlers.segment && (
                <ClientSegmentBanner
                    segmentName={handlers.segment.nom}
                    clientCount={handlers.displayClients.length}
                    onClearFilter={handlers.clearSegmentFilter}
                />
            )}

            <ClientSearchBar
                searchTerm={handlers.searchTerm}
                onSearchChange={handlers.setSearchTerm}
                viewMode={handlers.viewMode}
                onViewModeChange={handlers.handleViewModeChange}
            />

            {handlers.viewMode === "grid" ? (
                <ClientGridView
                    clients={handlers.displayClients}
                    isLoading={handlers.isLoading}
                    searchTerm={handlers.searchTerm}
                    pagination={handlers.pagination}
                    showPagination={handlers.showPagination}
                    onView={handlers.handleView}
                    onEdit={handlers.handleEdit}
                    onDelete={handlers.handleDelete}
                    onPageChange={handlers.handlePageChange}
                    onPageSizeChange={handlers.handlePageSizeChange}
                    onCreate={handlers.handleCreate}
                />
            ) : (
                <DataTable
                    columns={handlers.columns}
                    data={handlers.displayClients}
                    emptyMessage="Aucun client trouvé"
                    pagination={
                        handlers.showPagination
                            ? handlers.pagination
                            : undefined
                    }
                    onPageChange={handlers.handlePageChange}
                    onPageSizeChange={handlers.handlePageSizeChange}
                    onRowClick={handlers.handleView}
                    itemLabel="client(s)"
                    columnLabels={CLIENT_COLUMN_LABELS}
                />
            )}

            <ClientDialogs
                createDialogOpen={handlers.createDialogOpen}
                onCreateDialogChange={handlers.setCreateDialogOpen}
                onCreateSuccess={handlers.handleCreateSuccess}
                editDialogOpen={handlers.editDialogOpen}
                onEditDialogChange={handlers.setEditDialogOpen}
                onEditSuccess={handlers.handleEditSuccess}
                deleteDialogOpen={handlers.deleteDialogOpen}
                onDeleteDialogChange={handlers.setDeleteDialogOpen}
                onDeleteConfirm={handlers.confirmDelete}
                isDeleting={handlers.isDeleting}
                importDialogOpen={handlers.importDialogOpen}
                onImportDialogChange={handlers.setImportDialogOpen}
                onImport={handlers.handleImport}
                csvMappings={CLIENT_CSV_MAPPINGS}
                selectedClient={handlers.selectedClient}
            />

            <InviteClientDialog
                open={handlers.inviteDialogOpen}
                onOpenChange={handlers.setInviteDialogOpen}
                onSuccess={handlers.handleInviteSuccess}
            />

            {/* Dialog de limite atteinte géré globalement par le LimitDialogProvider */}
        </div>
    );
}

export default function ClientsPage() {
    return (
        <Suspense
            fallback={
                <PageSkeleton
                    layout="stats"
                    headerActionsCount={2}
                    statsCount={4}
                    statsHeight="h-24"
                />
            }
        >
            <ClientsPageContent />
        </Suspense>
    );
}
