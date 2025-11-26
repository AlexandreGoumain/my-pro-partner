"use client";

import { EntretienPlanifierCard } from "@/components/equipements/entretien-planifier-card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { RouteGuard } from "@/components/ui/route-guard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
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
    Filter,
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
                <div className="flex flex-wrap items-center gap-3">
                    <Select
                        value={String(joursFilter)}
                        onValueChange={(value) =>
                            setJoursFilter(parseInt(value))
                        }
                    >
                        <SelectTrigger className="w-[180px] h-11 border-black/10 bg-white">
                            <SelectValue placeholder="Période" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7">7 prochains jours</SelectItem>
                            <SelectItem value="14">
                                14 prochains jours
                            </SelectItem>
                            <SelectItem value="30">
                                30 prochains jours
                            </SelectItem>
                            <SelectItem value="60">
                                60 prochains jours
                            </SelectItem>
                            <SelectItem value="90">
                                90 prochains jours
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={typeFilter}
                        onValueChange={(value) =>
                            setTypeFilter(value as TypeFilter)
                        }
                    >
                        <SelectTrigger className="w-[180px] h-11 border-black/10 bg-white">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tous les types</SelectItem>
                            <SelectItem value="CONTROLE_ANNUEL">
                                Contrôle annuel
                            </SelectItem>
                            <SelectItem value="ENTRETIEN">Entretien</SelectItem>
                            <SelectItem value="GARANTIE_EXPIRE">
                                Garantie expire
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={prioriteFilter}
                        onValueChange={(value) =>
                            setPrioriteFilter(value as PrioriteFilter)
                        }
                    >
                        <SelectTrigger className="w-[160px] h-11 border-black/10 bg-white">
                            <SelectValue placeholder="Priorité" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">
                                Toutes priorités
                            </SelectItem>
                            <SelectItem value="critique">Critique</SelectItem>
                            <SelectItem value="haute">Haute</SelectItem>
                            <SelectItem value="normale">Normale</SelectItem>
                            <SelectItem value="basse">Basse</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        variant={includeRetard ? "default" : "outline"}
                        className={
                            includeRetard
                                ? "h-11 px-4 bg-red-500 hover:bg-red-600"
                                : "h-11 px-4 border-black/10 hover:bg-black/5"
                        }
                        onClick={() => setIncludeRetard(!includeRetard)}
                    >
                        <AlertTriangle
                            className="w-4 h-4 mr-2"
                            strokeWidth={2}
                        />
                        Inclure retards
                    </Button>

                    <Button
                        variant="outline"
                        className="h-11 px-6 border-black/10 hover:bg-black/5"
                        onClick={resetFilters}
                    >
                        <Filter className="w-4 h-4 mr-2" strokeWidth={2} />
                        Réinitialiser
                    </Button>
                </div>

                {/* Entretiens List */}
                {isLoading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton
                                key={i}
                                className="h-[120px] rounded-xl"
                            />
                        ))}
                    </div>
                ) : filteredEntretiens.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-black/8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                            <CheckCircle
                                className="w-8 h-8 text-emerald-500"
                                strokeWidth={2}
                            />
                        </div>
                        <h3 className="text-[16px] font-semibold text-black mb-1">
                            Aucun entretien à planifier
                        </h3>
                        <p className="text-[14px] text-black/40">
                            Tous vos équipements sont à jour pour la période
                            sélectionnée
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* En retard */}
                        {groupedEntretiens.enRetard.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertTriangle
                                        className="w-4 h-4 text-red-500"
                                        strokeWidth={2}
                                    />
                                    <h2 className="text-[14px] font-semibold text-red-600">
                                        En retard (
                                        {groupedEntretiens.enRetard.length})
                                    </h2>
                                </div>
                                <div className="space-y-3">
                                    {groupedEntretiens.enRetard.map(
                                        (entretien) => (
                                            <EntretienPlanifierCard
                                                key={entretien.id}
                                                entretien={entretien}
                                                onPlanifier={() =>
                                                    handlePlanifier(entretien)
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Critique */}
                        {groupedEntretiens.critique.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock
                                        className="w-4 h-4 text-red-500"
                                        strokeWidth={2}
                                    />
                                    <h2 className="text-[14px] font-semibold text-red-600">
                                        Critique (
                                        {groupedEntretiens.critique.length})
                                    </h2>
                                </div>
                                <div className="space-y-3">
                                    {groupedEntretiens.critique.map(
                                        (entretien) => (
                                            <EntretienPlanifierCard
                                                key={entretien.id}
                                                entretien={entretien}
                                                onPlanifier={() =>
                                                    handlePlanifier(entretien)
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Haute priorité */}
                        {groupedEntretiens.haute.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-3">
                                    <Calendar
                                        className="w-4 h-4 text-orange-500"
                                        strokeWidth={2}
                                    />
                                    <h2 className="text-[14px] font-semibold text-orange-600">
                                        Priorité haute (
                                        {groupedEntretiens.haute.length})
                                    </h2>
                                </div>
                                <div className="space-y-3">
                                    {groupedEntretiens.haute.map(
                                        (entretien) => (
                                            <EntretienPlanifierCard
                                                key={entretien.id}
                                                entretien={entretien}
                                                onPlanifier={() =>
                                                    handlePlanifier(entretien)
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Priorité normale */}
                        {groupedEntretiens.normale.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-3">
                                    <Calendar
                                        className="w-4 h-4 text-black/40"
                                        strokeWidth={2}
                                    />
                                    <h2 className="text-[14px] font-semibold text-black/70">
                                        Priorité normale (
                                        {groupedEntretiens.normale.length})
                                    </h2>
                                </div>
                                <div className="space-y-3">
                                    {groupedEntretiens.normale.map(
                                        (entretien) => (
                                            <EntretienPlanifierCard
                                                key={entretien.id}
                                                entretien={entretien}
                                                onPlanifier={() =>
                                                    handlePlanifier(entretien)
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Basse priorité */}
                        {groupedEntretiens.basse.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-3">
                                    <Calendar
                                        className="w-4 h-4 text-black/30"
                                        strokeWidth={2}
                                    />
                                    <h2 className="text-[14px] font-semibold text-black/50">
                                        Basse priorité (
                                        {groupedEntretiens.basse.length})
                                    </h2>
                                </div>
                                <div className="space-y-3">
                                    {groupedEntretiens.basse.map(
                                        (entretien) => (
                                            <EntretienPlanifierCard
                                                key={entretien.id}
                                                entretien={entretien}
                                                onPlanifier={() =>
                                                    handlePlanifier(entretien)
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </RouteGuard>
    );
}
