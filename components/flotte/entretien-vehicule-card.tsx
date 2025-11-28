"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
    EntretienVehicule,
    TypeEntretienVehicule,
} from "@/lib/types/flotte";
import { TYPE_ENTRETIEN_LABELS } from "@/lib/types/flotte";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Car, Gauge, MoreVertical, Pencil, Trash2, Wrench } from "lucide-react";

export interface EntretienVehiculeCardProps {
    entretien: EntretienVehicule;
    onEdit?: (entretien: EntretienVehicule) => void;
    onDelete?: (entretien: EntretienVehicule) => void;
}

function getTypeColor(type: TypeEntretienVehicule) {
    switch (type) {
        case "CONTROLE_TECHNIQUE":
            return "bg-red-100 text-red-700";
        case "REVISION":
            return "bg-blue-100 text-blue-700";
        case "VIDANGE":
            return "bg-amber-100 text-amber-700";
        case "PNEUS":
            return "bg-slate-100 text-slate-700";
        case "FREINS":
            return "bg-orange-100 text-orange-700";
        case "REPARATION":
            return "bg-purple-100 text-purple-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
}

export function EntretienVehiculeCard({
    entretien,
    onEdit,
    onDelete,
}: EntretienVehiculeCardProps) {
    return (
        <div className="p-5 rounded-xl bg-white border border-black/8 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-black/5 flex items-center justify-center">
                        <Wrench className="w-6 h-6 text-black/60" strokeWidth={2} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span
                                className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${getTypeColor(entretien.type)}`}
                            >
                                {TYPE_ENTRETIEN_LABELS[entretien.type]}
                            </span>
                            <span className="text-[14px] text-black/40">
                                {format(
                                    new Date(entretien.dateEntretien),
                                    "d MMMM yyyy",
                                    { locale: fr }
                                )}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <Car className="w-4 h-4 text-black/40" strokeWidth={2} />
                            <span className="text-[15px] font-medium text-black font-mono">
                                {entretien.camionnette?.immatriculation}
                            </span>
                            {entretien.camionnette?.marque && (
                                <span className="text-[13px] text-black/50">
                                    {entretien.camionnette.marque}{" "}
                                    {entretien.camionnette.modele}
                                </span>
                            )}
                        </div>
                        {entretien.description && (
                            <p className="text-[13px] text-black/50 mt-1 line-clamp-1">
                                {entretien.description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        {entretien.cout && (
                            <p className="text-[16px] font-semibold text-black">
                                {Number(entretien.cout).toLocaleString("fr-FR")} €
                            </p>
                        )}
                        {entretien.kilometrage && (
                            <div className="flex items-center gap-1 text-[12px] text-black/40 mt-1">
                                <Gauge className="w-3 h-3" strokeWidth={2} />
                                <span>
                                    {entretien.kilometrage.toLocaleString("fr-FR")} km
                                </span>
                            </div>
                        )}
                    </div>
                    {(onEdit || onDelete) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {onEdit && (
                                    <DropdownMenuItem onClick={() => onEdit(entretien)}>
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Modifier
                                    </DropdownMenuItem>
                                )}
                                {onDelete && (
                                    <DropdownMenuItem
                                        onClick={() => onDelete(entretien)}
                                        className="text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Supprimer
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            {(entretien.prestataire || entretien.dateProchain) && (
                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-black/5 text-[13px] text-black/50">
                    {entretien.prestataire && (
                        <span>Prestataire : {entretien.prestataire}</span>
                    )}
                    {entretien.dateProchain && (
                        <span>
                            Prochain :{" "}
                            {format(new Date(entretien.dateProchain), "d MMM yyyy", {
                                locale: fr,
                            })}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
