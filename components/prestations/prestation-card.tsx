"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Prestation } from "@/hooks/use-prestations";
import { Clock, Euro, MoreVertical, Pencil, Trash2 } from "lucide-react";

interface PrestationCardProps {
    prestation: Prestation;
    onEdit: (prestation: Prestation) => void;
    onDelete?: (prestation: Prestation) => void;
}

export function PrestationCard({
    prestation,
    onEdit,
    onDelete,
}: PrestationCardProps) {
    return (
        <Card
            className={`border-black/8 shadow-sm hover:border-black/15 transition-all cursor-pointer ${
                !prestation.actif ? "opacity-60" : ""
            }`}
            onClick={() => onEdit(prestation)}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-[15px] font-medium text-black truncate">
                                {prestation.nom}
                            </h3>
                            {!prestation.actif && (
                                <Badge
                                    variant="secondary"
                                    className="bg-black/5 text-black/40 text-[11px]"
                                >
                                    Inactif
                                </Badge>
                            )}
                        </div>
                        {prestation.description && (
                            <p className="text-[13px] text-black/50 line-clamp-2 mb-3">
                                {prestation.description}
                            </p>
                        )}
                        <div className="flex items-center gap-4 text-[13px] text-black/60">
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {prestation.duree} min
                            </span>
                            <span className="flex items-center gap-1 font-medium text-black">
                                <Euro className="w-3.5 h-3.5" />
                                {prestation.prix.toFixed(2)}
                            </span>
                        </div>
                    </div>
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
                                    onEdit(prestation);
                                }}
                            >
                                <Pencil className="w-4 h-4 mr-2" />
                                Modifier
                            </DropdownMenuItem>
                            {onDelete && (
                                <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(prestation);
                                    }}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Supprimer
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    );
}
