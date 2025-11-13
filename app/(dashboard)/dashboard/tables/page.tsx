"use client";

import { TableCard } from "@/components/tables/table-card";
import { TableStatsGrid } from "@/components/tables/table-stats-grid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
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
                    <Button
                        onClick={handleCreate}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
                        Ajouter une table
                    </Button>
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
            <Card className="border-black/8 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-[20px] font-semibold tracking-[-0.02em] text-black">
                        Plan de salle
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Skeleton key={i} className="h-[200px]" />
                            ))}
                        </div>
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
                </CardContent>
            </Card>
        </div>
    );
}

export default function TablesPage() {
    return (
        <Suspense
            fallback={
                <div className="space-y-6">
                    <Skeleton className="h-20" />
                    <div className="grid gap-4 md:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-32" />
                        ))}
                    </div>
                    <Skeleton className="h-96" />
                </div>
            }
        >
            <TablesContent />
        </Suspense>
    );
}
