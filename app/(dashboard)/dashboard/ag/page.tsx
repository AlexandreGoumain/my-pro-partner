"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { SuspensePage } from "@/components/ui/suspense-page";
import { AGStatsGrid } from "@/components/ag/ag-stats-grid";
import { AGFiltersBar } from "@/components/ag/ag-filters-bar";
import { AGGrid } from "@/components/ag/ag-grid";
import { Plus } from "lucide-react";
import type { AssembleeGenerale, AGFilters } from "@/lib/types/ag.types";

// Mock data
const mockAGs: AssembleeGenerale[] = [
    {
        id: "1",
        reference: "AG-2024-001",
        type: "ORDINAIRE",
        dateAG: new Date(Date.now() + 86400000 * 45).toISOString(),
        heureDebut: "19:00",
        lieu: "Salle des fêtes, 15 rue de la Mairie, 75015 Paris",
        copropriete: { id: "c1", nom: "Résidence Les Jardins" },
        statut: "PLANIFIEE",
        nbResolutions: 12,
        dateConvocation: new Date(Date.now() + 86400000 * 24).toISOString(),
        dateLimitePouvoir: new Date(Date.now() + 86400000 * 42).toISOString(),
    },
    {
        id: "2",
        reference: "AG-2024-002",
        type: "EXTRAORDINAIRE",
        dateAG: new Date(Date.now() + 86400000 * 15).toISOString(),
        heureDebut: "18:30",
        lieu: "Hall de l'immeuble, 8 allée des Chênes, 69003 Lyon",
        copropriete: { id: "c2", nom: "Le Clos des Tilleuls" },
        statut: "CONVOCATIONS_ENVOYEES",
        nbResolutions: 5,
        dateConvocation: new Date(Date.now() - 86400000 * 7).toISOString(),
        dateLimitePouvoir: new Date(Date.now() + 86400000 * 12).toISOString(),
    },
    {
        id: "3",
        reference: "AG-2023-012",
        type: "ORDINAIRE",
        dateAG: new Date(Date.now() - 86400000 * 30).toISOString(),
        heureDebut: "19:00",
        lieu: "Salle polyvalente, 22 avenue de la République, 13008 Marseille",
        copropriete: { id: "c3", nom: "Domaine du Parc" },
        statut: "PV_ENVOYE",
        nbResolutions: 18,
        nbResolutionsVotees: 18,
        quorum: 68,
        nbPresents: 42,
        nbRepresentes: 28,
    },
    {
        id: "4",
        reference: "AG-2023-011",
        type: "MIXTE",
        dateAG: new Date(Date.now() - 86400000 * 60).toISOString(),
        heureDebut: "18:00",
        lieu: "Salle de réunion, 15 rue des Fleurs, 75015 Paris",
        copropriete: { id: "c1", nom: "Résidence Les Jardins" },
        statut: "TERMINEE",
        nbResolutions: 15,
        nbResolutionsVotees: 14,
        quorum: 72,
        nbPresents: 28,
        nbRepresentes: 12,
    },
];

function AGPageContent() {
    const router = useRouter();
    const [filters, setFilters] = useState<AGFilters>({
        copropriete: "ALL",
        type: "ALL",
        statut: "ALL",
        search: "",
    });

    const ags = mockAGs;
    const isLoading = false;

    const handleFilterChange = useCallback(
        (key: keyof AGFilters, value: string) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const handleView = useCallback((ag: AssembleeGenerale) => {
        router.push(`/dashboard/ag/${ag.id}`);
    }, [router]);

    const handleAction = useCallback((_ag: AssembleeGenerale, _action: string) => {
        // Action handled via mutation
    }, []);

    const handleCreate = useCallback(() => {
        router.push("/dashboard/ag/nouveau");
    }, [router]);

    // Generate copropriete options
    const coproOptions = [
        { value: "ALL", label: "Toutes les copropriétés" },
        ...Array.from(new Set(ags.map((a) => a.copropriete.id))).map((id) => {
            const copro = ags.find((a) => a.copropriete.id === id)?.copropriete;
            return { value: id, label: copro?.nom || id };
        }),
    ];

    // Filter AGs
    const filteredAGs = ags.filter((a) => {
        if (filters.copropriete !== "ALL" && a.copropriete.id !== filters.copropriete) return false;
        if (filters.type !== "ALL" && a.type !== filters.type) return false;
        if (filters.statut !== "ALL" && a.statut !== filters.statut) return false;
        if (filters.search) {
            const search = filters.search.toLowerCase();
            return (
                a.reference.toLowerCase().includes(search) ||
                a.copropriete.nom.toLowerCase().includes(search) ||
                a.lieu.toLowerCase().includes(search)
            );
        }
        return true;
    });

    // Stats calculations
    const aVenirCount = ags.filter((a) =>
        ["PLANIFIEE", "CONVOCATIONS_ENVOYEES"].includes(a.statut)
    ).length;
    const termineesCount = ags.filter((a) =>
        ["TERMINEE", "PV_ENVOYE"].includes(a.statut)
    ).length;
    const prochaineAG = ags
        .filter((a) => new Date(a.dateAG) > new Date())
        .sort((a, b) => new Date(a.dateAG).getTime() - new Date(b.dateAG).getTime())[0];
    const prochaineDate = prochaineAG
        ? Math.ceil((new Date(prochaineAG.dateAG).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null;
    const totalYear = ags.filter((a) =>
        new Date(a.dateAG).getFullYear() === new Date().getFullYear()
    ).length;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Assemblées générales"
                description="Organisez et suivez les AG de vos copropriétés"
                actions={
                    <Button
                        onClick={handleCreate}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
                        Convoquer une AG
                    </Button>
                }
            />

            <AGStatsGrid
                aVenirCount={aVenirCount}
                termineesCount={termineesCount}
                prochaineDate={prochaineDate}
                totalYear={totalYear}
            />

            <AGFiltersBar
                filters={filters}
                onFilterChange={handleFilterChange}
                coproOptions={coproOptions}
            />

            <AGGrid
                ags={filteredAGs}
                isLoading={isLoading}
                filters={filters}
                onView={handleView}
                onAction={handleAction}
                onCreate={handleCreate}
            />
        </div>
    );
}

export default function AGPage() {
    return (
        <SuspensePage
            skeletonProps={{
                layout: "grid",
                headerActionsCount: 1,
                statsCount: 4,
            }}
        >
            <AGPageContent />
        </SuspensePage>
    );
}
