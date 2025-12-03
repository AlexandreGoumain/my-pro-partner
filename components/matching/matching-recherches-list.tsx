import { FilterBar } from "@/components/ui/filter-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { RechercheCard } from "./recherche-card";
import { Users } from "lucide-react";
import type { RechercheAcquereur, MatchingFilters } from "@/lib/types/matching.types";

export interface MatchingRecherchesListProps {
    recherches: RechercheAcquereur[];
    isLoading: boolean;
    filters: MatchingFilters;
    onFilterChange: (key: keyof MatchingFilters, value: string) => void;
    onView: (recherche: RechercheAcquereur) => void;
    onMatch: (recherche: RechercheAcquereur) => void;
    onCreate: () => void;
    className?: string;
}

export function MatchingRecherchesList({
    recherches,
    isLoading,
    filters,
    onFilterChange,
    onView,
    onMatch,
    onCreate,
    className,
}: MatchingRecherchesListProps) {
    return (
        <div className={className}>
            <FilterBar
                variant="card"
                filters={[
                    {
                        type: "search",
                        value: filters.search || "",
                        onChange: (value) => onFilterChange("search", value),
                        placeholder: "Rechercher par client, ville...",
                        className: "flex-1",
                    },
                ]}
            />

            {isLoading ? (
                <div className="space-y-4 mt-4">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="h-[200px] bg-black/5 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            ) : recherches.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="Aucune recherche"
                    description="Créez une recherche acquéreur pour trouver des biens correspondants"
                    action={{
                        label: "Créer une recherche",
                        onClick: onCreate,
                    }}
                />
            ) : (
                <div className="space-y-4 mt-4">
                    {recherches.map((recherche) => (
                        <RechercheCard
                            key={recherche.id}
                            recherche={recherche}
                            onView={onView}
                            onMatch={onMatch}
                            className="p-5 border-black/[0.08] hover:border-black/20 transition-all cursor-pointer"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
