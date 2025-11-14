"use client";

import { TableCard } from "@/components/tables/table-card";
import { TableStatsGrid } from "@/components/tables/table-stats-grid";
import { CardSection } from "@/components/ui/card-section";
import { FilterBar } from "@/components/ui/filter-bar";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { useTablesPage } from "@/hooks/use-tables-page";
import { TableStatus } from "@/lib/types/table.types";
import { Plus } from "lucide-react";
import { Suspense } from "react";

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
            <div className="flex gap-3 flex-wrap">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Rechercher une table..."
                    className="max-w-md"
                />
                <Select
                    value={zoneFilter}
                    onValueChange={(value) =>
                        setZoneFilter(value as typeof zoneFilter)
                    }
                >
                    <SelectTrigger className="w-[200px] h-11 text-[14px] border-black/10">
                        <SelectValue placeholder="Zone" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes les zones</SelectItem>
                        {availableZones.map((zone) => (
                            <SelectItem key={zone} value={zone}>
                                {zone}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={statusFilter}
                    onValueChange={(value) =>
                        setStatusFilter(value as typeof statusFilter)
                    }
                >
                    <SelectTrigger className="w-[200px] h-11 text-[14px] border-black/10">
                        <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value={TableStatus.LIBRE}>Libre</SelectItem>
                        <SelectItem value={TableStatus.OCCUPEE}>
                            Occupée
                        </SelectItem>
                        <SelectItem value={TableStatus.RESERVEE}>
                            Réservée
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

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
                    <div className="text-center py-12">
                        <p className="text-[14px] text-black/40">
                            Aucune table trouvée
                        </p>
                    </div>
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
        </div>
    );
}

export default function TablesPage() {
    return (
        <Suspense
            fallback={
                <PageSkeleton
                    layout="stats-grid"
                    statsCount={4}
                    gridColumns={4}
                    itemCount={8}
                    itemHeight="h-[200px]"
                />
            }
        >
            <TablesContent />
        </Suspense>
    );
}
