"use client";

import { Calendar, Clock, User, MoreVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ClientRdv } from "@/hooks/use-client-rdv";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface RdvCardProps {
    rdv: ClientRdv;
    onCancel?: (id: string) => void;
    onView?: (id: string) => void;
    className?: string;
}

const STATUS_CONFIG = {
    EN_ATTENTE: {
        label: "En attente",
        className: "bg-black/5 text-black/60",
    },
    CONFIRME: {
        label: "Confirmé",
        className: "bg-black/10 text-black",
    },
    EN_COURS: {
        label: "En cours",
        className: "bg-black text-white",
    },
    TERMINE: {
        label: "Terminé",
        className: "bg-black/5 text-black/40",
    },
    ANNULE: {
        label: "Annulé",
        className: "bg-black/5 text-black/30 line-through",
    },
    NO_SHOW: {
        label: "Absent",
        className: "bg-black/5 text-black/30",
    },
};

export function RdvCard({ rdv, onCancel, onView, className }: RdvCardProps) {
    const statusConfig = STATUS_CONFIG[rdv.statut];
    const rdvDate = new Date(rdv.date);
    const canCancel = !["ANNULE", "NO_SHOW", "TERMINE", "EN_COURS"].includes(rdv.statut);

    // Check if RDV is in the past
    const isPast = rdvDate < new Date() && !["EN_COURS"].includes(rdv.statut);

    return (
        <div
            className={cn(
                "border border-black/8 rounded-lg p-4 transition-all duration-200 hover:border-black/15",
                isPast && "opacity-60",
                className
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    {/* Prestation name */}
                    <h3 className="text-[15px] font-medium text-black truncate">
                        {rdv.prestation?.nom || "Rendez-vous"}
                    </h3>

                    {/* Date and time */}
                    <div className="flex items-center gap-4 mt-2 text-[13px] text-black/60">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
                            <span>
                                {format(rdvDate, "EEEE d MMMM", { locale: fr })}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                            <span>{rdv.heure}</span>
                            <span className="text-black/40">({rdv.duree} min)</span>
                        </div>
                    </div>

                    {/* Employee */}
                    {rdv.employe && (
                        <div className="flex items-center gap-1.5 mt-2 text-[13px] text-black/50">
                            <User className="w-3.5 h-3.5" strokeWidth={2} />
                            <span>
                                {rdv.employe.prenom} {rdv.employe.nom}
                            </span>
                        </div>
                    )}
                </div>

                {/* Status badge and actions */}
                <div className="flex items-center gap-2">
                    <span
                        className={cn(
                            "text-[12px] font-medium px-2.5 py-1 rounded-md",
                            statusConfig.className
                        )}
                    >
                        {statusConfig.label}
                    </span>

                    {(canCancel || onView) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-black/40 hover:text-black/60"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {onView && (
                                    <DropdownMenuItem onClick={() => onView(rdv.id)}>
                                        Voir les détails
                                    </DropdownMenuItem>
                                )}
                                {canCancel && onCancel && (
                                    <DropdownMenuItem
                                        onClick={() => onCancel(rdv.id)}
                                        className="text-red-600"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Annuler
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            {/* Notes */}
            {rdv.notes && (
                <p className="mt-3 text-[13px] text-black/50 line-clamp-2">
                    {rdv.notes}
                </p>
            )}
        </div>
    );
}
