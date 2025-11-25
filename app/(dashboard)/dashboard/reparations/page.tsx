"use client";

import { RepairCard } from "@/components/reparations/repair-card";
import { RepairCreateDialog } from "@/components/reparations/repair-create-dialog";
import { RepairEmptyState } from "@/components/reparations/repair-empty-state";
import { RepairFilters } from "@/components/reparations/repair-filters";
import { RepairStatsCards } from "@/components/reparations/repair-stats-cards";
import { Button } from "@/components/ui/button";
import { RouteGuard } from "@/components/ui/route-guard";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";

export default function ReparationsPage() {
    const [statut, setStatut] = useState<string>();
    const [priorite, setPriorite] = useState<string>();
    const [search, setSearch] = useState<string>();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    // Fetch repairs
    const { data: reparationsData, isLoading: isLoadingReparations } = useQuery(
        {
            queryKey: ["reparations", statut, priorite, search],
            queryFn: async () => {
                const params = new URLSearchParams();
                if (statut && statut !== "all") params.set("statut", statut);
                if (priorite && priorite !== "all")
                    params.set("priorite", priorite);
                if (search) params.set("search", search);

                const response = await fetch(
                    `/api/reparations?${params.toString()}`
                );
                if (!response.ok)
                    throw new Error("Failed to fetch reparations");
                return response.json();
            },
        }
    );

    // Fetch stats
    const { data: statsData } = useQuery({
        queryKey: ["reparations-stats"],
        queryFn: async () => {
            const response = await fetch("/api/reparations/stats");
            if (!response.ok) throw new Error("Failed to fetch stats");
            return response.json();
        },
    });

    const reparations = reparationsData?.items || [];
    const stats = statsData || {
        totalReparations: 0,
        enCours: 0,
        pretes: 0,
        enRetard: 0,
    };

    const handleStatutChange = (value: string) => {
        setStatut(value === "all" ? undefined : value);
    };

    const handlePrioriteChange = (value: string) => {
        setPriorite(value === "all" ? undefined : value);
    };

    const handleSearchChange = (value: string) => {
        setSearch(value || undefined);
    };

    return (
        <RouteGuard capability="atelier">
            <div className="space-y-6 p-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                            Réparations
                        </h1>
                        <p className="text-[14px] text-black/60 mt-1">
                            Gestion et suivi des réparations d'appareils
                        </p>
                    </div>
                    <Button
                        onClick={() => setCreateDialogOpen(true)}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6"
                    >
                        <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
                        Nouvelle réparation
                    </Button>
                </div>

                {/* Stats Cards */}
                <RepairStatsCards stats={stats} />

                {/* Filters */}
                <RepairFilters
                    statut={statut}
                    priorite={priorite}
                    search={search}
                    onStatutChange={handleStatutChange}
                    onPrioriteChange={handlePrioriteChange}
                    onSearchChange={handleSearchChange}
                />

                {/* Repairs List */}
                <div>
                    {isLoadingReparations ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="h-8 w-8 animate-spin text-black/40" />
                        </div>
                    ) : reparations.length === 0 ? (
                        <RepairEmptyState
                            onCreateClick={() => setCreateDialogOpen(true)}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {reparations.map((reparation: any) => (
                                <RepairCard
                                    key={reparation.id}
                                    reparation={reparation}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <RepairCreateDialog
                    open={createDialogOpen}
                    onOpenChange={setCreateDialogOpen}
                    onSuccess={() => {
                        setCreateDialogOpen(false);
                    }}
                />
            </div>
        </RouteGuard>
    );
}
