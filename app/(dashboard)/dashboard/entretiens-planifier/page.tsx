"use client";

import { EntretienPlanifierCard } from "@/components/equipements/entretien-planifier-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/ui/filter-bar";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { PriorityGroupSection } from "@/components/ui/priority-group-section";
import { RouteGuard } from "@/components/ui/route-guard";
import { StatCard } from "@/components/ui/stat-card";
import {
    useEntretiensAPlanifier,
    type EntretienAPlanifier,
} from "@/hooks/use-entretiens-planifier";
import {
    AlertTriangle,
    Calendar,
    CalendarClock,
    CalendarDays,
    CheckCircle,
    Clock,
    RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type TypeFilter = "ALL" | "CONTROLE_ANNUEL" | "ENTRETIEN" | "GARANTIE_EXPIRE";
type PrioriteFilter = "ALL" | "critique" | "haute" | "normale" | "basse";

export default function EntretiensPlanifierPage() {
    const router = useRouter();
    const [joursFilter, setJoursFilter] = useState(60);
    const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
    const [prioriteFilter, setPrioriteFilter] = useState<PrioriteFilter>("ALL");
    const [includeRetard, setIncludeRetard] = useState(true);

    const { data, isLoading, refetch } = useEntretiensAPlanifier({
        jours: joursFilter,
        includeRetard,
    });

    const entretiens = data?.entretiens ?? [];
    const stats = data?.stats;

    // Filter locally by type and priority
    const filteredEntretiens = useMemo(() => {
        return entretiens.filter((e) => {
            if (typeFilter !== "ALL" && e.type !== typeFilter) return false;
            if (prioriteFilter !== "ALL" && e.priorite !== prioriteFilter)
                return false;
            return true;
        });
    }, [entretiens, typeFilter, prioriteFilter]);

    // Group by priority for display
    const groupedEntretiens = useMemo(() => {
        const groups: Record<string, EntretienAPlanifier[]> = {
            enRetard: [],
            critique: [],
            haute: [],
            normale: [],
            basse: [],
        };

        filteredEntretiens.forEach((e) => {
            if (e.enRetard) {
                groups.enRetard.push(e);
            } else {
                groups[e.priorite].push(e);
            }
        });

        return groups;
    }, [filteredEntretiens]);

    const handlePlanifier = (entretien: EntretienAPlanifier) => {
        // Navigate to planning page with preselected info
        // or open intervention dialog
        router.push(
            `/dashboard/planning?equipementId=${entretien.equipementId}`
        );
    };

    const resetFilters = () => {
        setJoursFilter(60);
        setTypeFilter("ALL");
        setPrioriteFilter("ALL");
        setIncludeRetard(true);
    };

    return (
        <RouteGuard capability="domicile">
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Entretiens à planifier"
                    description="Contrôles annuels et entretiens à programmer"
                    actions={
                        <Button
                            variant="outline"
                            onClick={() => refetch()}
                            className="h-11 px-4 border-black/10 hover:bg-black/5"
                        >
                            <RefreshCw
                                className="w-4 h-4 mr-2"
                                strokeWidth={2}
                            />
                            Actualiser
                        </Button>
                    }
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={CalendarClock}
                        label="Total à planifier"
                        value={stats?.total ?? 0}
                        description="entretiens à venir"
                    />
                    <StatCard
                        icon={AlertTriangle}
                        label="En retard"
                        value={stats?.enRetard ?? 0}
                        badge={
                            (stats?.enRetard ?? 0) > 0
                                ? {
                                      text: "Action urgente",
                                      className: "bg-red-100 text-red-700",
                                  }
                                : undefined
                        }
                    />
                    <StatCard
                        icon={Clock}
                        label="Dans 7 jours"
                        value={stats?.dans7Jours ?? 0}
                        badge={
                            (stats?.dans7Jours ?? 0) > 0
                                ? {
                                      text: "Cette semaine",
                                      className:
                                          "bg-orange-100 text-orange-700",
                                  }
                                : undefined
                        }
                    />
                    <StatCard
                        icon={CalendarDays}
                        label="Dans 30 jours"
                        value={stats?.dans30Jours ?? 0}
                        description="ce mois-ci"
                    />
                </div>

                {/* Filters */}
                <FilterBar
                    filters={[
                        {
                            type: "select",
                            value: String(joursFilter),
                            onChange: (value) => setJoursFilter(parseInt(value)),
                            placeholder: "Période",
                            options: [
                                { value: "7", label: "7 prochains jours" },
                                { value: "14", label: "14 prochains jours" },
                                { value: "30", label: "30 prochains jours" },
                                { value: "60", label: "60 prochains jours" },
                                { value: "90", label: "90 prochains jours" },
                            ],
                            className: "w-[180px]",
                        },
                        {
                            type: "select",
                            value: typeFilter,
                            onChange: (value) => setTypeFilter(value as TypeFilter),
                            placeholder: "Type",
                            options: [
                                { value: "ALL", label: "Tous les types" },
                                { value: "CONTROLE_ANNUEL", label: "Contrôle annuel" },
                                { value: "ENTRETIEN", label: "Entretien" },
                                { value: "GARANTIE_EXPIRE", label: "Garantie expire" },
                            ],
                            className: "w-[180px]",
                        },
                        {
                            type: "select",
                            value: prioriteFilter,
                            onChange: (value) => setPrioriteFilter(value as PrioriteFilter),
                            placeholder: "Priorité",
                            options: [
                                { value: "ALL", label: "Toutes priorités" },
                                { value: "critique", label: "Critique" },
                                { value: "haute", label: "Haute" },
                                { value: "normale", label: "Normale" },
                                { value: "basse", label: "Basse" },
                            ],
                            className: "w-[160px]",
                        },
                        {
                            type: "action",
                            label: "Inclure retards",
                            icon: AlertTriangle,
                            onClick: () => setIncludeRetard(!includeRetard),
                            active: includeRetard,
                            activeClassName: "bg-red-500 hover:bg-red-600",
                        },
                    ]}
                    onReset={resetFilters}
                />

                {/* Entretiens List */}
                {isLoading ? (
                    <GridSkeleton
                        itemCount={5}
                        gridColumns={{ default: 1 }}
                        gap={3}
                        itemHeight="h-[120px]"
                    />
                ) : filteredEntretiens.length === 0 ? (
                    <EmptyState
                        icon={CheckCircle}
                        title="Aucun entretien à planifier"
                        description="Tous vos équipements sont à jour pour la période sélectionnée"
                    />
                ) : (
                    <div className="space-y-6">
                        <PriorityGroupSection
                            title="En retard"
                            count={groupedEntretiens.enRetard.length}
                            icon={AlertTriangle}
                            iconClassName="text-red-500"
                            titleClassName="text-red-600"
                            items={groupedEntretiens.enRetard}
                            renderItem={(entretien) => (
                                <EntretienPlanifierCard
                                    entretien={entretien}
                                    onPlanifier={() => handlePlanifier(entretien)}
                                />
                            )}
                        />

                        <PriorityGroupSection
                            title="Critique"
                            count={groupedEntretiens.critique.length}
                            icon={Clock}
                            iconClassName="text-red-500"
                            titleClassName="text-red-600"
                            items={groupedEntretiens.critique}
                            renderItem={(entretien) => (
                                <EntretienPlanifierCard
                                    entretien={entretien}
                                    onPlanifier={() => handlePlanifier(entretien)}
                                />
                            )}
                        />

                        <PriorityGroupSection
                            title="Priorité haute"
                            count={groupedEntretiens.haute.length}
                            icon={Calendar}
                            iconClassName="text-orange-500"
                            titleClassName="text-orange-600"
                            items={groupedEntretiens.haute}
                            renderItem={(entretien) => (
                                <EntretienPlanifierCard
                                    entretien={entretien}
                                    onPlanifier={() => handlePlanifier(entretien)}
                                />
                            )}
                        />

                        <PriorityGroupSection
                            title="Priorité normale"
                            count={groupedEntretiens.normale.length}
                            icon={Calendar}
                            iconClassName="text-black/40"
                            titleClassName="text-black/70"
                            items={groupedEntretiens.normale}
                            renderItem={(entretien) => (
                                <EntretienPlanifierCard
                                    entretien={entretien}
                                    onPlanifier={() => handlePlanifier(entretien)}
                                />
                            )}
                        />

                        <PriorityGroupSection
                            title="Basse priorité"
                            count={groupedEntretiens.basse.length}
                            icon={Calendar}
                            iconClassName="text-black/30"
                            titleClassName="text-black/50"
                            items={groupedEntretiens.basse}
                            renderItem={(entretien) => (
                                <EntretienPlanifierCard
                                    entretien={entretien}
                                    onPlanifier={() => handlePlanifier(entretien)}
                                />
                            )}
                        />
                    </div>
                )}
            </div>
        </RouteGuard>
    );
}
