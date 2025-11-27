"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RendezVous } from "@/hooks/use-rendez-vous";
import { RENDEZ_VOUS_STATUTS } from "@/hooks/use-rendez-vous";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
    Check,
    MoreVertical,
    Pencil,
    Scissors,
    Trash2,
    User,
    X,
} from "lucide-react";

interface RdvCardProps {
    rdv: RendezVous;
    onEdit: (rdv: RendezVous) => void;
    onDelete?: (rdv: RendezVous) => void;
    onConfirm?: (rdv: RendezVous) => void;
    onCancel?: (rdv: RendezVous) => void;
    showDate?: boolean;
}

export function RdvCard({
    rdv,
    onEdit,
    onDelete,
    onConfirm,
    onCancel,
    showDate = false,
}: RdvCardProps) {
    const statutInfo = RENDEZ_VOUS_STATUTS.find((s) => s.value === rdv.statut);
    const canConfirm = rdv.statut === "EN_ATTENTE";
    const canCancel = rdv.statut === "EN_ATTENTE" || rdv.statut === "CONFIRME";

    return (
        <Card
            className="border-black/8 shadow-sm hover:border-black/15 transition-all cursor-pointer"
            onClick={() => onEdit(rdv)}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        {/* Time & Date */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[18px] font-semibold text-black">
                                {rdv.heure}
                            </span>
                            <span className="text-[13px] text-black/40">
                                ({rdv.duree} min)
                            </span>
                            {showDate && (
                                <span className="text-[13px] text-black/50 ml-2">
                                    {format(new Date(rdv.date), "EEEE d MMMM", {
                                        locale: fr,
                                    })}
                                </span>
                            )}
                        </div>

                        {/* Client */}
                        <div className="flex items-center gap-1.5 mb-1">
                            <User className="w-3.5 h-3.5 text-black/40" />
                            <span className="text-[14px] font-medium text-black">
                                {rdv.client
                                    ? `${rdv.client.prenom || ""} ${rdv.client.nom}`
                                    : rdv.nomClient}
                            </span>
                        </div>

                        {/* Prestation & Employee */}
                        <div className="flex items-center gap-4 text-[13px] text-black/50">
                            {rdv.prestation && (
                                <span className="flex items-center gap-1">
                                    <Scissors className="w-3 h-3" />
                                    {rdv.prestation.nom}
                                </span>
                            )}
                            {rdv.employe && (
                                <span className="flex items-center gap-1">
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{
                                            backgroundColor:
                                                rdv.employe.couleur || "#000",
                                        }}
                                    />
                                    {rdv.employe.prenom} {rdv.employe.nom}
                                </span>
                            )}
                        </div>

                        {/* Status */}
                        <Badge
                            variant="secondary"
                            className={`mt-2 text-[11px] ${statutInfo?.color || "bg-black/5 text-black/40"}`}
                        >
                            {statutInfo?.label || rdv.statut}
                        </Badge>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-black/40 hover:text-black/60"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(rdv);
                                }}
                            >
                                <Pencil className="w-4 h-4 mr-2" />
                                Modifier
                            </DropdownMenuItem>
                            {onConfirm && canConfirm && (
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onConfirm(rdv);
                                    }}
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    Confirmer
                                </DropdownMenuItem>
                            )}
                            {onCancel && canCancel && (
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onCancel(rdv);
                                    }}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Annuler
                                </DropdownMenuItem>
                            )}
                            {onDelete && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(rdv);
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Supprimer
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    );
}
