"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Camionnette } from "@/lib/types/flotte";
import { Gauge, MoreVertical, Package, Pencil, Trash2, Truck, User } from "lucide-react";

export interface CamionnetteCardProps {
    camionnette: Camionnette;
    onEdit?: (camionnette: Camionnette) => void;
    onDelete?: (camionnette: Camionnette) => void;
}

export function CamionnetteCard({
    camionnette,
    onEdit,
    onDelete,
}: CamionnetteCardProps) {
    return (
        <div
            className={`p-5 rounded-xl bg-white border shadow-sm hover:shadow-md transition-all duration-200 ${
                camionnette.actif
                    ? "border-black/8"
                    : "border-black/5 opacity-60"
            }`}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            camionnette.actif ? "bg-black/5" : "bg-black/2"
                        }`}
                    >
                        <Truck
                            className={`w-6 h-6 ${
                                camionnette.actif
                                    ? "text-black/60"
                                    : "text-black/30"
                            }`}
                            strokeWidth={2}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-[16px] font-semibold text-black font-mono">
                                {camionnette.immatriculation}
                            </h3>
                            {!camionnette.actif && (
                                <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/5 text-black/50">
                                    Inactif
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-[13px] text-black/50">
                            {camionnette.marque && (
                                <span>
                                    {camionnette.marque} {camionnette.modele}
                                </span>
                            )}
                            {camionnette.annee && <span>{camionnette.annee}</span>}
                        </div>
                    </div>
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
                                <DropdownMenuItem onClick={() => onEdit(camionnette)}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Modifier
                                </DropdownMenuItem>
                            )}
                            {onDelete && (
                                <DropdownMenuItem
                                    onClick={() => onDelete(camionnette)}
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

            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-black/5">
                <div className="flex items-center gap-2 text-[13px] text-black/50">
                    <User className="w-4 h-4" strokeWidth={2} />
                    <span>{camionnette.plombierPrincipal?.name || "Non assigné"}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-black/50">
                    <Gauge className="w-4 h-4" strokeWidth={2} />
                    <span>
                        {camionnette.kilometres?.toLocaleString("fr-FR") || 0} km
                    </span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-black/50">
                    <Package className="w-4 h-4" strokeWidth={2} />
                    <span>{camionnette._count?.stock || 0} articles en stock</span>
                </div>
            </div>
        </div>
    );
}
