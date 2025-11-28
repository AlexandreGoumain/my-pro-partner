import { useCapabilities } from "@/hooks/use-capabilities";
import { useDiligences } from "@/hooks/use-diligences";
import type { DiligenceFilters, TypeDiligence } from "@/lib/types/juridique";
import { formatCurrency, formatDuree } from "@/lib/utils/format";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DiligenceStats {
    nonFacturees: number;
    totalMinutes: number;
    totalMontant: number;
}

export interface UseDiligencesPageReturn {
    // Access
    hasAccess: boolean;

    // Filters
    filters: DiligenceFilters;
    handleTypeChange: (value: string) => void;
    handleFactureeChange: (value: string) => void;

    // Data
    diligences: NonNullable<
        ReturnType<typeof useDiligences>["data"]
    >["diligences"];
    isLoading: boolean;
    error: Error | null;
    stats: DiligenceStats;

    // Navigation
    navigateToAffaire: (affaireId: string) => void;

    // Formatters
    formatDuree: typeof formatDuree;
    formatMontant: typeof formatCurrency;
}

export function useDiligencesPage(): UseDiligencesPageReturn {
    const router = useRouter();
    const { hasCapability } = useCapabilities();

    // Check capability
    const hasAccess = hasCapability("temps_passe");

    // State
    const [filters, setFilters] = useState<DiligenceFilters>({});

    // Data
    const { data, isLoading, error } = useDiligences(
        hasAccess ? filters : undefined,
        { enabled: hasAccess }
    );

    const diligences = data?.diligences || [];
    const stats: DiligenceStats = data?.stats || {
        nonFacturees: 0,
        totalMinutes: 0,
        totalMontant: 0,
    };

    // Filter handlers
    const handleTypeChange = (value: string) => {
        setFilters((prev) => ({
            ...prev,
            type: value === "ALL" ? undefined : (value as TypeDiligence),
        }));
    };

    const handleFactureeChange = (value: string) => {
        setFilters((prev) => ({
            ...prev,
            facturee: value === "ALL" ? undefined : value === "true",
        }));
    };

    // Navigation
    const navigateToAffaire = (affaireId: string) => {
        router.push(`/dashboard/affaires/${affaireId}`);
    };

    return {
        hasAccess,
        filters,
        handleTypeChange,
        handleFactureeChange,
        diligences,
        isLoading,
        error,
        stats,
        navigateToAffaire,
        formatDuree,
        formatMontant: formatCurrency,
    };
}
