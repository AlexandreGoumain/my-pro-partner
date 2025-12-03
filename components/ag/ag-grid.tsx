import { EmptyState } from "@/components/ui/empty-state";
import { AGCard } from "./ag-card";
import { Users } from "lucide-react";
import type { AssembleeGenerale, AGFilters } from "@/lib/types/ag.types";

export interface AGGridProps {
    ags: AssembleeGenerale[];
    isLoading: boolean;
    filters: AGFilters;
    onView: (ag: AssembleeGenerale) => void;
    onAction: (ag: AssembleeGenerale, action: string) => void;
    onCreate?: () => void;
    className?: string;
}

export function AGGrid({
    ags,
    isLoading,
    filters,
    onView,
    onAction,
    onCreate,
    className,
}: AGGridProps) {
    const hasActiveFilters = filters.search ||
        filters.copropriete !== "ALL" ||
        filters.type !== "ALL" ||
        filters.statut !== "ALL";

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="h-[320px] bg-black/5 rounded-lg animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (ags.length === 0) {
        return (
            <EmptyState
                icon={Users}
                title="Aucune assemblée générale"
                description={
                    hasActiveFilters
                        ? "Aucune AG ne correspond à vos critères"
                        : "Convoquez votre première assemblée générale"
                }
                action={
                    hasActiveFilters || !onCreate
                        ? undefined
                        : {
                            label: "Convoquer une AG",
                            onClick: onCreate,
                        }
                }
            />
        );
    }

    return (
        <div className={className}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ags.map((ag) => (
                    <AGCard
                        key={ag.id}
                        ag={ag}
                        onView={onView}
                        onAction={onAction}
                    />
                ))}
            </div>
        </div>
    );
}
