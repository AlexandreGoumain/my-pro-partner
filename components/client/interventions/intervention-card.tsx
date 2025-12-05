"use client";

import { Calendar, Clock, MapPin, Wrench, AlertCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ClientIntervention } from "@/hooks/use-client-interventions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface InterventionCardProps {
    intervention: ClientIntervention;
    onClick?: () => void;
    className?: string;
}

const STATUS_CONFIG: Record<string, { label: string; className: string; step: number }> = {
    DEMANDE: {
        label: "Demande reçue",
        className: "bg-black/5 text-black/60",
        step: 1,
    },
    VALIDEE: {
        label: "Validée",
        className: "bg-black/10 text-black",
        step: 2,
    },
    PLANIFIEE: {
        label: "Planifiée",
        className: "bg-black/10 text-black",
        step: 3,
    },
    EN_ROUTE: {
        label: "Technicien en route",
        className: "bg-black text-white",
        step: 4,
    },
    EN_COURS: {
        label: "En cours",
        className: "bg-black text-white",
        step: 5,
    },
    EN_ATTENTE_PIECES: {
        label: "En attente de pièces",
        className: "bg-black/10 text-black/70",
        step: 5,
    },
    TERMINEE: {
        label: "Terminée",
        className: "bg-black/5 text-black/40",
        step: 6,
    },
    FACTUREE: {
        label: "Facturée",
        className: "bg-black/5 text-black/40",
        step: 7,
    },
    ANNULEE: {
        label: "Annulée",
        className: "bg-black/5 text-black/30",
        step: 0,
    },
};

const PRIORITY_CONFIG: Record<string, { label: string; className: string }> = {
    NORMALE: {
        label: "Normale",
        className: "text-black/40",
    },
    URGENTE: {
        label: "Urgente",
        className: "text-amber-600",
    },
    CRITIQUE: {
        label: "Critique",
        className: "text-red-600",
    },
};

export function InterventionCard({ intervention, onClick, className }: InterventionCardProps) {
    const statusConfig = STATUS_CONFIG[intervention.statut] || STATUS_CONFIG.DEMANDE;
    const priorityConfig = PRIORITY_CONFIG[intervention.priorite] || PRIORITY_CONFIG.NORMALE;
    const isActive = !["TERMINEE", "FACTUREE", "ANNULEE"].includes(intervention.statut);

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full text-left border border-black/8 rounded-lg p-4 transition-all duration-200",
                onClick && "hover:border-black/15 cursor-pointer",
                !isActive && "opacity-60",
                className
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    {/* Header with number and priority */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[14px] font-medium text-black">
                            {intervention.numero}
                        </span>
                        {intervention.priorite !== "NORMALE" && (
                            <span className={cn("flex items-center gap-1 text-[12px] font-medium", priorityConfig.className)}>
                                <AlertCircle className="w-3 h-3" />
                                {priorityConfig.label}
                            </span>
                        )}
                    </div>

                    {/* Type */}
                    <div className="flex items-center gap-2 text-[13px] text-black/70 mb-2">
                        <Wrench className="w-3.5 h-3.5" strokeWidth={2} />
                        <span className="capitalize">
                            {intervention.typeIntervention.toLowerCase().replace(/_/g, " ")}
                        </span>
                        {intervention.equipement && (
                            <span className="text-black/40">
                                • {intervention.equipement.toLowerCase().replace(/_/g, " ")}
                            </span>
                        )}
                    </div>

                    {/* Description (truncated) */}
                    <p className="text-[13px] text-black/50 line-clamp-2 mb-3">
                        {intervention.description}
                    </p>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-black/40">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{intervention.ville}</span>
                        </div>
                        {intervention.datePrevisionnelle && (
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>
                                    {format(new Date(intervention.datePrevisionnelle), "d MMM", { locale: fr })}
                                </span>
                            </div>
                        )}
                        {intervention.dureeEstimeeH && (
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{intervention.dureeEstimeeH}h estimé</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Status and arrow */}
                <div className="flex items-center gap-2">
                    <span
                        className={cn(
                            "text-[11px] font-medium px-2 py-1 rounded-md whitespace-nowrap",
                            statusConfig.className
                        )}
                    >
                        {statusConfig.label}
                    </span>
                    {onClick && (
                        <ChevronRight className="w-4 h-4 text-black/30" />
                    )}
                </div>
            </div>

            {/* Status progress bar for active interventions */}
            {isActive && statusConfig.step > 0 && (
                <div className="mt-4 pt-3 border-t border-black/5">
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5, 6].map((step) => (
                            <div
                                key={step}
                                className={cn(
                                    "h-1 flex-1 rounded-full transition-all",
                                    step <= statusConfig.step
                                        ? "bg-black"
                                        : "bg-black/10"
                                )}
                            />
                        ))}
                    </div>
                </div>
            )}
        </button>
    );
}
