"use client";

import { TableCard } from "@/components/tables/table-card";
import { TableDialog } from "@/components/tables/table-dialog";
import { TableStatsGrid } from "@/components/tables/table-stats-grid";
import { CardSection } from "@/components/ui/card-section";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/ui/filter-bar";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { RouteGuard } from "@/components/ui/route-guard";
import { SuspensePage } from "@/components/ui/suspense-page";
import { useTablesPage } from "@/hooks/use-tables-page";
import { TableStatus } from "@/lib/types/table.types";
import { Plus } from "lucide-react";

function TablesContent() {
    const {
        searchTerm,
        setSearchTerm,
        zoneFilter,
        setZoneFilter,
        statusFilter,
        setStatusFilter,
        tables,
        isLoading,
        stats,
        handleCreate,
        handleTableClick,
        availableZones,
        createDialogOpen,
        setCreateDialogOpen,
        editDialogOpen,
        setEditDialogOpen,
        selectedTable,
        handleCreateSuccess,
        handleEditSuccess,
    } = useTablesPage();

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Gestion des tables"
                description="Plan de salle et gestion des tables en temps réel"
                actions={
                    <PrimaryActionButton icon={Plus} onClick={handleCreate}>
                        Ajouter une table
                    </PrimaryActionButton>
                }
            />

            {/* Statistics */}
            <TableStatsGrid
                total={stats.total}
                libres={stats.libres}
                occupees={stats.occupees}
                reservees={stats.reservees}
            />

            {/* Filters */}
            <FilterBar
                filters={[
                    {
                        type: "search",
                        value: searchTerm,
                        onChange: setSearchTerm,
                        placeholder: "Rechercher une table...",
                        className: "max-w-md",
                    },
                    {
                        type: "select",
                        value: zoneFilter,
                        onChange: (value) => setZoneFilter(value as typeof zoneFilter),
                        placeholder: "Zone",
                        options: [
                            { value: "all", label: "Toutes les zones" },
                            ...availableZones.map((zone) => ({
                                value: zone,
                                label: zone,
                            })),
                        ],
                    },
                    {
                        type: "select",
                        value: statusFilter,
                        onChange: (value) => setStatusFilter(value as typeof statusFilter),
                        placeholder: "Statut",
                        options: [
                            { value: "all", label: "Tous les statuts" },
                            { value: TableStatus.LIBRE, label: "Libre" },
                            { value: TableStatus.OCCUPEE, label: "Occupée" },
                            { value: TableStatus.RESERVEE, label: "Réservée" },
                        ],
                    },
                ]}
            />

            {/* Tables Grid */}
            <CardSection
                title="Plan de salle"
                className="border-black/8 shadow-sm"
                titleClassName="text-[20px] tracking-[-0.02em]"
            >
                {isLoading ? (
                    <GridSkeleton
                        itemCount={8}
                        gridColumns={{ md: 3, lg: 4 }}
                        gap={4}
                        itemHeight="h-[200px]"
                    />
                ) : tables.length === 0 ? (
                    <EmptyState
                        title="Aucune table trouvée"
                        variant="inline"
                    />
                ) : (
                    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {tables.map((table) => (
                            <TableCard
                                key={table.id}
                                table={table}
                                onClick={handleTableClick}
                            />
                        ))}
                    </div>
                )}
            </CardSection>

            {/* Create Dialog */}
            <TableDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSuccess={handleCreateSuccess}
            />

            {/* Edit Dialog */}
            <TableDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onSuccess={handleEditSuccess}
                table={selectedTable}
            />
        </div>
    );
}

export default function TablesPage() {
    return (
        <RouteGuard capability="tables">
            <SuspensePage
                skeletonProps={{
                    layout: "stats-grid",
                    statsCount: 4,
                    gridColumns: 4,
                    itemCount: 8,
                    itemHeight: "h-[200px]",
                }}
            >
                <TablesContent />
            </SuspensePage>
        </RouteGuard>
    );
}
