"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { usePlanningRange, type PlombierPlanning } from "@/hooks/use-interventions";
import { type Intervention, type PrioriteIntervention } from "@/lib/types/intervention";
import {
    addDays,
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameDay,
    isSameMonth,
    isToday,
} from "date-fns";
import { fr } from "date-fns/locale";
import { useMemo } from "react";

interface MonthViewProps {
    selectedDate: Date;
    selectedPlombier?: string;
    onDayClick?: (date: Date) => void;
}

export function MonthView({ selectedDate, selectedPlombier, onDayClick }: MonthViewProps) {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const startDateString = format(calendarStart, "yyyy-MM-dd");
    const endDateString = format(calendarEnd, "yyyy-MM-dd");

    const { data: plombiers = [], isLoading } = usePlanningRange(
        startDateString,
        endDateString,
        selectedPlombier !== "ALL" ? selectedPlombier : undefined
    );

    const calendarDays = useMemo(() => {
        const days: Date[] = [];
        let currentDay = calendarStart;

        while (currentDay <= calendarEnd) {
            days.push(currentDay);
            currentDay = addDays(currentDay, 1);
        }

        return days;
    }, [calendarStart, calendarEnd]);

    const interventionsByDay = useMemo(() => {
        const byDay = new Map<string, Intervention[]>();

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
    }, [plombiers]);

    const getPriorityDot = (priorite: PrioriteIntervention) => {
        switch (priorite) {
            case "CRITIQUE":
                return "bg-red-500";
            case "URGENTE":
                return "bg-orange-500";
            case "NORMALE":
                return "bg-gray-400";
        }
    };

    const weekDayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

    if (isLoading) {
        return <Skeleton className="h-[600px] rounded-xl" />;
    }

    return (
        <div className="rounded-xl border border-black/8 bg-white overflow-hidden">
            {/* Header with day names */}
            <div className="grid grid-cols-7 border-b border-black/8 bg-black/[0.02]">
                {weekDayNames.map((day) => (
                    <div
                        key={day}
                        className="p-3 text-center text-[12px] font-semibold text-black/50 uppercase tracking-wide"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => {
                    const dayKey = format(day, "yyyy-MM-dd");
                    const interventions = interventionsByDay.get(dayKey) || [];
                    const isCurrentMonth = isSameMonth(day, selectedDate);
                    const today = isToday(day);
                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                    // Count by priority
                    const critiques = interventions.filter((i) => i.priorite === "CRITIQUE").length;
                    const urgentes = interventions.filter((i) => i.priorite === "URGENTE").length;
                    const normales = interventions.filter((i) => i.priorite === "NORMALE").length;

                    return (
                        <div
                            key={dayKey}
                            onClick={() => onDayClick?.(day)}
                            className={`min-h-[100px] p-2 border-b border-r border-black/8 transition-all duration-200 cursor-pointer hover:bg-black/[0.02] ${
                                !isCurrentMonth ? "bg-black/[0.02]" : ""
                            } ${isWeekend && isCurrentMonth ? "bg-black/[0.01]" : ""}`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span
                                    className={`w-7 h-7 flex items-center justify-center text-[13px] font-medium rounded-full ${
                                        today
                                            ? "bg-black text-white"
                                            : isCurrentMonth
                                              ? "text-black"
                                              : "text-black/30"
                                    }`}
                                >
                                    {format(day, "d")}
                                </span>
                                {interventions.length > 0 && (
                                    <span className="text-[11px] font-medium text-black/40">
                                        {interventions.length}
                                    </span>
                                )}
                            </div>

                            {interventions.length > 0 && (
                                <div className="space-y-1">
                                    {/* Show first 3 interventions */}
                                    {interventions.slice(0, 3).map((intervention) => (
                                        <div
                                            key={intervention.id}
                                            className={`px-1.5 py-1 rounded text-[10px] font-medium truncate ${
                                                intervention.priorite === "CRITIQUE"
                                                    ? "bg-red-100 text-red-800"
                                                    : intervention.priorite === "URGENTE"
                                                      ? "bg-orange-100 text-orange-800"
                                                      : "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {intervention.datePrevisionnelle && (
                                                <span className="mr-1">
                                                    {new Date(intervention.datePrevisionnelle).toLocaleTimeString("fr-FR", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            )}
                                            {intervention.client.nom}
                                        </div>
                                    ))}

                                    {/* Show more indicator */}
                                    {interventions.length > 3 && (
                                        <div className="text-[10px] font-medium text-black/40 px-1.5">
                                            +{interventions.length - 3} autres
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
