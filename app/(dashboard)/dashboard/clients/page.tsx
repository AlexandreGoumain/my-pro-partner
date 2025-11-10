"use client";

import {
    ClientDialogs,
    ClientGridView,
    ClientInsightsSection,
    ClientSearchBar,
    ClientSegmentBanner,
    ClientStatsGrid,
} from "@/components/clients";
import { PendingClientsSection } from "@/components/pending-clients-section";
import { InviteClientDialog } from "@/components/invite-client-dialog";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClientsPage } from "@/hooks/use-clients-page";
import { CLIENT_CSV_MAPPINGS } from "@/lib/constants/csv-mappings";
import { Plus, Upload, ChevronDown, UserPlus, Mail } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { DataTable } from "@/components/ui/data-table";
import { LimitIndicator } from "@/components/paywall";
import { useLimitDialog } from "@/components/providers/limit-dialog-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users as UsersIcon } from "lucide-react";

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
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

    // Pricing limit check - maintenant global via provider
    const { checkLimit, userPlan } = useLimitDialog();
    const clientsCount = handlers.intelligence.total;

    // Wrapper pour vérifier la limite avant de créer
    const handleCreateWithLimitCheck = () => {
        if (!checkLimit("maxClients", clientsCount)) {
            return; // Limite atteinte - dialog s'affiche automatiquement
        }
        handlers.handleCreate();
    };

    const handleInviteWithLimitCheck = () => {
        if (!checkLimit("maxClients", clientsCount)) {
            return; // Limite atteinte - dialog s'affiche automatiquement
        }
        setInviteDialogOpen(true);
    };

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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm cursor-pointer">
                                    <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                                    Nouveau client
                                    <ChevronDown className="w-4 h-4 ml-2" strokeWidth={2} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem
                                    onClick={handleCreateWithLimitCheck}
                                    className="cursor-pointer"
                                >
                                    <UserPlus className="w-4 h-4 mr-2" strokeWidth={2} />
                                    Créer manuellement
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={handleInviteWithLimitCheck}
                                    className="cursor-pointer"
                                >
                                    <Mail className="w-4 h-4 mr-2" strokeWidth={2} />
                                    Inviter par email
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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

            {/* Indicateur de limite de plan */}
            <Card className="border-black/10">
                <CardHeader>
                    <CardTitle className="text-[16px] font-semibold text-black flex items-center gap-2">
                        <UsersIcon className="w-5 h-5 text-black/60" strokeWidth={2} />
                        Utilisation
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <LimitIndicator
                        userPlan={userPlan}
                        limitKey="maxClients"
                        currentValue={clientsCount}
                        label="Clients"
                        showProgress
                        showUpgradeLink
                    />
                </CardContent>
            </Card>

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
                open={inviteDialogOpen}
                onOpenChange={setInviteDialogOpen}
                onSuccess={() => {
                    setInviteDialogOpen(false);
                }}
            />

            {/* Dialog de limite atteinte géré globalement par le LimitDialogProvider */}
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
