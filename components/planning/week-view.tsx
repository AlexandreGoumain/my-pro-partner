"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { usePlanningRange, type PlombierPlanning } from "@/hooks/use-interventions";
import { PRIORITE_LABELS, type Intervention, type PrioriteIntervention } from "@/lib/types/intervention";
import {
    addDays,
    format,
    startOfWeek,
    endOfWeek,
    isSameDay,
    isToday,
} from "date-fns";
import { fr } from "date-fns/locale";
import { Clock, MapPin } from "lucide-react";
import { useMemo } from "react";

interface WeekViewProps {
    selectedDate: Date;
    selectedPlombier?: string;
}

export function WeekView({ selectedDate, selectedPlombier }: WeekViewProps) {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });

    const startDateString = format(weekStart, "yyyy-MM-dd");
    const endDateString = format(weekEnd, "yyyy-MM-dd");

    const { data: plombiers = [], isLoading } = usePlanningRange(
        startDateString,
        endDateString,
        selectedPlombier !== "ALL" ? selectedPlombier : undefined
    );

    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    }, [weekStart]);

    const interventionsByDay = useMemo(() => {
        const byDay = new Map<string, Intervention[]>();

        weekDays.forEach((day) => {
            const dayKey = format(day, "yyyy-MM-dd");
            byDay.set(dayKey, []);
        });

        plombiers.forEach((plombier) => {
            plombier.interventions.forEach((intervention) => {
                if (intervention.datePrevisionnelle) {
                    const interventionDate = new Date(intervention.datePrevisionnelle);
                    const dayKey = format(interventionDate, "yyyy-MM-dd");
                    const existing = byDay.get(dayKey) || [];
                    existing.push(intervention);
                    byDay.set(dayKey, existing);
                }
            });
        });

        return byDay;
    }, [plombiers, weekDays]);

    const getPriorityColor = (priorite: PrioriteIntervention) => {
        switch (priorite) {
            case "CRITIQUE":
                return "border-l-2 border-l-red-500 bg-red-50";
            case "URGENTE":
                return "border-l-2 border-l-orange-500 bg-orange-50";
            case "NORMALE":
                return "border-l-2 border-l-gray-300 bg-white";
        }
    };

    const formatTime = (date: string) => {
        return new Date(date).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-7 gap-3">
                {[...Array(7)].map((_, i) => (
                    <Skeleton key={i} className="h-[400px] rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-7 gap-3">
            {weekDays.map((day) => {
                const dayKey = format(day, "yyyy-MM-dd");
                const interventions = interventionsByDay.get(dayKey) || [];
                const today = isToday(day);

                return (
                    <div
                        key={dayKey}
                        className={`rounded-xl border bg-white ${
                            today ? "border-black/20 shadow-md" : "border-black/8"
                        }`}
                    >
                        <div
                            className={`p-3 border-b ${
                                today
                                    ? "bg-black text-white border-black/20"
                                    : "bg-black/[0.02] border-black/8"
                            }`}
                        >
                            <p className="text-[11px] font-medium uppercase tracking-wide opacity-60">
                                {format(day, "EEEE", { locale: fr })}
                            </p>
                            <p className="text-[20px] font-bold tracking-tight">
                                {format(day, "d", { locale: fr })}
                            </p>
                        </div>

                        <div className="p-2 space-y-2 min-h-[300px] max-h-[400px] overflow-y-auto">
                            {interventions.length === 0 ? (
                                <p className="text-[12px] text-black/30 text-center py-4">
                                    Aucune intervention
                                </p>
                            ) : (
                                interventions
                                    .sort((a, b) => {
                                        if (!a.datePrevisionnelle) return 1;
                                        if (!b.datePrevisionnelle) return -1;
                                        return new Date(a.datePrevisionnelle).getTime() - new Date(b.datePrevisionnelle).getTime();
                                    })
                                    .map((intervention) => (
                                        <div
                                            key={intervention.id}
                                            className={`p-2.5 rounded-lg ${getPriorityColor(intervention.priorite)} hover:shadow-sm transition-all duration-200 cursor-pointer`}
                                        >
                                            {intervention.datePrevisionnelle && (
                                                <p className="text-[12px] font-semibold text-black mb-1">
                                                    {formatTime(intervention.datePrevisionnelle)}
                                                </p>
                                            )}
                                            <p className="text-[11px] text-black/80 font-medium line-clamp-2 mb-1">
                                                {intervention.client.prenom} {intervention.client.nom}
                                            </p>
                                            <p className="text-[10px] text-black/50 line-clamp-1">
                                                {intervention.description}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1.5 text-[10px] text-black/40">
                                                <MapPin className="w-3 h-3" strokeWidth={2} />
                                                <span className="truncate">{intervention.ville}</span>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
