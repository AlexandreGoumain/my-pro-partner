"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EntretienAPlanifier } from "@/hooks/use-entretiens-planifier";
import {
    TYPE_EQUIPEMENT_LABELS,
    type TypeEquipement,
} from "@/lib/types/intervention";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
    AlertTriangle,
    Calendar,
    CalendarCheck,
    Clock,
    Flame,
    MapPin,
    Phone,
    Shield,
    Wrench,
    Zap,
} from "lucide-react";

interface EntretienPlanifierCardProps {
    entretien: EntretienAPlanifier;
    onPlanifier?: () => void;
    onClick?: () => void;
}

const TYPE_ICONS: Record<EntretienAPlanifier["type"], React.ReactNode> = {
    CONTROLE_ANNUEL: <Shield className="w-4 h-4" strokeWidth={2} />,
    ENTRETIEN: <Wrench className="w-4 h-4" strokeWidth={2} />,
    GARANTIE_EXPIRE: <Clock className="w-4 h-4" strokeWidth={2} />,
};

const TYPE_LABELS: Record<EntretienAPlanifier["type"], string> = {
    CONTROLE_ANNUEL: "Contrôle annuel",
    ENTRETIEN: "Entretien prévu",
    GARANTIE_EXPIRE: "Garantie expire",
};

const PRIORITE_STYLES: Record<
    EntretienAPlanifier["priorite"],
    { badge: string; border: string; icon: string }
> = {
    critique: {
        badge: "bg-red-100 text-red-700 border-red-200",
        border: "border-red-200",
        icon: "text-red-500",
    },
    haute: {
        badge: "bg-orange-100 text-orange-700 border-orange-200",
        border: "border-orange-200",
        icon: "text-orange-500",
    },
    normale: {
        badge: "bg-black/5 text-black/60 border-black/10",
        border: "border-black/8",
        icon: "text-black/40",
    },
    basse: {
        badge: "bg-black/5 text-black/40 border-black/10",
        border: "border-black/8",
        icon: "text-black/30",
    },
};

const EQUIPEMENT_ICONS: Partial<Record<TypeEquipement, React.ReactNode>> = {
    CHAUDIERE_GAZ: <Flame className="w-5 h-5" strokeWidth={2} />,
    CHAUDIERE_FIOUL: <Flame className="w-5 h-5" strokeWidth={2} />,
    CHAUDIERE_BOIS: <Flame className="w-5 h-5" strokeWidth={2} />,
    CHAUDIERE_ELECTRIQUE: <Zap className="w-5 h-5" strokeWidth={2} />,
    POMPE_A_CHALEUR: <Wrench className="w-5 h-5" strokeWidth={2} />,
};

export function EntretienPlanifierCard({
    entretien,
    onPlanifier,
    onClick,
}: EntretienPlanifierCardProps) {
    const prioriteStyle = PRIORITE_STYLES[entretien.priorite];
    const equipementIcon = EQUIPEMENT_ICONS[
        entretien.equipement.type as TypeEquipement
    ] || <Wrench className="w-5 h-5" strokeWidth={2} />;

    return (
        <div
            className={cn(
                "p-4 rounded-xl bg-white border shadow-sm transition-all duration-200",
                prioriteStyle.border,
                onClick && "cursor-pointer hover:shadow-md"
            )}
            onClick={onClick}
        >
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                    className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                        entretien.enRetard
                            ? "bg-red-100 text-red-600"
                            : entretien.priorite === "haute"
                              ? "bg-orange-100 text-orange-600"
                              : "bg-black/5 text-black/60"
                    )}
                >
                    {equipementIcon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-[14px] font-semibold text-black">
                                    {entretien.client.nom}
                                    {entretien.client.prenom &&
                                        ` ${entretien.client.prenom}`}
                                </h3>
                                <Badge
                                    className={cn(
                                        "text-[10px] font-medium border",
                                        prioriteStyle.badge
                                    )}
                                >
                                    {entretien.enRetard
                                        ? "En retard"
                                        : entretien.priorite === "critique"
                                          ? "Critique"
                                          : entretien.priorite === "haute"
                                            ? "Urgent"
                                            : "Normal"}
                                </Badge>
                            </div>
                            <p className="text-[12px] text-black/50">
                                {
                                    TYPE_EQUIPEMENT_LABELS[
                                        entretien.equipement
                                            .type as TypeEquipement
                                    ]
                                }{" "}
                                - {entretien.equipement.marque}
                                {entretien.equipement.modele &&
                                    ` ${entretien.equipement.modele}`}
                            </p>
                        </div>

                        <Badge
                            variant="outline"
                            className="text-[11px] border-black/10 text-black/60 shrink-0"
                        >
                            {TYPE_ICONS[entretien.type]}
                            <span className="ml-1.5">
                                {TYPE_LABELS[entretien.type]}
                            </span>
                        </Badge>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-black/50 mb-3">
                        {entretien.client.ville && (
                            <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" strokeWidth={2} />
                                <span>{entretien.client.ville}</span>
                            </div>
                        )}
                        {entretien.client.telephone && (
                            <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" strokeWidth={2} />
                                <span>{entretien.client.telephone}</span>
                            </div>
                        )}
                    </div>

                    {/* Date & Action */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {entretien.enRetard ? (
                                <AlertTriangle
                                    className="w-4 h-4 text-red-500"
                                    strokeWidth={2}
                                />
                            ) : (
                                <Calendar
                                    className={cn(
                                        "w-4 h-4",
                                        prioriteStyle.icon
                                    )}
                                    strokeWidth={2}
                                />
                            )}
                            <span
                                className={cn(
                                    "text-[13px] font-medium",
                                    entretien.enRetard
                                        ? "text-red-600"
                                        : entretien.priorite === "haute"
                                          ? "text-orange-600"
                                          : "text-black/70"
                                )}
                            >
                                {entretien.enRetard
                                    ? `En retard de ${Math.abs(entretien.joursRestants)} jours`
                                    : entretien.joursRestants === 0
                                      ? "Aujourd'hui"
                                      : entretien.joursRestants === 1
                                        ? "Demain"
                                        : `Dans ${entretien.joursRestants} jours`}
                            </span>
                            <span className="text-[12px] text-black/40">
                                (
                                {format(
                                    new Date(entretien.dateEcheance),
                                    "dd MMM yyyy",
                                    {
                                        locale: fr,
                                    }
                                )}
                                )
                            </span>
                        </div>

                        {onPlanifier && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPlanifier();
                                }}
                                className="h-8 px-3 text-[12px] border-black/10 hover:bg-black/5"
                            >
                                <CalendarCheck
                                    className="w-3.5 h-3.5 mr-1.5"
                                    strokeWidth={2}
                                />
                                Planifier
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
