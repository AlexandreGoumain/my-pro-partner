"use client";

import { Button } from "@/components/ui/button";
import type { ViewMode } from "@/hooks/use-agenda-page";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AgendaHeaderProps {
    selectedDate: Date;
    viewMode: ViewMode;
    onToday: () => void;
    onPrevious: () => void;
    onNext: () => void;
}

export function AgendaHeader({
    selectedDate,
    viewMode,
    onToday,
    onPrevious,
    onNext,
}: AgendaHeaderProps) {
    const getDateLabel = () => {
        if (viewMode === "day") {
            return format(selectedDate, "EEEE d MMMM yyyy", { locale: fr });
        } else if (viewMode === "week") {
            return `Semaine du ${format(selectedDate, "d MMMM yyyy", { locale: fr })}`;
        }
        return "Liste des rendez-vous";
    };

    return (
        <div className="flex items-center gap-3">
            <Button
                variant="outline"
                size="sm"
                onClick={onToday}
                className="h-9 text-[13px] border-black/10"
            >
                Aujourd&apos;hui
            </Button>
            {viewMode !== "list" && (
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onPrevious}
                        className="h-9 w-9"
                        aria-label="Période précédente"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onNext}
                        className="h-9 w-9"
                        aria-label="Période suivante"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </>
            )}
            <span className="text-[15px] font-medium text-black capitalize">
                {getDateLabel()}
            </span>
        </div>
    );
}
