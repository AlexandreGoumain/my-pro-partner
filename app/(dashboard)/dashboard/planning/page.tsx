"use client";

import { DayView } from "@/components/planning/day-view";
import { MonthView } from "@/components/planning/month-view";
import { TourneeDialog } from "@/components/planning/tournee-dialog";
import { ViewToggle } from "@/components/planning/view-toggle";
import { WeekView } from "@/components/planning/week-view";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { RouteGuard } from "@/components/ui/route-guard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { StatCard } from "@/components/ui/stat-card";
import { useCapabilities } from "@/hooks/use-capabilities";
import { usePlanningRange, type CalendarView } from "@/hooks/use-interventions";
import {
    addMonths,
    addWeeks,
    endOfMonth,
    endOfWeek,
    format,
    startOfMonth,
    startOfWeek,
    subMonths,
    subWeeks,
} from "date-fns";
import { fr } from "date-fns/locale";
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    Plus,
    User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// Labels dynamiques selon le type de business
const PLANNING_LABELS = {
    GARAGE: {
        title: "Planning Atelier",
        description: "Organisation des réparations par mécanicien",
        newButton: "Planifier une intervention",
        technicianLabel: "Mécaniciens actifs",
        technicianSubLabel: "mécaniciens à l'atelier",
        locationsLabel: "Véhicules",
        locationsSubLabel: "en intervention",
    },
    DEFAULT: {
        title: "Planning & Tournées",
        description: "Organisation des interventions par technicien",
        newButton: "Planifier une tournée",
        technicianLabel: "Techniciens actifs",
        technicianSubLabel: "techniciens sur le terrain",
        locationsLabel: "Villes couvertes",
        locationsSubLabel: "zones d'intervention",
    },
} as const;

export default function PlanningPage() {
    const { businessType } = useCapabilities();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedPlombier, setSelectedPlombier] = useState<string>("ALL");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [view, setView] = useState<CalendarView>("day");
    const [plombiersForDialog, setPlombiersForDialog] = useState<
        { id: string; name: string | null }[]
    >([]);

    // Calculate date range based on view
    const dateRange = useMemo(() => {
        if (view === "day") {
            return {
                start: format(selectedDate, "yyyy-MM-dd"),
                end: format(selectedDate, "yyyy-MM-dd"),
            };
        } else if (view === "week") {
            const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
            const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
            return {
                start: format(start, "yyyy-MM-dd"),
                end: format(end, "yyyy-MM-dd"),
            };
        } else {
            const start = startOfMonth(selectedDate);
            const end = endOfMonth(selectedDate);
            return {
                start: format(start, "yyyy-MM-dd"),
                end: format(end, "yyyy-MM-dd"),
            };
        }
    }, [selectedDate, view]);

    // Fetch data for stats
    const { data: plombiers = [] } = usePlanningRange(
        dateRange.start,
        dateRange.end,
        selectedPlombier !== "ALL" ? selectedPlombier : undefined
    );

    // Extract plombiers list for dialog
    useEffect(() => {
        if (plombiers.length > 0) {
            setPlombiersForDialog(
                plombiers.map((p) => ({ id: p.id, name: p.name }))
            );
        }
    }, [plombiers]);

    const navigate = (direction: "prev" | "next") => {
        if (view === "day") {
            const newDate = new Date(selectedDate);
            newDate.setDate(
                newDate.getDate() + (direction === "next" ? 1 : -1)
            );
            setSelectedDate(newDate);
        } else if (view === "week") {
            setSelectedDate(
                direction === "next"
                    ? addWeeks(selectedDate, 1)
                    : subWeeks(selectedDate, 1)
            );
        } else {
            setSelectedDate(
                direction === "next"
                    ? addMonths(selectedDate, 1)
                    : subMonths(selectedDate, 1)
            );
        }
    };

    const goToToday = () => {
        setSelectedDate(new Date());
    };

    const getDateLabel = () => {
        if (view === "day") {
            return format(selectedDate, "EEEE d MMMM yyyy", { locale: fr });
        } else if (view === "week") {
            const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
            const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
            return `${format(start, "d MMM", { locale: fr })} - ${format(end, "d MMM yyyy", { locale: fr })}`;
        } else {
            return format(selectedDate, "MMMM yyyy", { locale: fr });
        }
    };

    const stats = useMemo(() => {
        const totalInterventions = plombiers.reduce(
            (sum, p) => sum + p.interventionsCount,
            0
        );
        const plombiersActifs = plombiers.filter(
            (p) => p.interventionsCount > 0
        ).length;
        const totalHeuresEstimees = plombiers.reduce((sum, p) => {
            return (
                sum +
                p.interventions.reduce(
                    (s, i) => s + ((i as any).dureeEstimeeH || 0),
                    0
                )
            );
        }, 0);
        const villesCouvertes = new Set(
            plombiers.flatMap((p) => p.interventions.map((i) => i.ville))
        ).size;

        return {
            totalInterventions,
            plombiersActifs,
            totalHeuresEstimees,
            villesCouvertes,
        };
    }, [plombiers]);

    // Labels dynamiques selon le business type
    const labels =
        PLANNING_LABELS[businessType as keyof typeof PLANNING_LABELS] ||
        PLANNING_LABELS.DEFAULT;

    return (
        <RouteGuard anyCapability={["domicile", "atelier"]}>
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title={labels.title}
                    description={labels.description}
                    actions={
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={goToToday}
                                variant="outline"
                                className="h-11 px-6 border-black/10 hover:bg-black/5"
                            >
                                Aujourd&apos;hui
                            </Button>
                            <PrimaryActionButton
                                onClick={() => setDialogOpen(true)}
                            >
                                <Plus
                                    className="w-4 h-4 mr-2"
                                    strokeWidth={2}
                                />
                                {labels.newButton}
                            </PrimaryActionButton>
                        </div>
                    }
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        icon={Calendar}
                        label="Interventions"
                        value={stats.totalInterventions}
                        description={
                            view === "day"
                                ? "planifiées ce jour"
                                : view === "week"
                                  ? "cette semaine"
                                  : "ce mois"
                        }
                    />
                    <StatCard
                        icon={User}
                        label={labels.technicianLabel}
                        value={stats.plombiersActifs}
                        description={labels.technicianSubLabel}
                    />
                    <StatCard
                        icon={Clock}
                        label="Heures estimées"
                        value={`${stats.totalHeuresEstimees.toFixed(1)}h`}
                        description="durée totale estimée"
                    />
                    <StatCard
                        icon={MapPin}
                        label={labels.locationsLabel}
                        value={stats.villesCouvertes}
                        description={labels.locationsSubLabel}
                    />
                </div>

                {/* Date Navigation & Filters */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => navigate("prev")}
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 border-black/10 hover:bg-black/5"
                        >
                            <ChevronLeft className="w-5 h-5" strokeWidth={2} />
                        </Button>

                        <div className="px-6 py-2.5 rounded-lg bg-white border border-black/8 flex items-center gap-3 min-w-[280px] justify-center">
                            <Calendar
                                className="w-5 h-5 text-black/60"
                                strokeWidth={2}
                            />
                            <span className="text-[15px] font-semibold text-black capitalize">
                                {getDateLabel()}
                            </span>
                        </div>

                        <Button
                            onClick={() => navigate("next")}
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 border-black/10 hover:bg-black/5"
                        >
                            <ChevronRight className="w-5 h-5" strokeWidth={2} />
                        </Button>
                    </div>

                    <div className="flex items-center gap-3">
                        <ViewToggle view={view} onViewChange={setView} />

                        <Select
                            value={selectedPlombier}
                            onValueChange={setSelectedPlombier}
                        >
                            <SelectTrigger className="w-[220px] h-11 border-black/10 bg-white">
                                <SelectValue placeholder="Tous les techniciens" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">
                                    Tous les techniciens
                                </SelectItem>
                                {plombiersForDialog.map((plombier) => (
                                    <SelectItem
                                        key={plombier.id}
                                        value={plombier.id}
                                    >
                                        {plombier.name || "Sans nom"}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Planning Views */}
                <div>
                    {view === "day" && (
                        <DayView
                            selectedDate={selectedDate}
                            selectedPlombier={selectedPlombier}
                            onNewIntervention={() => setDialogOpen(true)}
                        />
                    )}
                    {view === "week" && (
                        <WeekView
                            selectedDate={selectedDate}
                            selectedPlombier={selectedPlombier}
                        />
                    )}
                    {view === "month" && (
                        <MonthView
                            selectedDate={selectedDate}
                            selectedPlombier={selectedPlombier}
                            onDayClick={(date) => {
                                setSelectedDate(date);
                                setView("day");
                            }}
                        />
                    )}
                </div>

                {/* Create Tournée Dialog */}
                <TourneeDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSuccess={() => setDialogOpen(false)}
                    defaultDate={selectedDate}
                    plombiers={plombiersForDialog}
                />
            </div>
        </RouteGuard>
    );
}
