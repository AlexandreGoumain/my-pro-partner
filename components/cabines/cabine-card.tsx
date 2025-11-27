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
import { IconBox } from "@/components/ui/icon-box";
import type { Cabine } from "@/hooks/use-cabines";
import { CABINE_TYPES } from "@/hooks/use-cabines";
import { DoorOpen, MoreVertical, Pencil, Trash2 } from "lucide-react";

interface CabineCardProps {
    cabine: Cabine;
    onEdit: (cabine: Cabine) => void;
    onDelete?: (cabine: Cabine) => void;
}

export function CabineCard({ cabine, onEdit, onDelete }: CabineCardProps) {
    const typeLabel =
        CABINE_TYPES.find((t) => t.value === cabine.type)?.label || cabine.type;

    return (
        <Card
            className={`border-black/8 shadow-sm hover:border-black/15 transition-all cursor-pointer ${
                !cabine.actif ? "opacity-60" : ""
            }`}
            onClick={() => onEdit(cabine)}
        >
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    {/* Icon with color */}
                    <IconBox
                        icon={DoorOpen}
                        shape="rounded"
                        bgStyle={{
                            backgroundColor: cabine.couleur || "#f3f4f6",
                        }}
                        iconStyle={{
                            color: cabine.couleur ? "#fff" : "#6b7280",
                        }}
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-[15px] font-medium text-black truncate">
                                {cabine.nom}
                            </h3>
                            {!cabine.actif && (
                                <Badge
                                    variant="secondary"
                                    className="bg-black/5 text-black/40 text-[11px]"
                                >
                                    Inactive
                                </Badge>
                            )}
                        </div>

                        {typeLabel && (
                            <p className="text-[13px] text-black/50 mb-1">
                                {typeLabel}
                            </p>
                        )}

                        <div className="flex items-center gap-3 text-[12px] text-black/40">
                            <span>Capacité : {cabine.capacite} pers.</span>
                            {cabine._count?.rendezVous !== undefined && (
                                <span>{cabine._count.rendezVous} RDV</span>
                            )}
                        </div>

                        {cabine.equipements && (
                            <p className="text-[12px] text-black/40 mt-1 truncate">
                                {cabine.equipements}
                            </p>
                        )}
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
                                    onEdit(cabine);
                                }}
                            >
                                <Pencil className="w-4 h-4 mr-2" />
                                Modifier
                            </DropdownMenuItem>
                            {onDelete && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(cabine);
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
