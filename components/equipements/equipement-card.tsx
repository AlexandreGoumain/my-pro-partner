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
import {
    STATUT_EQUIPEMENT_COLORS,
    STATUT_EQUIPEMENT_LABELS,
    TYPE_ENERGIE_LABELS,
    type EquipementClient,
    type StatutEquipement,
} from "@/lib/types/equipement";
import {
    TYPE_EQUIPEMENT_LABELS,
    type TypeEquipement,
} from "@/lib/types/intervention";
import { cn } from "@/lib/utils";
import { differenceInDays, format } from "date-fns";
import { fr } from "date-fns/locale";
import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    Edit,
    FileText,
    Flame,
    MapPin,
    MoreVertical,
    Trash2,
    User,
    Wrench,
    Zap,
} from "lucide-react";

interface EquipementCardProps {
    equipement: EquipementClient;
    onEdit?: () => void;
    onDelete?: () => void;
    onCreateCertificat?: () => void;
    onClick?: () => void;
}

const EQUIPEMENT_ICONS: Partial<Record<TypeEquipement, React.ReactNode>> = {
    CHAUDIERE_GAZ: <Flame className="w-5 h-5" strokeWidth={2} />,
    CHAUDIERE_FIOUL: <Flame className="w-5 h-5" strokeWidth={2} />,
    CHAUDIERE_BOIS: <Flame className="w-5 h-5" strokeWidth={2} />,
    CHAUDIERE_ELECTRIQUE: <Zap className="w-5 h-5" strokeWidth={2} />,
    POMPE_A_CHALEUR: <Wrench className="w-5 h-5" strokeWidth={2} />,
    PAC_AIR_AIR: <Wrench className="w-5 h-5" strokeWidth={2} />,
    PAC_AIR_EAU: <Wrench className="w-5 h-5" strokeWidth={2} />,
    CLIMATISATION: <Wrench className="w-5 h-5" strokeWidth={2} />,
};

export function EquipementCard({
    equipement,
    onEdit,
    onDelete,
    onCreateCertificat,
    onClick,
}: EquipementCardProps) {
    const icon = EQUIPEMENT_ICONS[equipement.type] || (
        <Wrench className="w-5 h-5" strokeWidth={2} />
    );

    // Calculate days until next control
    const joursAvantControle = equipement.prochainControleAnnuel
        ? differenceInDays(
              new Date(equipement.prochainControleAnnuel),
              new Date()
          )
        : null;

    const isControleEnRetard =
        joursAvantControle !== null && joursAvantControle < 0;
    const isControleProche =
        joursAvantControle !== null &&
        joursAvantControle >= 0 &&
        joursAvantControle <= 30;

    return (
        <div
            className={cn(
                "p-5 rounded-xl bg-white border shadow-sm transition-all duration-200",
                onClick && "cursor-pointer hover:shadow-md",
                isControleEnRetard
                    ? "border-red-200 hover:border-red-300"
                    : isControleProche
                      ? "border-orange-200 hover:border-orange-300"
                      : "border-black/8 hover:border-black/20"
            )}
            onClick={onClick}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div
                        className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            isControleEnRetard
                                ? "bg-red-100 text-red-600"
                                : isControleProche
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-black/5 text-black/60"
                        )}
                    >
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-[15px] font-semibold text-black">
                            {TYPE_EQUIPEMENT_LABELS[equipement.type]}
                        </h3>
                        <p className="text-[13px] text-black/50">
                            {equipement.marque}
                            {equipement.modele && ` - ${equipement.modele}`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Badge
                        className={cn(
                            "text-[11px] font-medium border-0",
                            STATUT_EQUIPEMENT_COLORS[
                                equipement.statut as StatutEquipement
                            ]
                        )}
                    >
                        {
                            STATUT_EQUIPEMENT_LABELS[
                                equipement.statut as StatutEquipement
                            ]
                        }
                    </Badge>

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-black/40 hover:text-black"
                            >
                                <MoreVertical
                                    className="w-4 h-4"
                                    strokeWidth={2}
                                />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {onEdit && (
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit();
                                    }}
                                >
                                    <Edit
                                        className="w-4 h-4 mr-2"
                                        strokeWidth={2}
                                    />
                                    Modifier
                                </DropdownMenuItem>
                            )}
                            {onCreateCertificat &&
                                equipement.controleObligatoire && (
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onCreateCertificat();
                                        }}
                                    >
                                        <FileText
                                            className="w-4 h-4 mr-2"
                                            strokeWidth={2}
                                        />
                                        Nouveau certificat
                                    </DropdownMenuItem>
                                )}
                            {onDelete && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete();
                                        }}
                                        className="text-red-600 focus:text-red-600"
                                    >
                                        <Trash2
                                            className="w-4 h-4 mr-2"
                                            strokeWidth={2}
                                        />
                                        Supprimer
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Client Info */}
            {equipement.client && (
                <div className="flex items-center gap-2 text-[13px] text-black/60 mb-3">
                    <User className="w-3.5 h-3.5" strokeWidth={2} />
                    <span>
                        {equipement.client.prenom} {equipement.client.nom}
                    </span>
                    {equipement.client.ville && (
                        <>
                            <span className="text-black/20">|</span>
                            <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                            <span>{equipement.client.ville}</span>
                        </>
                    )}
                </div>
            )}

            {/* Details Row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-black/50 mb-3">
                {equipement.typeEnergie && (
                    <span>{TYPE_ENERGIE_LABELS[equipement.typeEnergie]}</span>
                )}
                {equipement.puissanceKw && (
                    <span>{equipement.puissanceKw} kW</span>
                )}
                {equipement.numeroSerie && (
                    <span className="font-mono">
                        SN: {equipement.numeroSerie}
                    </span>
                )}
                {equipement.dateInstallation && (
                    <span>
                        Installé le{" "}
                        {format(
                            new Date(equipement.dateInstallation),
                            "dd/MM/yyyy"
                        )}
                    </span>
                )}
            </div>

            {/* Control Status */}
            {equipement.controleObligatoire && (
                <div
                    className={cn(
                        "flex items-center justify-between p-3 rounded-lg mt-3",
                        isControleEnRetard
                            ? "bg-red-50"
                            : isControleProche
                              ? "bg-orange-50"
                              : equipement.certificatValide
                                ? "bg-emerald-50"
                                : "bg-black/[0.02]"
                    )}
                >
                    <div className="flex items-center gap-2">
                        {isControleEnRetard ? (
                            <AlertTriangle
                                className="w-4 h-4 text-red-500"
                                strokeWidth={2}
                            />
                        ) : isControleProche ? (
                            <Calendar
                                className="w-4 h-4 text-orange-500"
                                strokeWidth={2}
                            />
                        ) : equipement.certificatValide ? (
                            <CheckCircle
                                className="w-4 h-4 text-emerald-500"
                                strokeWidth={2}
                            />
                        ) : (
                            <AlertTriangle
                                className="w-4 h-4 text-black/40"
                                strokeWidth={2}
                            />
                        )}
                        <span
                            className={cn(
                                "text-[12px] font-medium",
                                isControleEnRetard
                                    ? "text-red-700"
                                    : isControleProche
                                      ? "text-orange-700"
                                      : equipement.certificatValide
                                        ? "text-emerald-700"
                                        : "text-black/60"
                            )}
                        >
                            {isControleEnRetard
                                ? `Contrôle en retard de ${Math.abs(joursAvantControle!)} jours`
                                : isControleProche
                                  ? `Contrôle dans ${joursAvantControle} jours`
                                  : equipement.certificatValide
                                    ? "Certificat valide"
                                    : "Certificat non valide"}
                        </span>
                    </div>

                    {equipement.prochainControleAnnuel && (
                        <span className="text-[11px] text-black/40">
                            {format(
                                new Date(equipement.prochainControleAnnuel),
                                "dd MMM yyyy",
                                { locale: fr }
                            )}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
