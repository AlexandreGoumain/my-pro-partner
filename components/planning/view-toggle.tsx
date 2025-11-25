"use client";

import { Button } from "@/components/ui/button";
import type { CalendarView } from "@/hooks/use-interventions";
import { CalendarDays, CalendarRange, Calendar } from "lucide-react";

interface ViewToggleProps {
    view: CalendarView;
    onViewChange: (view: CalendarView) => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
    const views: { value: CalendarView; label: string; icon: React.ReactNode }[] = [
        { value: "day", label: "Jour", icon: <Calendar className="w-4 h-4" strokeWidth={2} /> },
        { value: "week", label: "Semaine", icon: <CalendarDays className="w-4 h-4" strokeWidth={2} /> },
        { value: "month", label: "Mois", icon: <CalendarRange className="w-4 h-4" strokeWidth={2} /> },
    ];

    return (
        <div className="flex items-center gap-1 p-1 bg-black/5 rounded-lg">
            {views.map((v) => (
                <Button
                    key={v.value}
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewChange(v.value)}
                    className={`h-9 px-4 text-[13px] font-medium rounded-md transition-all duration-200 ${
                        view === v.value
                            ? "bg-white text-black shadow-sm"
                            : "text-black/60 hover:text-black hover:bg-transparent"
                    }`}
                >
                    {v.icon}
                    <span className="ml-2">{v.label}</span>
                </Button>
            ))}
        </div>
    );
}
