import { useAffaires } from "@/hooks/use-affaires";
import { useCapabilities } from "@/hooks/use-capabilities";
import type {
    AffaireFilters,
    DomaineJuridique,
    StatutAffaire,
} from "@/lib/types/juridique";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

interface AffairesStats {
    total: number;
    enCours: number;
    audiencesProchaines: number;
    conflitsAVerifier: number;
}

export interface UseAffairesPageReturn {
    // Access
    hasAccess: boolean;

    // Filters
    filters: AffaireFilters;
    handleSearchChange: (value: string) => void;
    handleStatutChange: (value: string) => void;
    handleDomaineChange: (value: string) => void;

    // Data
    affaires: NonNullable<ReturnType<typeof useAffaires>["data"]>;
    isLoading: boolean;
    error: Error | null;
    stats: AffairesStats;

    // Navigation
    navigateToAffaire: (id: string) => void;
    navigateToNewAffaire: () => void;
    navigateToEditAffaire: (id: string) => void;
}

export function useAffairesPage(): UseAffairesPageReturn {
    const router = useRouter();
    const { hasCapability } = useCapabilities();

    // Check capability
    const hasAccess = hasCapability("projets");

    // State
    const [filters, setFilters] = useState<AffaireFilters>({});

    // Data
    const {
        data: affaires = [],
        isLoading,
        error,
    } = useAffaires(hasAccess ? filters : undefined, { enabled: hasAccess });

    // Calculate stats from affaires
    const stats = useMemo<AffairesStats>(
        () => ({
            total: affaires.length,
            enCours: affaires.filter(
                (a) => !["CLOTUREE", "ARCHIVEE"].includes(a.statut)
            ).length,
            audiencesProchaines: affaires.filter(
                (a) => a.prochainEcheance?.type === "AUDIENCE"
            ).length,
            conflitsAVerifier: affaires.filter((a) => !a.conflitVerifie).length,
        }),
        [affaires]
    );

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
            statut: value === "ALL" ? undefined : (value as StatutAffaire),
        }));
    }, []);

    const handleDomaineChange = useCallback((value: string) => {
        setFilters((prev) => ({
            ...prev,
            domaine: value === "ALL" ? undefined : (value as DomaineJuridique),
        }));
    }, []);

    // Navigation
    const navigateToAffaire = useCallback(
        (id: string) => {
            router.push(`/dashboard/affaires/${id}`);
        },
        [router]
    );

    const navigateToNewAffaire = useCallback(() => {
        router.push("/dashboard/affaires/new");
    }, [router]);

    const navigateToEditAffaire = useCallback(
        (id: string) => {
            router.push(`/dashboard/affaires/${id}/edit`);
        },
        [router]
    );

    return {
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
    };
}
