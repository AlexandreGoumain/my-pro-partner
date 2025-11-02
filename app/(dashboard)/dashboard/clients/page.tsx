"use client";

import {
    ClientDialogs,
    ClientGridView,
    ClientInsightsSection,
    ClientSearchBar,
    ClientSegmentBanner,
    ClientStatsGrid,
} from "@/components/clients";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { useClientsPage } from "@/hooks/use-clients-page";
import { CLIENT_CSV_MAPPINGS } from "@/lib/constants/csv-mappings";
import { Plus, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTable } from "./_components/data-table";

export default function ClientsPage() {
    const router = useRouter();
    const handlers = useClientsPage();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard Clients"
                description="Vue d'ensemble et gestion de votre portefeuille clients"
                actions={
                    <>
                        <Button
                            onClick={() => handlers.setImportDialogOpen(true)}
                            variant="outline"
                            className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5"
                        >
                            <Upload className="w-4 h-4 mr-2" strokeWidth={2} />
                            Importer CSV
                        </Button>
                        <Button
                            onClick={handlers.handleCreate}
                            className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm cursor-pointer"
                        >
                            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                            Nouveau client
                        </Button>
                    </>
                }
            />

            <ClientStatsGrid
                total={handlers.intelligence.total}
                newThisMonth={handlers.intelligence.newThisMonth}
                active={handlers.intelligence.active}
                inactive={handlers.intelligence.inactive}
                onInactiveClick={() =>
                    handlers.intelligence.inactive > 0 &&
                    router.push("/dashboard/clients/segments")
                }
            />

            <ClientInsightsSection
                completionRate={handlers.intelligence.completionRate}
                completeCount={handlers.intelligence.complete}
                onSegmentsClick={() =>
                    router.push("/dashboard/clients/segments")
                }
                onStatisticsClick={() =>
                    router.push("/dashboard/clients/statistiques")
                }
                onImportExportClick={() =>
                    router.push("/dashboard/clients/import-export")
                }
            />

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
        </div>
    );
}
