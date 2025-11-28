"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MissionWithDetails, StatutMission } from "@/lib/types/mission";
import {
    STATUT_MISSION_COLORS,
    STATUT_MISSION_LABELS,
    STATUT_MISSION_TRANSITIONS,
    calculateBudgetProgress,
    formatDuree,
} from "@/lib/types/mission";
import {
    ArrowLeft,
    ChevronRight,
    Clock,
    FileText,
    MoreVertical,
    Pencil,
    Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

export interface MissionDetailHeaderProps {
    mission: MissionWithDetails;
    onEdit: () => void;
    onDelete: () => void;
    onStatusChange: (status: StatutMission) => void;
    onCreateInvoice: () => void;
}

export function MissionDetailHeader({
    mission,
    onEdit,
    onDelete,
    onStatusChange,
    onCreateInvoice,
}: MissionDetailHeaderProps) {
    const router = useRouter();

    const availableTransitions = STATUT_MISSION_TRANSITIONS[mission.statut];
    const budgetProgress = calculateBudgetProgress(
        mission.totalHeures,
        mission.budgetHeures
    );

    const canDelete =
        mission.statut === "PROPOSITION" || mission.statut === "ANNULEE";
    const canInvoice =
        mission.statut === "LIVREE" && mission.totalFacturable > 0;

    return (
        <div className="space-y-4">
            {/* Back button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/missions")}
                className="h-8 px-2 text-black/60 hover:text-black"
            >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Retour aux missions
            </Button>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <span className="text-[14px] font-medium text-black/50">
                            {mission.numero}
                        </span>
                        <Badge
                            className={`${STATUT_MISSION_COLORS[mission.statut]}`}
                        >
                            {STATUT_MISSION_LABELS[mission.statut]}
                        </Badge>
                    </div>
                    <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                        {mission.nom}
                    </h1>
                    <p className="text-[14px] text-black/40">
                        Client : {mission.client.nom}
                        {mission.client.prenom && ` ${mission.client.prenom}`}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Status transitions */}
                    {availableTransitions.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-10 px-4 border-black/10"
                                >
                                    Changer le statut
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {availableTransitions.map((status) => (
                                    <DropdownMenuItem
                                        key={status}
                                        onClick={() => onStatusChange(status)}
                                    >
                                        <Badge
                                            className={`mr-2 ${STATUT_MISSION_COLORS[status]}`}
                                        >
                                            {STATUT_MISSION_LABELS[status]}
                                        </Badge>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {/* Create invoice button */}
                    {canInvoice && (
                        <Button
                            onClick={onCreateInvoice}
                            className="h-10 px-4 bg-black hover:bg-black/90"
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            Facturer
                        </Button>
                    )}

                    {/* More actions */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 border-black/10"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={onEdit}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Modifier
                            </DropdownMenuItem>
                            {canDelete && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={onDelete}
                                        className="text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Supprimer
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-black/40" />
                    <span className="text-[14px] text-black/60">
                        {formatDuree(mission.totalHeures)} trackées
                    </span>
                    {mission.budgetHeures && budgetProgress !== null && (
                        <span
                            className={`text-[13px] ${
                                budgetProgress > 100
                                    ? "text-red-500"
                                    : budgetProgress > 80
                                      ? "text-orange-500"
                                      : "text-black/40"
                            }`}
                        >
                            ({budgetProgress}% du budget)
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[14px] text-black/60">
                        {formatDuree(mission.totalFacturable)} facturables
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium text-black/80">
                        {mission.totalMontant.toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
}
