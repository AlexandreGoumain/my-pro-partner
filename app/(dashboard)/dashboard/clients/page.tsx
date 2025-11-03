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
import { Suspense } from "react";
import { DataTable } from "@/components/ui/data-table";

const CLIENT_COLUMN_LABELS: Record<string, string> = {
    nom: "Client",
    telephone: "Téléphone",
    ville: "Localisation",
    pays: "Pays",
    createdAt: "Créé le",
    actions: "Actions",
};

function ClientsPageContent() {
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
        </div>
    );
}

function ClientsPageFallback() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="h-9 w-48 bg-black/5 rounded-md animate-pulse" />
                    <div className="h-5 w-96 bg-black/5 rounded-md animate-pulse" />
                </div>
                <div className="flex gap-3">
                    <div className="h-11 w-36 bg-black/5 rounded-md animate-pulse" />
                    <div className="h-11 w-36 bg-black/5 rounded-md animate-pulse" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="h-24 bg-black/5 rounded-lg animate-pulse"
                    />
                ))}
            </div>
        </div>
    );
}

export default function ClientsPage() {
    return (
        <Suspense fallback={<ClientsPageFallback />}>
            <ClientsPageContent />
        </Suspense>
    );
}
