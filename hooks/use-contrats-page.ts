import { useContrats, useContratStats } from "@/hooks/use-contrats";
import type { StatutContrat, TypeContratEntretien } from "@/lib/types/contrats";
import { getContractStatusColor } from "@/lib/utils/badge-colors";
import { useState } from "react";

export interface UseContratsPageReturn {
    // Dialog
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;

    // Search
    searchInput: string;
    setSearchInput: (value: string) => void;
    handleSearch: () => void;

    // Filters
    statutFilter: StatutContrat | "ALL";
    setStatutFilter: (value: StatutContrat | "ALL") => void;
    typeFilter: TypeContratEntretien | "ALL";
    setTypeFilter: (value: TypeContratEntretien | "ALL") => void;

    // Data
    contrats: NonNullable<ReturnType<typeof useContrats>["data"]>;
    isLoading: boolean;
    stats: ReturnType<typeof useContratStats>["data"];

    // Helpers
    getStatutBadgeColor: (statut: StatutContrat) => string;
    isRevisionProche: (prochaineRevision: string | null | undefined) => boolean;
}

export function useContratsPage(): UseContratsPageReturn {
    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);

    // Search state
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Filter states
    const [statutFilter, setStatutFilter] = useState<StatutContrat | "ALL">(
        "ALL"
    );
    const [typeFilter, setTypeFilter] = useState<TypeContratEntretien | "ALL">(
        "ALL"
    );

    // Data
    const { data: contrats = [], isLoading } = useContrats({
        statut: statutFilter,
        type: typeFilter,
        search: searchQuery,
    });

    const { data: stats } = useContratStats();

    // Handlers
    const handleSearch = () => {
        setSearchQuery(searchInput);
    };

    // Check if revision is within 30 days
    const isRevisionProche = (
        prochaineRevision: string | null | undefined
    ): boolean => {
        if (!prochaineRevision) return false;
        const diff =
            new Date(prochaineRevision).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days <= 30 && days >= 0;
    };

    return {
        dialogOpen,
        setDialogOpen,
        searchInput,
        setSearchInput,
        handleSearch,
        statutFilter,
        setStatutFilter,
        typeFilter,
        setTypeFilter,
        contrats,
        isLoading,
        stats,
        getStatutBadgeColor: getContractStatusColor,
        isRevisionProche,
    };
}
