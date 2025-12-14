"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { type EcheanceFiscale, TYPE_DOSSIER_LABELS } from "@/lib/types/mission";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

export interface EcheancesCalendarProps {
    echeances: EcheanceFiscale[];
    onSelectDate?: (date: Date) => void;
    onSelectEcheance?: (echeance: EcheanceFiscale) => void;
}

const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MOIS = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
];

interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    echeances: EcheanceFiscale[];
}

function getCalendarDays(year: number, month: number): CalendarDay[] {
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Get the Monday of the first week
    const startDay = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDay.setDate(startDay.getDate() - diff);

    // Generate 6 weeks (42 days)
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDay);
        date.setDate(startDay.getDate() + i);

        days.push({
            date,
            isCurrentMonth: date.getMonth() === month,
            isToday: date.getTime() === today.getTime(),
            echeances: [],
        });
    }

    return days;
}

function isSameDay(d1: Date, d2: Date): boolean {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
}

export function EcheancesCalendar({
    echeances,
    onSelectDate,
    onSelectEcheance,
}: EcheancesCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Generate calendar days with echeances
    const calendarDays = useMemo(() => {
        const days = getCalendarDays(year, month);

        // Map echeances to days
        for (const echeance of echeances) {
            const echeanceDate = new Date(echeance.dateEcheance);
            const day = days.find((d) => isSameDay(d.date, echeanceDate));
            if (day) {
                day.echeances.push(echeance);
            }
        }

        return days;
    }, [echeances, year, month]);

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    return (
        <Card className="p-5 border-black/8">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-[18px] font-semibold text-black">
                    {MOIS[month]} {year}
                </h3>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={goToToday}
                        className="text-[13px] text-black/60"
                    >
                        Aujourd&apos;hui
                    </Button>
                    <div className="flex">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={goToPreviousMonth}
                            className="h-8 w-8"
                            aria-label="Mois précédent"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={goToNextMonth}
                            className="h-8 w-8"
                            aria-label="Mois suivant"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Days header */}
            <div className="grid grid-cols-7 mb-2">
                {JOURS.map((jour) => (
                    <div
                        key={jour}
                        className="text-center text-[12px] font-medium text-black/40 py-2"
                    >
                        {jour}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                    const hasEcheances = day.echeances.length > 0;
                    const hasOverdue = day.echeances.some(
                        (e) =>
                            e.statut !== "VALIDE" &&
                            e.statut !== "DEPOSE" &&
                            new Date(e.dateEcheance) < new Date()
                    );
                    const hasUrgent = day.echeances.some((e) => {
                        const days = Math.ceil(
                            (new Date(e.dateEcheance).getTime() - Date.now()) /
                                (1000 * 60 * 60 * 24)
                        );
                        return (
                            days <= 3 &&
                            days >= 0 &&
                            e.statut !== "VALIDE" &&
                            e.statut !== "DEPOSE"
                        );
                    });

                    return (
                        <TooltipProvider key={index}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => {
                                            if (day.echeances.length === 1) {
                                                onSelectEcheance?.(
                                                    day.echeances[0]
                                                );
                                            } else if (onSelectDate) {
                                                onSelectDate(day.date);
                                            }
                                        }}
                                        className={cn(
                                            "relative h-12 rounded-lg flex flex-col items-center justify-center transition-colors",
                                            day.isCurrentMonth
                                                ? "text-black hover:bg-black/5"
                                                : "text-black/30",
                                            day.isToday &&
                                                "bg-black text-white hover:bg-black/90",
                                            hasEcheances &&
                                                !day.isToday &&
                                                "bg-black/5",
                                            hasOverdue &&
                                                !day.isToday &&
                                                "bg-red-50 hover:bg-red-100",
                                            hasUrgent &&
                                                !hasOverdue &&
                                                !day.isToday &&
                                                "bg-orange-50 hover:bg-orange-100"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "text-[14px]",
                                                !day.isCurrentMonth &&
                                                    "opacity-50"
                                            )}
                                        >
                                            {day.date.getDate()}
                                        </span>
                                        {hasEcheances && (
                                            <div className="flex gap-0.5 mt-0.5">
                                                {day.echeances
                                                    .slice(0, 3)
                                                    .map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={cn(
                                                                "w-1.5 h-1.5 rounded-full",
                                                                hasOverdue
                                                                    ? "bg-red-500"
                                                                    : hasUrgent
                                                                      ? "bg-orange-500"
                                                                      : day.isToday
                                                                        ? "bg-white"
                                                                        : "bg-black/40"
                                                            )}
                                                        />
                                                    ))}
                                                {day.echeances.length > 3 && (
                                                    <span
                                                        className={cn(
                                                            "text-[8px]",
                                                            day.isToday
                                                                ? "text-white"
                                                                : "text-black/40"
                                                        )}
                                                    >
                                                        +
                                                        {day.echeances.length -
                                                            3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </button>
                                </TooltipTrigger>
                                {hasEcheances && (
                                    <TooltipContent
                                        side="bottom"
                                        className="max-w-[250px] p-2"
                                    >
                                        <div className="space-y-1">
                                            {day.echeances.map((e) => (
                                                <div
                                                    key={e.id}
                                                    className="text-[12px]"
                                                >
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[10px] mr-1"
                                                    >
                                                        {
                                                            TYPE_DOSSIER_LABELS[
                                                                e.type
                                                            ]
                                                        }
                                                    </Badge>
                                                    <span>{e.libelle}</span>
                                                    <span className="text-black/40 ml-1">
                                                        - {e.client?.nom}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-black/5">
                <div className="flex items-center gap-1.5 text-[11px] text-black/50">
                    <div className="w-2.5 h-2.5 rounded-full bg-black/40" />
                    <span>Échéance</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-black/50">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    <span>Urgente (≤3j)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-black/50">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span>En retard</span>
                </div>
            </div>
        </Card>
    );
}
