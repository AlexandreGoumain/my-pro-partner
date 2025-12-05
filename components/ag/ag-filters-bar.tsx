import { FilterBar } from "@/components/ui/filter-bar";
import type { AGFilters } from "@/lib/types/ag.types";
import { TYPE_OPTIONS, STATUT_OPTIONS } from "@/lib/constants/ag.constants";

export interface AGFiltersBarProps {
    filters: AGFilters;
    onFilterChange: (key: keyof AGFilters, value: string) => void;
    coproOptions: Array<{ value: string; label: string }>;
    className?: string;
}

export function AGFiltersBar({ filters, onFilterChange, coproOptions, className }: AGFiltersBarProps) {
    return (
        <FilterBar
            variant="card"
            className={className}
            filters={[
                {
                    type: "search",
                    value: filters.search || "",
                    onChange: (value) => onFilterChange("search", value),
                    placeholder: "Rechercher par référence, copropriété...",
                    className: "flex-1",
                },
                {
                    type: "select",
                    value: filters.copropriete || "ALL",
                    onChange: (value) => onFilterChange("copropriete", value),
                    options: coproOptions,
                    label: "Copropriété",
                },
                {
                    type: "select",
                    value: filters.type || "ALL",
                    onChange: (value) => onFilterChange("type", value),
                    options: TYPE_OPTIONS,
                    label: "Type",
                },
                {
                    type: "select",
                    value: filters.statut || "ALL",
                    onChange: (value) => onFilterChange("statut", value),
                    options: STATUT_OPTIONS,
                    label: "Statut",
                },
            ]}
        />
    );
}
