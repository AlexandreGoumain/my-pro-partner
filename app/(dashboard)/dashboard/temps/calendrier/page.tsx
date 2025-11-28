"use client";

import {
    TimeEntryCard,
    TimeEntryDialog,
    TimesheetCalendar,
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
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCapabilities } from "@/hooks/use-capabilities";
import { useMissions } from "@/hooks/use-missions";
import { useDeleteTemps, useTemps } from "@/hooks/use-temps";
import type { EntreeTemps, EntreeTempsFilters } from "@/lib/types/mission";
import { ArrowLeft, Calendar, Clock, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

// Get month boundaries
function getMonthBoundaries(date: Date): { start: string; end: string } {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return {
        start: firstDay.toISOString().split("T")[0],
        end: lastDay.toISOString().split("T")[0],
    };
}

export default function CalendrierTempsPage() {
    const { hasCapability } = useCapabilities();
    const hasAccess = hasCapability("projets");

    // Month state
    const [currentMonth, setCurrentMonth] = useState(() => {
        return getMonthBoundaries(new Date());
    });

    // Filters
    const [filters, setFilters] = useState<EntreeTempsFilters>({
        dateDebut: currentMonth.start,
        dateFin: currentMonth.end,
    });

    // Selected date for detail view
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

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
    const { data: missions = [] } = useMissions(
        { statut: ["EN_COURS", "VALIDEE"] as any },
        { enabled: hasAccess }
    );
    const deleteTemps = useDeleteTemps();

    // Filter entries by selected date
    const selectedDateEntries = useMemo(() => {
        if (!selectedDate) return [];
        return entries.filter((entry) => {
            const entryDate = new Date(entry.date).toISOString().split("T")[0];
            return entryDate === selectedDate;
        });
    }, [entries, selectedDate]);

    // Update filters when calendar navigates
    const handleCalendarMonthChange = (date: Date) => {
        const newMonth = getMonthBoundaries(date);
        setCurrentMonth(newMonth);
        setFilters((prev) => ({
            ...prev,
            dateDebut: newMonth.start,
            dateFin: newMonth.end,
        }));
    };

    // Handlers
    const handleDateClick = (date: string) => {
        setSelectedDate(date === selectedDate ? null : date);
    };

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

    // Format selected date
    const formatSelectedDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    if (!hasAccess) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <Calendar className="h-12 w-12 text-black/20 mx-auto mb-4" />
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
                    <Link
                        href="/dashboard/temps"
                        className="inline-flex items-center text-[13px] text-black/50 hover:text-black mb-2"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Retour au suivi du temps
                    </Link>
                    <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                        Vue calendrier
                    </h1>
                    <p className="text-[14px] text-black/40 mt-1">
                        Visualisez votre temps tracké sur le mois
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Select
                        value={filters.missionId || "ALL"}
                        onValueChange={(value) =>
                            setFilters((prev) => ({
                                ...prev,
                                missionId: value === "ALL" ? undefined : value,
                            }))
                        }
                    >
                        <SelectTrigger className="h-10 w-[200px]">
                            <SelectValue placeholder="Toutes les missions" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">
                                Toutes les missions
                            </SelectItem>
                            {missions.map((mission) => (
                                <SelectItem key={mission.id} value={mission.id}>
                                    {mission.numero} - {mission.nom}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        onClick={() => setDialogOpen(true)}
                        className="h-10 px-4 text-[14px] font-medium bg-black hover:bg-black/90"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Saisir du temps
                    </Button>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-black/20" />
                </div>
            ) : error ? (
                <div className="text-center py-20">
                    <p className="text-[14px] text-red-500">
                        Erreur lors du chargement des entrées
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Calendar */}
                    <div className="lg:col-span-2">
                        <TimesheetCalendar
                            entries={entries}
                            onDateClick={handleDateClick}
                        />
                    </div>

                    {/* Selected date detail */}
                    <div className="lg:col-span-1">
                        <Card className="p-5 border-black/8 sticky top-6">
                            {selectedDate ? (
                                <>
                                    <h3 className="text-[15px] font-medium text-black/80 mb-1 capitalize">
                                        {formatSelectedDate(selectedDate)}
                                    </h3>
                                    <p className="text-[13px] text-black/40 mb-4">
                                        {selectedDateEntries.length} entrée
                                        {selectedDateEntries.length !== 1
                                            ? "s"
                                            : ""}
                                    </p>

                                    {selectedDateEntries.length > 0 ? (
                                        <div className="space-y-2">
                                            {selectedDateEntries.map(
                                                (entry) => (
                                                    <TimeEntryCard
                                                        key={entry.id}
                                                        entry={entry}
                                                        onEdit={handleEdit}
                                                        onDelete={(e) =>
                                                            setDeleteEntry(e)
                                                        }
                                                    />
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <EmptyState
                                            icon={Clock}
                                            title="Aucune entrée ce jour"
                                            action={{
                                                label: "Ajouter",
                                                onClick: () => setDialogOpen(true),
                                                icon: Plus,
                                            }}
                                            variant="minimal"
                                            iconSize="sm"
                                            textSize="sm"
                                        />
                                    )}
                                </>
                            ) : (
                                <EmptyState
                                    icon={Calendar}
                                    title="Cliquez sur un jour"
                                    description="pour voir les détails"
                                    variant="minimal"
                                    iconSize="sm"
                                    textSize="sm"
                                />
                            )}
                        </Card>
                    </div>
                </div>
            )}

            {/* Create/Edit dialog */}
            <TimeEntryDialog
                open={dialogOpen}
                onOpenChange={handleDialogClose}
                missions={missions}
                entry={editEntry}
                defaultDate={selectedDate || undefined}
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
