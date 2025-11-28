"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
    type EcheanceFiscale,
    STATUT_ECHEANCE_COLORS,
    STATUT_ECHEANCE_LABELS,
    TYPE_DOSSIER_LABELS,
} from "@/lib/types/mission";
import { cn } from "@/lib/utils";
import { Building2, CalendarClock, FolderOpen } from "lucide-react";

export interface EcheanceCardProps {
    echeance: EcheanceFiscale;
    onClick?: () => void;
    compact?: boolean;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function getDaysUntil(dateString: string): number {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(dateString);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getUrgencyClass(dateString: string, statut: string): string {
    if (statut === "VALIDE" || statut === "DEPOSE") {
        return "";
    }

    const daysUntil = getDaysUntil(dateString);

    if (daysUntil < 0) {
        return "border-l-4 border-l-red-500";
    }
    if (daysUntil <= 3) {
        return "border-l-4 border-l-orange-500";
    }
    if (daysUntil <= 7) {
        return "border-l-4 border-l-yellow-500";
    }
    return "";
}

export function EcheanceCard({
    echeance,
    onClick,
    compact = false,
}: EcheanceCardProps) {
    const daysUntil = getDaysUntil(echeance.dateEcheance);
    const isOverdue =
        daysUntil < 0 &&
        echeance.statut !== "VALIDE" &&
        echeance.statut !== "DEPOSE";

    return (
        <Card
            className={cn(
                "p-4 border-black/8 hover:border-black/20 transition-colors cursor-pointer",
                getUrgencyClass(echeance.dateEcheance, echeance.statut)
            )}
            onClick={onClick}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    {/* Type badge and title */}
                    <div className="flex items-center gap-2 mb-2">
                        <Badge
                            variant="outline"
                            className="text-[11px] border-black/10"
                        >
                            {TYPE_DOSSIER_LABELS[echeance.type]}
                        </Badge>
                        <Badge
                            className={cn(
                                "text-[11px]",
                                STATUT_ECHEANCE_COLORS[echeance.statut]
                            )}
                        >
                            {STATUT_ECHEANCE_LABELS[echeance.statut]}
                        </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="text-[15px] font-medium text-black mb-1 truncate">
                        {echeance.libelle}
                    </h3>

                    {/* Client and mission */}
                    {!compact && (
                        <div className="flex items-center gap-4 text-[13px] text-black/50">
                            {echeance.client && (
                                <div className="flex items-center gap-1.5">
                                    <Building2 className="h-3.5 w-3.5" />
                                    <span className="truncate max-w-[150px]">
                                        {echeance.client.nom}
                                    </span>
                                </div>
                            )}
                            {echeance.mission && (
                                <div className="flex items-center gap-1.5">
                                    <FolderOpen className="h-3.5 w-3.5" />
                                    <span className="truncate max-w-[150px]">
                                        {echeance.mission.nom}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Date */}
                <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1.5 text-[13px] text-black/60">
                        <CalendarClock className="h-4 w-4" />
                        <span>{formatDate(echeance.dateEcheance)}</span>
                    </div>
                    {isOverdue ? (
                        <p className="text-[12px] text-red-600 font-medium mt-1">
                            En retard de {Math.abs(daysUntil)} jour
                            {Math.abs(daysUntil) > 1 ? "s" : ""}
                        </p>
                    ) : echeance.statut !== "VALIDE" &&
                      echeance.statut !== "DEPOSE" ? (
                        <p className="text-[12px] text-black/40 mt-1">
                            {daysUntil === 0
                                ? "Aujourd'hui"
                                : daysUntil === 1
                                  ? "Demain"
                                  : `Dans ${daysUntil} jours`}
                        </p>
                    ) : null}
                </div>
            </div>

            {/* Exercice fiscal if set */}
            {echeance.exerciceFiscal && !compact && (
                <div className="mt-3 pt-3 border-t border-black/5">
                    <span className="text-[12px] text-black/40">
                        Exercice fiscal : {echeance.exerciceFiscal}
                    </span>
                </div>
            )}
        </Card>
    );
}
