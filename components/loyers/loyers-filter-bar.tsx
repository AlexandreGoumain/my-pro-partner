import { FilterBar } from "@/components/ui/filter-bar";
import type { LoyersFilters } from "@/hooks/gestion-locative/use-loyers";

const STATUT_OPTIONS = [
    { value: "ALL", label: "Tous les statuts" },
    { value: "A_ENVOYER", label: "À envoyer" },
    { value: "ENVOYE", label: "Envoyé" },
    { value: "PAYE", label: "Payé" },
    { value: "PARTIELLEMENT_PAYE", label: "Payé partiellement" },
    { value: "IMPAYE", label: "Impayé" },
    { value: "EN_CONTENTIEUX", label: "En contentieux" },
];

const generateMonthOptions = () => {
    const options = [{ value: "ALL", label: "Tous les mois" }];
    const now = new Date();
    for (let i = -3; i <= 3; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const label = date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
        options.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) });
    }
    return options;
};

const MOIS_OPTIONS = generateMonthOptions();

export interface LoyersFilterBarProps {
    filters: LoyersFilters;
    onFilterChange: (key: string, value: string) => void;
    className?: string;
}

export function LoyersFilterBar({ filters, onFilterChange, className }: LoyersFilterBarProps) {
    const currentMoisFilter = filters.mois && filters.annee
        ? `${filters.annee}-${String(filters.mois).padStart(2, "0")}`
        : "ALL";

    return (
        <FilterBar
            variant="card"
            className={className}
            filters={[
                {
                    type: "select",
                    value: currentMoisFilter,
                    onChange: (value) => onFilterChange("mois", value),
                    options: MOIS_OPTIONS,
                    label: "Mois",
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
