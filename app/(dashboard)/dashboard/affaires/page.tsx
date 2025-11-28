"use client";

import { AffaireCard } from "@/components/juridique";
import { Button } from "@/components/ui/button";
import { DataStateRenderer } from "@/components/ui/data-state-renderer";
import { FilterSelect } from "@/components/ui/filter-select";
import { NoAccessState } from "@/components/ui/no-access-state";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { StatsGrid } from "@/components/ui/stats-grid";
import { useAffairesPage } from "@/hooks/use-affaires-page";
import {
    DOMAINE_JURIDIQUE,
    DOMAINE_JURIDIQUE_LABELS,
    STATUT_AFFAIRE,
    STATUT_AFFAIRE_LABELS,
} from "@/lib/types/juridique";
import { AlertCircle, Clock, Gavel, Plus, Scale } from "lucide-react";

export default function AffairesPage() {
    const {
        hasAccess,
        filters,
        handleSearchChange,
        handleStatutChange,
        handleDomaineChange,
        affaires,
        isLoading,
        error,
        stats,
        navigateToAffaire,
        navigateToNewAffaire,
        navigateToEditAffaire,
    } = useAffairesPage();

    if (!hasAccess) {
        return <NoAccessState icon={Scale} />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Affaires"
                description="Gérez vos dossiers juridiques et suivez les échéances"
                actions={
                    <Button
                        onClick={navigateToNewAffaire}
                        className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle affaire
                    </Button>
                }
            />

            {/* Stats */}
            <StatsGrid
                stats={[
                    {
                        icon: Scale,
                        label: "Affaires totales",
                        value: stats.total,
                    },
                    {
                        icon: Clock,
                        label: "En cours",
                        value: stats.enCours,
                    },
                    {
                        icon: Gavel,
                        label: "Audiences à venir",
                        value: stats.audiencesProchaines,
                    },
                    {
                        icon: AlertCircle,
                        label: "Conflits à vérifier",
                        value: stats.conflitsAVerifier,
                        iconBgClassName: "bg-orange-50",
                        iconClassName: "text-orange-500",
                    },
                ]}
                columns={4}
            />

            {/* Filters */}
            <div className="flex items-center gap-4">
                <SearchBar
                    value={filters.search || ""}
                    onChange={handleSearchChange}
                    placeholder="Rechercher une affaire..."
                    className="flex-1 max-w-md"
                />

                <FilterSelect
                    value={
                        Array.isArray(filters.statut)
                            ? undefined
                            : filters.statut
                    }
                    onValueChange={handleStatutChange}
                    options={STATUT_AFFAIRE.map((s) => ({
                        value: s,
                        label: STATUT_AFFAIRE_LABELS[s],
                    }))}
                    placeholder="Tous les statuts"
                    allLabel="Tous les statuts"
                />

                <FilterSelect
                    value={
                        Array.isArray(filters.domaine)
                            ? undefined
                            : filters.domaine
                    }
                    onValueChange={handleDomaineChange}
                    options={DOMAINE_JURIDIQUE.map((d) => ({
                        value: d,
                        label: DOMAINE_JURIDIQUE_LABELS[d],
                    }))}
                    placeholder="Tous les domaines"
                    allLabel="Tous les domaines"
                    triggerClassName="w-[200px]"
                />
            </div>

            {/* Content */}
            <DataStateRenderer
                isLoading={isLoading}
                error={error}
                data={affaires}
                errorMessage="Erreur lors du chargement des affaires"
                emptyState={{
                    icon: Scale,
                    title: "Aucune affaire",
                    description:
                        filters.search || filters.statut || filters.domaine
                            ? "Aucune affaire ne correspond à vos critères"
                            : "Commencez par créer votre première affaire",
                    action:
                        !filters.search &&
                        !filters.statut &&
                        !filters.domaine ? (
                            <Button
                                onClick={navigateToNewAffaire}
                                className="h-10 px-6 bg-black hover:bg-black/90"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Nouvelle affaire
                            </Button>
                        ) : undefined,
                }}
            >
                {(data) => (
                    <div className="grid gap-3">
                        {data.map((affaire) => (
                            <AffaireCard
                                key={affaire.id}
                                affaire={affaire}
                                onClick={() => navigateToAffaire(affaire.id)}
                                onEdit={() => navigateToEditAffaire(affaire.id)}
                            />
                        ))}
                    </div>
                )}
            </DataStateRenderer>
        </div>
    );
}
