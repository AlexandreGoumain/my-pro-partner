import { useCapabilities } from "@/hooks/use-capabilities";
import {
    useInterventions,
    useInterventionStats,
    type InterventionFilters,
} from "@/hooks/use-interventions";
import { BUSINESS_TYPE_CONFIGS } from "@/lib/config/business-hierarchy.config";
import {
    INTERVENTIONS_PAR_METIER,
    TYPE_INTERVENTION_LABELS,
    type PrioriteIntervention,
    type StatutIntervention,
    type TypeIntervention,
} from "@/lib/types/intervention";
import {
    getInterventionPriorityColor,
    getInterventionStatusColor,
} from "@/lib/utils/badge-colors";
import { useMemo, useState } from "react";

export interface UseInterventionsPageReturn {
    // Dialog
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    handleDialogSuccess: () => void;

    // Filters
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statutFilter: StatutIntervention | "ALL";
    setStatutFilter: (statut: StatutIntervention | "ALL") => void;
    prioriteFilter: PrioriteIntervention | "ALL";
    setPrioriteFilter: (priorite: PrioriteIntervention | "ALL") => void;
    typeFilter: TypeIntervention | "ALL";
    setTypeFilter: (type: TypeIntervention | "ALL") => void;
    handleResetFilters: () => void;

    // Data
    interventions: NonNullable<ReturnType<typeof useInterventions>["data"]>;
    isLoading: boolean;
    stats: ReturnType<typeof useInterventionStats>["data"];

    // Business config
    businessLabel: string;
    availableInterventionTypes: TypeIntervention[];

    // Helpers
    getPriorityBadgeColor: (priorite: PrioriteIntervention) => string;
    getStatutBadgeColor: (statut: StatutIntervention) => string;
}

export function useInterventionsPage(): UseInterventionsPageReturn {
    const { businessType } = useCapabilities();

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [statutFilter, setStatutFilter] = useState<
        StatutIntervention | "ALL"
    >("ALL");
    const [prioriteFilter, setPrioriteFilter] = useState<
        PrioriteIntervention | "ALL"
    >("ALL");
    const [typeFilter, setTypeFilter] = useState<TypeIntervention | "ALL">(
        "ALL"
    );

    // Business config
    const businessConfig = BUSINESS_TYPE_CONFIGS[businessType];
    const businessLabel = businessConfig?.label || "Intervention";

    // Available intervention types for this business
    const availableInterventionTypes = useMemo(() => {
        const types =
            INTERVENTIONS_PAR_METIER[
                businessType as keyof typeof INTERVENTIONS_PAR_METIER
            ] || (Object.keys(TYPE_INTERVENTION_LABELS) as TypeIntervention[]);
        return [...types] as TypeIntervention[];
    }, [businessType]);

    // Build filters object
    const filters: InterventionFilters = useMemo(
        () => ({
            statut: statutFilter,
            priorite: prioriteFilter,
            type: typeFilter,
            search: searchQuery || undefined,
        }),
        [statutFilter, prioriteFilter, typeFilter, searchQuery]
    );

    // Fetch data
    const { data: interventions = [], isLoading } = useInterventions(filters);
    const { data: stats } = useInterventionStats();

    // Handlers
    const handleDialogSuccess = () => {
        setDialogOpen(false);
    };

    const handleResetFilters = () => {
        setSearchQuery("");
        setTypeFilter("ALL");
        setPrioriteFilter("ALL");
        setStatutFilter("ALL");
    };

    return {
        // Dialog
        dialogOpen,
        setDialogOpen,
        handleDialogSuccess,

        // Filters
        searchQuery,
        setSearchQuery,
        statutFilter,
        setStatutFilter,
        prioriteFilter,
        setPrioriteFilter,
        typeFilter,
        setTypeFilter,
        handleResetFilters,

        // Data
        interventions,
        isLoading,
        stats,

        // Business config
        businessLabel,
        availableInterventionTypes,

        // Helpers
        getPriorityBadgeColor: getInterventionPriorityColor,
        getStatutBadgeColor: getInterventionStatusColor,
    };
}
