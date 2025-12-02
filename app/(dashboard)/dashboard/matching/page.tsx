"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { SuspensePage } from "@/components/ui/suspense-page";
import { MatchingStatsGrid } from "@/components/matching/matching-stats-grid";
import { MatchingRecherchesList } from "@/components/matching/matching-recherches-list";
import { MatchingBiensPanel } from "@/components/matching/matching-biens-panel";
import { Plus } from "lucide-react";
import type { RechercheAcquereur, BienMatch, MatchingFilters } from "@/lib/types/matching.types";

// Mock data
const mockRecherches: RechercheAcquereur[] = [
    {
        id: "1",
        typeBien: ["APPARTEMENT"],
        budgetMin: 300000,
        budgetMax: 450000,
        surfaceMin: 60,
        surfaceMax: 90,
        nbPiecesMin: 3,
        villesRecherchees: ["Paris", "Boulogne-Billancourt"],
        criteres: { balcon: true, ascenseur: true },
        actif: true,
        client: {
            id: "c1",
            nom: "Martin",
            prenom: "Sophie",
            email: "sophie.martin@email.com",
            telephone: "06 12 34 56 78",
        },
        matchCount: 3,
    },
    {
        id: "2",
        typeBien: ["MAISON"],
        budgetMin: 500000,
        budgetMax: 700000,
        surfaceMin: 120,
        nbPiecesMin: 4,
        villesRecherchees: ["Lyon", "Villeurbanne", "Caluire"],
        criteres: { jardin: true, garage: true },
        actif: true,
        client: {
            id: "c2",
            nom: "Durand",
            prenom: "Pierre",
            email: "pierre.durand@email.com",
            telephone: "06 98 76 54 32",
        },
        matchCount: 5,
    },
    {
        id: "3",
        typeBien: ["APPARTEMENT", "MAISON"],
        budgetMax: 250000,
        surfaceMin: 40,
        villesRecherchees: ["Marseille"],
        actif: true,
        client: {
            id: "c3",
            nom: "Bernard",
            prenom: "Marie",
            email: "marie.bernard@email.com",
        },
        matchCount: 2,
    },
];

const mockBiens: BienMatch[] = [
    {
        id: "b1",
        reference: "BIEN-0001",
        titre: "Appartement 3 pièces avec balcon",
        typeBien: "APPARTEMENT",
        ville: "Paris",
        prix: 420000,
        surface: 72,
        nbPieces: 3,
        score: 95,
    },
    {
        id: "b2",
        reference: "BIEN-0002",
        titre: "Appartement 3 pièces rénové",
        typeBien: "APPARTEMENT",
        ville: "Boulogne-Billancourt",
        prix: 380000,
        surface: 65,
        nbPieces: 3,
        score: 88,
    },
    {
        id: "b3",
        reference: "BIEN-0003",
        titre: "Appartement 4 pièces lumineux",
        typeBien: "APPARTEMENT",
        ville: "Paris",
        prix: 445000,
        surface: 85,
        nbPieces: 4,
        score: 72,
    },
];

function MatchingPageContent() {
    const router = useRouter();
    const [filters, setFilters] = useState<MatchingFilters>({
        ville: "",
        budgetMax: "",
        search: "",
    });
    const [selectedRecherche, setSelectedRecherche] = useState<RechercheAcquereur | null>(null);

    const recherches = mockRecherches;
    const biensMatches = mockBiens;
    const isLoading = false;

    const handleFilterChange = useCallback(
        (key: keyof MatchingFilters, value: string) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const handleView = useCallback((recherche: RechercheAcquereur) => {
        router.push(`/dashboard/matching/${recherche.id}`);
    }, [router]);

    const handleMatch = useCallback((recherche: RechercheAcquereur) => {
        setSelectedRecherche(recherche);
    }, []);

    const handleSelectBien = useCallback((_bien: BienMatch) => {
        // Match action handled via mutation
    }, []);

    const handleCreate = useCallback(() => {
        router.push("/dashboard/matching/nouveau");
    }, [router]);

    // Stats
    const totalRecherches = recherches.filter((r) => r.actif).length;
    const totalMatches = recherches.reduce((acc, r) => acc + (r.matchCount || 0), 0);

    // Filter recherches
    const filteredRecherches = recherches.filter((r) => {
        if (!r.actif) return false;
        if (filters.ville && !r.villesRecherchees.some(v =>
            v.toLowerCase().includes(filters.ville.toLowerCase())
        )) return false;
        if (filters.budgetMax && r.budgetMin && r.budgetMin > parseInt(filters.budgetMax)) return false;
        if (filters.search) {
            const search = filters.search.toLowerCase();
            return (
                r.client.nom.toLowerCase().includes(search) ||
                r.client.prenom.toLowerCase().includes(search) ||
                r.villesRecherchees.some(v => v.toLowerCase().includes(search))
            );
        }
        return true;
    });

    return (
        <div className="space-y-6">
            <PageHeader
                title="Matching acquéreurs"
                description="Trouvez les biens correspondant aux recherches de vos clients"
                actions={
                    <Button
                        onClick={handleCreate}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
                        Nouvelle recherche
                    </Button>
                }
            />

            <MatchingStatsGrid
                totalRecherches={totalRecherches}
                totalMatches={totalMatches}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MatchingRecherchesList
                    recherches={filteredRecherches}
                    isLoading={isLoading}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onView={handleView}
                    onMatch={handleMatch}
                    onCreate={handleCreate}
                />

                <MatchingBiensPanel
                    selectedRecherche={selectedRecherche}
                    biens={biensMatches}
                    onSelectBien={handleSelectBien}
                />
            </div>
        </div>
    );
}

export default function MatchingPage() {
    return (
        <SuspensePage
            skeletonProps={{
                layout: "grid",
                headerActionsCount: 1,
                statsCount: 3,
            }}
        >
            <MatchingPageContent />
        </SuspensePage>
    );
}
