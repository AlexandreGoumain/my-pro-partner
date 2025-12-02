import { EmptyState } from "@/components/ui/empty-state";
import { LoyerCard } from "./loyer-card";
import { Receipt } from "lucide-react";
import type { LoyerWithRelations, LoyersFilters } from "@/hooks/gestion-locative/use-loyers";

export interface LoyersGridProps {
    loyers: LoyerWithRelations[];
    isLoading: boolean;
    filters: LoyersFilters;
    onView: (loyer: LoyerWithRelations) => void;
    onAction: (loyer: LoyerWithRelations, action: string) => void;
    onGenerate?: () => void;
    className?: string;
}

export function LoyersGrid({
    loyers,
    isLoading,
    filters,
    onView,
    onAction,
    onGenerate,
    className,
}: LoyersGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="h-[220px] bg-black/5 rounded-lg animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (loyers.length === 0) {
        return (
            <EmptyState
                icon={Receipt}
                title="Aucun appel de loyer"
                description={
                    filters.statut
                        ? "Aucun appel ne correspond à vos critères"
                        : "Générez les appels de loyers pour le mois en cours"
                }
                action={
                    filters.statut || !onGenerate
                        ? undefined
                        : {
                            label: "Générer les appels",
                            onClick: onGenerate,
                        }
                }
            />
        );
    }

    return (
        <div className={className}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loyers.map((loyer) => (
                    <LoyerCard
                        key={loyer.id}
                        loyer={loyer}
                        onView={onView}
                        onAction={onAction}
                    />
                ))}
            </div>
        </div>
    );
}
