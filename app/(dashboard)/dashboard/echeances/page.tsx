"use client";

import {
    EcheanceCard,
    EcheanceDialog,
    EcheancesCalendar,
} from "@/components/echeances";
import { Button } from "@/components/ui/button";
import { DataStateRenderer } from "@/components/ui/data-state-renderer";
import { FilterBar } from "@/components/ui/filter-bar";
import { NoAccessState } from "@/components/ui/no-access-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatsGrid } from "@/components/ui/stats-grid";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCapabilities } from "@/hooks/use-capabilities";
import { useEcheances, useEcheancesStats } from "@/hooks/use-echeances";
import { useMissions } from "@/hooks/use-missions";
import {
    STATUT_ECHEANCE,
    STATUT_ECHEANCE_LABELS,
    TYPE_DOSSIER_COMPTABLE,
    TYPE_DOSSIER_LABELS,
    type EcheanceFiscaleFilters,
    type StatutEcheance,
    type TypeDossierComptable,
} from "@/lib/types/mission";
import {
    AlertTriangle,
    Calendar,
    CalendarClock,
    CheckCircle2,
    Clock,
    List,
    Loader2,
    Plus,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EcheancesPage() {
    const searchParams = useSearchParams();
    const { hasCapability } = useCapabilities();

    // Check capability
    const hasAccess = hasCapability("projets");

    // State
    const [filters, setFilters] = useState<EcheanceFiscaleFilters>({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("toutes");
    const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

    // Check URL params for dialog
    useEffect(() => {
        if (searchParams.get("action") === "new") {
            setDialogOpen(true);
        }
        const periode = searchParams.get("periode");
        if (periode === "avenir" || periode === "retard") {
            setActiveTab(periode);
            setFilters((prev) => ({ ...prev, periode }));
        }
    }, [searchParams]);

    // Handle tab change
    const handleTabChange = (value: string) => {
        setActiveTab(value);
        if (value === "toutes") {
            setFilters((prev) => ({ ...prev, periode: undefined }));
        } else {
            setFilters((prev) => ({
                ...prev,
                periode: value as "avenir" | "retard" | "semaine" | "mois",
            }));
        }
    };

    // Data
    const {
        data: echeances = [],
        isLoading,
        error,
    } = useEcheances(hasAccess ? filters : undefined, { enabled: hasAccess });
    const { data: statsData } = useEcheancesStats({ enabled: hasAccess });
    const { data: missions = [] } = useMissions(undefined, {
        enabled: hasAccess,
    });

    const stats = statsData?.stats;

    // Filter handlers
    const handleSearchChange = (value: string) => {
        setFilters((prev) => ({
            ...prev,
            search: value || undefined,
        }));
    };

    const handleTypeChange = (value: string) => {
        setFilters((prev) => ({
            ...prev,
            type: value === "ALL" ? undefined : (value as TypeDossierComptable),
        }));
    };

    const handleStatutChange = (value: string) => {
        setFilters((prev) => ({
            ...prev,
            statut: value === "ALL" ? undefined : (value as StatutEcheance),
        }));
    };

    if (!hasAccess) {
        return <NoAccessState icon={CalendarClock} />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Échéances fiscales"
                description="Suivez les échéances fiscales et sociales de vos clients"
                actions={
                    <Button
                        onClick={() => setDialogOpen(true)}
                        className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle échéance
                    </Button>
                }
            />

            {/* Stats */}
            {stats && (
                <StatsGrid
                    stats={[
                        {
                            icon: CalendarClock,
                            label: "Total échéances",
                            value: stats.total,
                        },
                        {
                            icon: Clock,
                            label: "À venir",
                            value: stats.aVenir,
                        },
                        {
                            icon: AlertTriangle,
                            label: "En retard",
                            value: stats.enRetard,
                            iconBgClassName: "bg-red-50",
                            iconClassName: "text-red-500",
                            valueClassName: "text-red-600",
                        },
                        {
                            icon: CheckCircle2,
                            label: "Déposées",
                            value: stats.deposees,
                        },
                    ]}
                    columns={4}
                />
            )}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="bg-black/5">
                    <TabsTrigger value="toutes">Toutes</TabsTrigger>
                    <TabsTrigger value="semaine">Cette semaine</TabsTrigger>
                    <TabsTrigger value="mois">Ce mois</TabsTrigger>
                    <TabsTrigger value="avenir">À venir</TabsTrigger>
                    <TabsTrigger
                        value="retard"
                        className="data-[state=active]:text-red-600"
                    >
                        En retard
                        {stats && stats.enRetard > 0 && (
                            <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-red-100 text-red-600 rounded-full">
                                {stats.enRetard}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Filters */}
            <FilterBar
                filters={[
                    {
                        type: "search",
                        value: filters.search || "",
                        onChange: handleSearchChange,
                        placeholder: "Rechercher une échéance...",
                        className: "flex-1 max-w-sm",
                    },
                    {
                        type: "select",
                        value: typeof filters.type === "string" ? filters.type : "ALL",
                        onChange: handleTypeChange,
                        placeholder: "Type",
                        options: [
                            { value: "ALL", label: "Tous les types" },
                            ...TYPE_DOSSIER_COMPTABLE.map((type) => ({
                                value: type,
                                label: TYPE_DOSSIER_LABELS[type],
                            })),
                        ],
                        className: "w-[180px]",
                    },
                    {
                        type: "select",
                        value: typeof filters.statut === "string" ? filters.statut : "ALL",
                        onChange: handleStatutChange,
                        placeholder: "Statut",
                        options: [
                            { value: "ALL", label: "Tous les statuts" },
                            ...STATUT_ECHEANCE.map((statut) => ({
                                value: statut,
                                label: STATUT_ECHEANCE_LABELS[statut],
                            })),
                        ],
                        className: "w-[180px]",
                    },
                    {
                        type: "custom",
                        component: (
                            <div className="flex border border-black/10 rounded-lg">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                    className={`h-11 px-3 rounded-r-none ${viewMode === "list" ? "bg-black/5" : ""}`}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setViewMode("calendar")}
                                    className={`h-11 px-3 rounded-l-none border-l border-black/10 ${viewMode === "calendar" ? "bg-black/5" : ""}`}
                                >
                                    <Calendar className="h-4 w-4" />
                                </Button>
                            </div>
                        ),
                    },
                ]}
            />

            {/* Echeances content */}
            {viewMode === "calendar" ? (
                // Calendar view - loading/error handling séparé car le calendrier s'affiche toujours
                isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-black/20" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-[14px] text-red-500">
                            Erreur lors du chargement des échéances
                        </p>
                    </div>
                ) : (
                    <EcheancesCalendar
                        echeances={echeances}
                        onSelectEcheance={(echeance) => {
                            // TODO: Open edit dialog with selected echeance
                        }}
                    />
                )
            ) : (
                // List view - DataStateRenderer pour loading/error/empty/content
                <DataStateRenderer
                    isLoading={isLoading}
                    error={error}
                    data={echeances}
                    errorMessage="Erreur lors du chargement des échéances"
                    emptyState={{
                        icon: CalendarClock,
                        title: "Aucune échéance",
                        description:
                            filters.search || filters.type || filters.statut
                                ? "Aucune échéance ne correspond à vos critères"
                                : "Créez votre première échéance fiscale",
                        action:
                            !filters.search &&
                            !filters.type &&
                            !filters.statut ? (
                                <Button
                                    onClick={() => setDialogOpen(true)}
                                    className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Nouvelle échéance
                                </Button>
                            ) : undefined,
                    }}
                >
                    {(data) => (
                        <div className="space-y-3">
                            {data.map((echeance) => (
                                <EcheanceCard
                                    key={echeance.id}
                                    echeance={echeance}
                                    onClick={() => {
                                        // TODO: Navigate to detail page or open edit dialog
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </DataStateRenderer>
            )}

            {/* Create/Edit dialog */}
            <EcheanceDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                missions={missions}
            />
        </div>
    );
}
