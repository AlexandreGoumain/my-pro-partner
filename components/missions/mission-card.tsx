"use client";

import { Card } from "@/components/ui/card";
import {
    calculateBudgetProgress,
    formatDuree,
    TYPE_FACTURATION_LABELS,
    type Mission,
} from "@/lib/types/mission";
import { cn } from "@/lib/utils";
import { Calendar, Clock, FileText, User } from "lucide-react";
import { MissionStatusBadge } from "./mission-status-badge";

interface MissionCardProps {
    mission: Mission & { _count?: { entreesTemps: number } };
    onClick?: () => void;
    className?: string;
}

export function MissionCard({ mission, onClick, className }: MissionCardProps) {
    const progress = calculateBudgetProgress(
        mission.totalHeures,
        mission.budgetHeures
    );

    return (
        <Card
            className={cn(
                "p-4 cursor-pointer transition-all duration-200 hover:bg-black/2 border-black/8",
                className
            )}
            onClick={onClick}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[12px] text-black/40 font-mono">
                            {mission.numero}
                        </span>
                        <MissionStatusBadge statut={mission.statut} />
                    </div>

                    {/* Title */}
                    <h3 className="text-[15px] font-medium text-black truncate">
                        {mission.nom}
                    </h3>

                    {/* Client */}
                    <div className="flex items-center gap-1.5 mt-1.5 text-[13px] text-black/60">
                        <User className="h-3.5 w-3.5" strokeWidth={2} />
                        <span className="truncate">
                            {mission.client.nom}
                            {mission.client.prenom
                                ? ` ${mission.client.prenom}`
                                : ""}
                        </span>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 mt-2 text-[12px] text-black/40">
                        {/* Type de facturation */}
                        <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" strokeWidth={2} />
                            {TYPE_FACTURATION_LABELS[mission.typeFact]}
                        </span>

                        {/* Heures */}
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" strokeWidth={2} />
                            {formatDuree(mission.totalHeures)}
                            {mission.budgetHeures && (
                                <span className="text-black/30">
                                    {" "}
                                    / {formatDuree(mission.budgetHeures)}
                                </span>
                            )}
                        </span>

                        {/* Date */}
                        {mission.dateDebut && (
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" strokeWidth={2} />
                                {new Date(mission.dateDebut).toLocaleDateString(
                                    "fr-FR",
                                    { day: "numeric", month: "short" }
                                )}
                            </span>
                        )}
                    </div>

                    {/* Progress bar (if budget defined) */}
                    {progress !== null && (
                        <div className="mt-3">
                            <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all",
                                        progress > 100
                                            ? "bg-red-500"
                                            : progress > 80
                                              ? "bg-yellow-500"
                                              : "bg-black/30"
                                    )}
                                    style={{
                                        width: `${Math.min(progress, 100)}%`,
                                    }}
                                />
                            </div>
                            <span className="text-[11px] text-black/40 mt-0.5 block">
                                {progress}% du budget
                            </span>
                        </div>
                    )}
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                    <div className="text-[15px] font-medium text-black">
                        {mission.totalMontant.toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                        })}
                    </div>
                    {mission.typeFact === "FORFAIT" &&
                        mission.montantForfait && (
                            <div className="text-[12px] text-black/40">
                                Forfait:{" "}
                                {mission.montantForfait.toLocaleString(
                                    "fr-FR",
                                    {
                                        style: "currency",
                                        currency: "EUR",
                                    }
                                )}
                            </div>
                        )}
                    {mission.tauxHoraire && mission.typeFact !== "FORFAIT" && (
                        <div className="text-[12px] text-black/40">
                            {mission.tauxHoraire}€/h
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
