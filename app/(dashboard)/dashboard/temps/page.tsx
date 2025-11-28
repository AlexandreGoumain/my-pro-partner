"use client";

import {
    TimeEntryCard,
    TimeEntryDialog,
    TimerWidget,
    TimesheetStats,
} from "@/components/temps";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchBar } from "@/components/ui/search-bar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCapabilities } from "@/hooks/use-capabilities";
import { useMissions } from "@/hooks/use-missions";
import { useDeleteTemps, useTemps, useTempsStats } from "@/hooks/use-temps";
import type { EntreeTemps, EntreeTempsFilters } from "@/lib/types/mission";
import {
    BarChart3,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    Download,
    Loader2,
    Plus,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

// Get week boundaries
function getWeekBoundaries(date: Date): { start: string; end: string } {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday

    const weekStart = new Date(d);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return {
        start: weekStart.toISOString().split("T")[0],
        end: weekEnd.toISOString().split("T")[0],
    };
}

// Format week range
function formatWeekRange(start: string, end: string): string {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const month = startDate.toLocaleDateString("fr-FR", { month: "long" });
    const year = startDate.getFullYear();

    return `${startDay} - ${endDay} ${month} ${year}`;
}

export default function TempsPage() {
    const { hasCapability } = useCapabilities();

    // Check capability
    const hasAccess = hasCapability("projets");

    // Week navigation state
    const [currentWeek, setCurrentWeek] = useState(() => {
        return getWeekBoundaries(new Date());
    });

    // Filters state
    const [filters, setFilters] = useState<EntreeTempsFilters>({
        dateDebut: currentWeek.start,
        dateFin: currentWeek.end,
    });
    const [searchQuery, setSearchQuery] = useState("");

    // Dialog states
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editEntry, setEditEntry] = useState<EntreeTemps | null>(null);
    const [deleteEntry, setDeleteEntry] = useState<EntreeTemps | null>(null);

    // Data
    const {
        data: entries = [],
        isLoading,
        error,
    } = useTemps(filters, { enabled: hasAccess });
    const { data: stats } = useTempsStats(30, { enabled: hasAccess });
    const { data: missions = [] } = useMissions(
        { statut: ["EN_COURS", "VALIDEE"] as any },
        { enabled: hasAccess }
    );
    const deleteTemps = useDeleteTemps();

    // Filter entries by search
    const filteredEntries = useMemo(() => {
        if (!searchQuery) return entries;

        const query = searchQuery.toLowerCase();
        return entries.filter(
            (entry) =>
                entry.description.toLowerCase().includes(query) ||
                entry.mission?.nom.toLowerCase().includes(query) ||
                entry.mission?.numero.toLowerCase().includes(query)
        );
    }, [entries, searchQuery]);

    // Group entries by date
    const entriesByDate = useMemo(() => {
        const grouped: Record<string, EntreeTemps[]> = {};

        filteredEntries.forEach((entry) => {
            const date = entry.date.split("T")[0];
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(entry);
        });

        // Sort by date descending
        return Object.entries(grouped).sort(
            ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
        );
    }, [filteredEntries]);

    // Week navigation
    const navigateWeek = (direction: "prev" | "next") => {
        const startDate = new Date(currentWeek.start);
        startDate.setDate(
            startDate.getDate() + (direction === "prev" ? -7 : 7)
        );
        const newWeek = getWeekBoundaries(startDate);
        setCurrentWeek(newWeek);
        setFilters((prev) => ({
            ...prev,
            dateDebut: newWeek.start,
            dateFin: newWeek.end,
        }));
    };

    const goToCurrentWeek = () => {
        const newWeek = getWeekBoundaries(new Date());
        setCurrentWeek(newWeek);
        setFilters((prev) => ({
            ...prev,
            dateDebut: newWeek.start,
            dateFin: newWeek.end,
        }));
    };

    // Handlers
    const handleEdit = (entry: EntreeTemps) => {
        setEditEntry(entry);
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteEntry) return;
        await deleteTemps.mutateAsync(deleteEntry.id);
        setDeleteEntry(null);
    };

    const handleDialogClose = (open: boolean) => {
        setDialogOpen(open);
        if (!open) {
            setEditEntry(null);
        }
    };

    // Calculate totals for the week
    const weekTotals = useMemo(() => {
        const total = entries.reduce((sum, e) => sum + e.duree, 0);
        const facturable = entries
            .filter((e) => e.facturable)
            .reduce((sum, e) => sum + e.duree, 0);
        return { total, facturable };
    }, [entries]);

    if (!hasAccess) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <Clock className="h-12 w-12 text-black/20 mx-auto mb-4" />
                    <h2 className="text-[18px] font-semibold text-black/80 mb-2">
                        Accès non disponible
                    </h2>
                    <p className="text-[14px] text-black/40">
                        Cette fonctionnalité n&apos;est pas activée pour votre
                        type d&apos;entreprise.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                        Suivi du temps
                    </h1>
                    <p className="text-[14px] text-black/40 mt-1">
                        Gérez vos entrées de temps et suivez votre productivité
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        asChild
                        className="h-11 px-4 text-[14px] font-medium border-black/10"
                    >
                        <Link href="/dashboard/temps/calendrier">
                            <Calendar className="h-4 w-4 mr-2" />
                            Calendrier
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        asChild
                        className="h-11 px-4 text-[14px] font-medium border-black/10"
                    >
                        <Link href="/dashboard/temps/rapports">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Rapports
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            const params = new URLSearchParams();
                            if (currentWeek.start)
                                params.append("dateDebut", currentWeek.start);
                            if (currentWeek.end)
                                params.append("dateFin", currentWeek.end);
                            if (filters.missionId)
                                params.append("missionId", filters.missionId);
                            window.open(
                                `/api/temps/export?${params.toString()}`,
                                "_blank"
                            );
                        }}
                        className="h-11 px-4 text-[14px] font-medium border-black/10"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Exporter
                    </Button>
                    <Button
                        onClick={() => setDialogOpen(true)}
                        className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Saisir du temps
                    </Button>
                </div>
            </div>

            {/* Timer widget */}
            <TimerWidget missions={missions} />

            {/* Stats */}
            {stats && <TimesheetStats stats={stats} />}

            {/* Week navigation */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigateWeek("prev")}
                        className="h-9 w-9 border-black/10"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigateWeek("next")}
                        className="h-9 w-9 border-black/10"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        onClick={goToCurrentWeek}
                        className="h-9 px-3 text-[13px] border-black/10"
                    >
                        <Calendar className="h-4 w-4 mr-2" />
                        Cette semaine
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-[14px] font-medium text-black/80">
                        {formatWeekRange(currentWeek.start, currentWeek.end)}
                    </div>
                    <div className="text-[13px] text-black/40">
                        {Math.floor(weekTotals.total / 60)}h{" "}
                        {weekTotals.total % 60}min trackées
                        <span className="mx-2">•</span>
                        {Math.floor(weekTotals.facturable / 60)}h{" "}
                        {weekTotals.facturable % 60}min facturables
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Rechercher..."
                    className="flex-1 max-w-sm"
                />

                <Select
                    value={filters.missionId || "ALL"}
                    onValueChange={(value) =>
                        setFilters((prev) => ({
                            ...prev,
                            missionId: value === "ALL" ? undefined : value,
                        }))
                    }
                >
                    <SelectTrigger className="h-11 w-[200px]">
                        <SelectValue placeholder="Toutes les missions" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Toutes les missions</SelectItem>
                        {missions.map((mission) => (
                            <SelectItem key={mission.id} value={mission.id}>
                                {mission.numero} - {mission.nom}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Entries list */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-black/20" />
                </div>
            ) : error ? (
                <div className="text-center py-12">
                    <p className="text-[14px] text-red-500">
                        Erreur lors du chargement des entrées
                    </p>
                </div>
            ) : entriesByDate.length === 0 ? (
                <EmptyState
                    icon={Clock}
                    title="Aucune entrée"
                    description={
                        searchQuery || filters.missionId
                            ? "Aucune entrée ne correspond à vos critères"
                            : "Commencez à tracker votre temps"
                    }
                    action={
                        !searchQuery && !filters.missionId
                            ? {
                                  label: "Saisir du temps",
                                  onClick: () => setDialogOpen(true),
                                  icon: Plus,
                              }
                            : undefined
                    }
                    variant="minimal"
                />
            ) : (
                <div className="space-y-6">
                    {entriesByDate.map(([date, dayEntries]) => {
                        const dayTotal = dayEntries.reduce(
                            (sum, e) => sum + e.duree,
                            0
                        );
                        const formattedDate = new Date(date).toLocaleDateString(
                            "fr-FR",
                            {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                            }
                        );

                        return (
                            <div key={date}>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-[14px] font-medium text-black/80 capitalize">
                                        {formattedDate}
                                    </h3>
                                    <span className="text-[13px] text-black/40">
                                        {Math.floor(dayTotal / 60)}h{" "}
                                        {dayTotal % 60}min
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {dayEntries.map((entry) => (
                                        <TimeEntryCard
                                            key={entry.id}
                                            entry={entry}
                                            onEdit={handleEdit}
                                            onDelete={(e) => setDeleteEntry(e)}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create/Edit dialog */}
            <TimeEntryDialog
                open={dialogOpen}
                onOpenChange={handleDialogClose}
                missions={missions}
                entry={editEntry}
            />

            {/* Delete confirmation */}
            <AlertDialog
                open={!!deleteEntry}
                onOpenChange={(open) => !open && setDeleteEntry(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Supprimer l&apos;entrée ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. L&apos;entrée de
                            temps sera définitivement supprimée.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleteTemps.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Supprimer"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
