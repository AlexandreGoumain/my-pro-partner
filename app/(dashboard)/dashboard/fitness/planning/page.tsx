"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useSallesFitness, useSeances } from "@/hooks/use-fitness";
import {
    STATUT_SEANCE_LABELS,
    type SalleFitness,
    type SeanceCours,
    type StatutSeanceCours,
} from "@/lib/types/fitness";
import {
    addWeeks,
    eachDayOfInterval,
    endOfWeek,
    format,
    isToday,
    startOfWeek,
    subWeeks,
} from "date-fns";
import { fr } from "date-fns/locale";
import {
    ChevronLeft,
    ChevronRight,
    MapPin,
    Plus,
    User,
    Users,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function PlanningPage() {
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [salleFilter, setSalleFilter] = useState<string>("ALL");

    const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const { data: seancesData, isLoading } = useSeances({
        dateDebut: weekStart.toISOString(),
        dateFin: weekEnd.toISOString(),
        salleId: salleFilter === "ALL" ? undefined : salleFilter,
    });
    const seances = seancesData?.data || [];

    const { data: salles } = useSallesFitness({ actif: true });

    const getStatutColor = (statut: StatutSeanceCours) => {
        const colors: Record<StatutSeanceCours, string> = {
            PLANIFIEE: "bg-black/5 text-black/60",
            EN_COURS: "bg-green-100 text-green-800",
            TERMINEE: "bg-black/5 text-black/40",
            ANNULEE: "bg-red-100 text-red-800",
            COMPLETE: "bg-yellow-100 text-yellow-800",
        };
        return colors[statut];
    };

    // Group séances by day
    const seancesByDay = useMemo(() => {
        if (!seances.length) return {} as Record<string, SeanceCours[]>;
        return seances.reduce(
            (acc: Record<string, SeanceCours[]>, seance: SeanceCours) => {
                const date = new Date(seance.dateHeure);
                const dayKey = format(date, "yyyy-MM-dd");
                if (!acc[dayKey]) acc[dayKey] = [];
                acc[dayKey].push(seance);
                return acc;
            },
            {} as Record<string, SeanceCours[]>
        );
    }, [seances]);

    return (
        <RouteGuard capability="planning_fitness">
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Planning"
                    description="Planifiez vos séances et cours collectifs"
                    actions={
                        <PrimaryActionButton>
                            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                            Nouvelle séance
                        </PrimaryActionButton>
                    }
                />

                {/* Navigation semaine */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 border-black/10"
                            onClick={() =>
                                setCurrentWeek(subWeeks(currentWeek, 1))
                            }
                        >
                            <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 border-black/10"
                            onClick={() =>
                                setCurrentWeek(addWeeks(currentWeek, 1))
                            }
                        >
                            <ChevronRight className="w-4 h-4" strokeWidth={2} />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-10 border-black/10"
                            onClick={() => setCurrentWeek(new Date())}
                        >
                            Aujourd'hui
                        </Button>
                        <h2 className="text-[16px] font-medium text-black ml-2">
                            {format(weekStart, "d MMMM", { locale: fr })} -{" "}
                            {format(weekEnd, "d MMMM yyyy", { locale: fr })}
                        </h2>
                    </div>

                    <Select value={salleFilter} onValueChange={setSalleFilter}>
                        <SelectTrigger className="w-[200px] h-10 border-black/10 bg-white">
                            <SelectValue placeholder="Filtrer par salle" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">
                                Toutes les salles
                            </SelectItem>
                            {salles?.map((salle: SalleFitness) => (
                                <SelectItem key={salle.id} value={salle.id}>
                                    {salle.nom}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Grille planning */}
                <div className="border border-black/10 rounded-xl overflow-hidden bg-white">
                    {/* Header jours */}
                    <div className="grid grid-cols-7 border-b border-black/10">
                        {weekDays.map((day) => (
                            <div
                                key={day.toISOString()}
                                className={`p-3 text-center border-r border-black/5 last:border-r-0 ${
                                    isToday(day) ? "bg-black/5" : ""
                                }`}
                            >
                                <p className="text-[12px] text-black/40 uppercase">
                                    {format(day, "EEE", { locale: fr })}
                                </p>
                                <p
                                    className={`text-[18px] font-semibold ${
                                        isToday(day)
                                            ? "text-black"
                                            : "text-black/80"
                                    }`}
                                >
                                    {format(day, "d")}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Contenu */}
                    {isLoading ? (
                        <div className="p-4">
                            <Skeleton className="h-[400px] w-full" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-7 min-h-[500px]">
                            {weekDays.map((day) => {
                                const dayKey = format(day, "yyyy-MM-dd");
                                const daySeances = seancesByDay[dayKey] || [];

                                return (
                                    <div
                                        key={day.toISOString()}
                                        className={`border-r border-black/5 last:border-r-0 p-2 space-y-2 ${
                                            isToday(day) ? "bg-black/2" : ""
                                        }`}
                                    >
                                        {daySeances.length > 0 ? (
                                            daySeances
                                                .sort(
                                                    (a, b) =>
                                                        new Date(
                                                            a.dateHeure
                                                        ).getTime() -
                                                        new Date(
                                                            b.dateHeure
                                                        ).getTime()
                                                )
                                                .map((seance) => (
                                                    <Card
                                                        key={seance.id}
                                                        className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                                        style={{
                                                            borderLeft: `3px solid ${seance.cours?.couleur || "#000"}`,
                                                        }}
                                                    >
                                                        <CardContent className="p-2">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-[11px] font-medium text-black/60">
                                                                    {format(
                                                                        new Date(
                                                                            seance.dateHeure
                                                                        ),
                                                                        "HH:mm"
                                                                    )}
                                                                </span>
                                                                <Badge
                                                                    className={`text-[9px] px-1.5 py-0 ${getStatutColor(seance.statut)}`}
                                                                >
                                                                    {
                                                                        STATUT_SEANCE_LABELS[
                                                                            seance
                                                                                .statut
                                                                        ]
                                                                    }
                                                                </Badge>
                                                            </div>
                                                            <p className="text-[12px] font-semibold text-black line-clamp-1">
                                                                {
                                                                    seance.cours
                                                                        ?.nom
                                                                }
                                                            </p>
                                                            <div className="mt-1.5 space-y-0.5">
                                                                {seance.instructeur && (
                                                                    <div className="flex items-center gap-1 text-[10px] text-black/50">
                                                                        <User
                                                                            className="w-2.5 h-2.5"
                                                                            strokeWidth={
                                                                                2
                                                                            }
                                                                        />
                                                                        <span className="line-clamp-1">
                                                                            {
                                                                                seance
                                                                                    .instructeur
                                                                                    .prenom
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {seance.salle && (
                                                                    <div className="flex items-center gap-1 text-[10px] text-black/50">
                                                                        <MapPin
                                                                            className="w-2.5 h-2.5"
                                                                            strokeWidth={
                                                                                2
                                                                            }
                                                                        />
                                                                        <span className="line-clamp-1">
                                                                            {
                                                                                seance
                                                                                    .salle
                                                                                    .nom
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center gap-1 text-[10px] text-black/50">
                                                                    <Users
                                                                        className="w-2.5 h-2.5"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                    />
                                                                    <span>
                                                                        {
                                                                            seance.placesReservees
                                                                        }
                                                                        /
                                                                        {seance.capaciteMax ||
                                                                            seance
                                                                                .cours
                                                                                ?.capaciteMax}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))
                                        ) : (
                                            <div className="h-full min-h-[100px] flex items-center justify-center">
                                                <span className="text-[11px] text-black/20">
                                                    Aucune séance
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Légende */}
                <div className="flex items-center gap-6 text-[12px] text-black/50">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-black/5" />
                        <span>Planifiée</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-green-100" />
                        <span>En cours</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-yellow-100" />
                        <span>Complète</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-red-100" />
                        <span>Annulée</span>
                    </div>
                </div>
            </div>
        </RouteGuard>
    );
}
