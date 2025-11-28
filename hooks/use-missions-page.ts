import { useCapabilities } from "@/hooks/use-capabilities";
import { useClients } from "@/hooks/use-clients";
import { useMissions, useMissionStats } from "@/hooks/use-missions";
import type { MissionFilters, StatutMission } from "@/lib/types/mission";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export interface UseMissionsPageReturn {
    // Access
    hasAccess: boolean;

    // Dialog
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;

    // Filters
    filters: MissionFilters;
    handleSearchChange: (value: string) => void;
    handleStatutChange: (value: string) => void;

    // Data
    missions: NonNullable<ReturnType<typeof useMissions>["data"]>;
    isLoading: boolean;
    error: Error | null;
    stats: ReturnType<typeof useMissionStats>["data"];
    clients: NonNullable<ReturnType<typeof useClients>["data"]>;

    // Navigation
    navigateToMission: (id: string) => void;
}

export function useMissionsPage(): UseMissionsPageReturn {
    const router = useRouter();
    const { hasCapability } = useCapabilities();

    // Check capability
    const hasAccess = hasCapability("projets");

    // State
    const [filters, setFilters] = useState<MissionFilters>({});
    const [dialogOpen, setDialogOpen] = useState(false);

    // Data
    const {
        data: missions = [],
        isLoading,
        error,
    } = useMissions(hasAccess ? filters : undefined, { enabled: hasAccess });
    const { data: stats } = useMissionStats({ enabled: hasAccess });
    const { data: clients = [] } = useClients();

    // Filter handlers
    const handleSearchChange = useCallback((value: string) => {
        setFilters((prev) => ({
            ...prev,
            search: value || undefined,
        }));
    }, []);

    const handleStatutChange = useCallback((value: string) => {
        setFilters((prev) => ({
            ...prev,
            statut: value === "ALL" ? undefined : (value as StatutMission),
        }));
    }, []);

    // Navigation
    const navigateToMission = useCallback(
        (id: string) => {
            router.push(`/dashboard/missions/${id}`);
        },
        [router]
    );

    return {
        hasAccess,
        dialogOpen,
        setDialogOpen,
        filters,
        handleSearchChange,
        handleStatutChange,
        missions,
        isLoading,
        error,
        stats,
        clients,
        navigateToMission,
    };
}
