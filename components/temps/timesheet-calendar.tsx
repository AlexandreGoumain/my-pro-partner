"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import type { EntreeTemps } from "@/lib/types/mission";
import { formatDuree } from "@/lib/utils/format";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useMemo, useState } from "react";

export interface TimesheetCalendarProps {
    entries: EntreeTemps[];
    onDateClick?: (date: string) => void;
}

const DAYS_OF_WEEK = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function getMonthDays(year: number, month: number) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get the day of week for the first day (0 = Sunday, adjust to Monday = 0)
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek < 0) startDayOfWeek = 6;

    const days: Array<{ date: Date | null; dayOfMonth: number | null }> = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startDayOfWeek; i++) {
        days.push({ date: null, dayOfMonth: null });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        days.push({
            date: new Date(year, month, day),
            dayOfMonth: day,
        });
    }

    // Fill remaining cells to complete the grid
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
        for (let i = 0; i < remaining; i++) {
            days.push({ date: null, dayOfMonth: null });
        }
    }

    return days;
}

export function TimesheetCalendar({
    entries,
    onDateClick,
}: TimesheetCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthDays = useMemo(() => getMonthDays(year, month), [year, month]);

    // Group entries by date
    const entriesByDate = useMemo(() => {
        const map = new Map<
            string,
            {
                entries: EntreeTemps[];
                totalMinutes: number;
                billableMinutes: number;
            }
        >();

        entries.forEach((entry) => {
            const dateKey = new Date(entry.date).toISOString().split("T")[0];
            const existing = map.get(dateKey) || {
                entries: [],
                totalMinutes: 0,
                billableMinutes: 0,
            };

            existing.entries.push(entry);
            existing.totalMinutes += entry.duree;
            if (entry.facturable) {
                existing.billableMinutes += entry.duree;
            }

            map.set(dateKey, existing);
        });

        return map;
    }, [entries]);

    // Calculate month totals
    const monthTotals = useMemo(() => {
        let total = 0;
        let billable = 0;

        entriesByDate.forEach((data) => {
            total += data.totalMinutes;
            billable += data.billableMinutes;
        });

        return { total, billable };
    }, [entriesByDate]);

    const navigateMonth = (direction: "prev" | "next") => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            newDate.setMonth(
                newDate.getMonth() + (direction === "prev" ? -1 : 1)
            );
            return newDate;
        });
    };

    const goToCurrentMonth = () => {
        setCurrentDate(new Date());
    };

    const monthName = currentDate.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
    });

    const today = new Date();
    const isToday = (date: Date | null) => {
        if (!date) return false;
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    return (
        <Card className="p-5 border-black/8">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigateMonth("prev")}
                        className="h-8 w-8 border-black/10"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigateMonth("next")}
                        className="h-8 w-8 border-black/10"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        onClick={goToCurrentMonth}
                        className="h-8 px-3 text-[12px] border-black/10"
                    >
                        Aujourd&apos;hui
                    </Button>
                </div>

                <h3 className="text-[15px] font-medium text-black/80 capitalize">
                    {monthName}
                </h3>

                <div className="flex items-center gap-4 text-[12px]">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-black/10" />
                        <span className="text-black/50">
                            {formatDuree(monthTotals.total)} total
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-black" />
                        <span className="text-black/50">
                            {formatDuree(monthTotals.billable)} fact.
                        </span>
                    </div>
                </div>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {DAYS_OF_WEEK.map((day) => (
                    <div
                        key={day}
                        className="text-center text-[11px] font-medium text-black/40 py-2"
                    >
                        {day}
                    </div>
                ))}

                {/* Days */}
                {monthDays.map((day, index) => {
                    if (!day.date) {
                        return (
                            <div
                                key={`empty-${index}`}
                                className="h-20 bg-black/2 rounded-md"
                            />
                        );
                    }

                    const dateKey = day.date.toISOString().split("T")[0];
                    const dayData = entriesByDate.get(dateKey);
                    const hasEntries = dayData && dayData.entries.length > 0;
                    const isWeekend =
                        day.date.getDay() === 0 || day.date.getDay() === 6;

                    return (
                        <TooltipProvider key={dateKey}>
                            <Tooltip delayDuration={200}>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => onDateClick?.(dateKey)}
                                        className={`
                                            h-20 rounded-md p-2 text-left transition-all
                                            hover:bg-black/5 group
                                            ${isToday(day.date) ? "ring-2 ring-black ring-inset" : ""}
                                            ${isWeekend ? "bg-black/2" : "bg-white border border-black/5"}
                                        `}
                                    >
                                        <div
                                            className={`
                                                text-[12px] font-medium mb-1
                                                ${isToday(day.date) ? "text-black" : "text-black/60"}
                                            `}
                                        >
                                            {day.dayOfMonth}
                                        </div>

                                        {hasEntries && (
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3 text-black/40" />
                                                    <span className="text-[11px] font-medium text-black/70">
                                                        {formatDuree(
                                                            dayData.totalMinutes
                                                        )}
                                                    </span>
                                                </div>
                                                {dayData.billableMinutes >
                                                    0 && (
                                                    <div className="text-[10px] text-black/40">
                                                        {formatDuree(
                                                            dayData.billableMinutes
                                                        )}{" "}
                                                        fact.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </button>
                                </TooltipTrigger>
                                {hasEntries && (
                                    <TooltipContent
                                        side="top"
                                        className="max-w-[200px] p-2"
                                    >
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-medium">
                                                {dayData.entries.length} entrée
                                                {dayData.entries.length > 1
                                                    ? "s"
                                                    : ""}
                                            </p>
                                            {dayData.entries
                                                .slice(0, 3)
                                                .map((entry) => (
                                                    <div
                                                        key={entry.id}
                                                        className="text-[10px] text-black/60 truncate"
                                                    >
                                                        {entry.mission?.nom ||
                                                            "Sans mission"}{" "}
                                                        -{" "}
                                                        {formatDuree(
                                                            entry.duree
                                                        )}
                                                    </div>
                                                ))}
                                            {dayData.entries.length > 3 && (
                                                <p className="text-[10px] text-black/40">
                                                    +
                                                    {dayData.entries.length - 3}{" "}
                                                    autres
                                                </p>
                                            )}
                                        </div>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                    );
                })}
            </div>
        </Card>
    );
}
