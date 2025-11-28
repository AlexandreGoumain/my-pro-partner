"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { EntreeTemps } from "@/lib/types/mission";
import { formatDuree } from "@/lib/types/mission";
import { cn } from "@/lib/utils";
import { Clock, MoreVertical, Pencil, Trash2 } from "lucide-react";

export interface TimeEntryCardProps {
    entry: EntreeTemps;
    onEdit?: (entry: EntreeTemps) => void;
    onDelete?: (entry: EntreeTemps) => void;
    className?: string;
}

export function TimeEntryCard({
    entry,
    onEdit,
    onDelete,
    className,
}: TimeEntryCardProps) {
    const formattedDate = new Date(entry.date).toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });

    return (
        <Card
            className={cn(
                "p-4 border-black/8 hover:border-black/15 transition-colors",
                className
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    {/* Mission info */}
                    {entry.mission && (
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[12px] font-medium text-black/60">
                                {entry.mission.numero}
                            </span>
                            <span className="text-[12px] text-black/40">•</span>
                            <span className="text-[13px] font-medium text-black/80 truncate">
                                {entry.mission.nom}
                            </span>
                        </div>
                    )}

                    {/* Description */}
                    <p className="text-[14px] text-black/80 line-clamp-2 mb-3">
                        {entry.description}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-[12px] text-black/40">
                            {formattedDate}
                        </span>

                        {entry.mission?.client && (
                            <>
                                <span className="text-[12px] text-black/20">
                                    •
                                </span>
                                <span className="text-[12px] text-black/40">
                                    {entry.mission.client.nom}
                                </span>
                            </>
                        )}

                        {!entry.facturable && (
                            <Badge
                                variant="outline"
                                className="text-[10px] h-5 border-black/10 text-black/40"
                            >
                                Non facturable
                            </Badge>
                        )}

                        {entry.facturee && (
                            <Badge className="text-[10px] h-5 bg-black/10 text-black/60 hover:bg-black/10">
                                Facturé
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Duration and actions */}
                <div className="flex items-start gap-2">
                    <div className="text-right">
                        <div className="flex items-center gap-1.5 text-[16px] font-semibold tracking-[-0.01em]">
                            <Clock className="h-4 w-4 text-black/40" />
                            {formatDuree(entry.duree)}
                        </div>
                        {entry.facturable && (
                            <div className="text-[12px] text-black/40 mt-0.5">
                                {entry.montant.toLocaleString("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                })}
                            </div>
                        )}
                    </div>

                    {(onEdit || onDelete) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-black/40 hover:text-black/80"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {onEdit && (
                                    <DropdownMenuItem
                                        onClick={() => onEdit(entry)}
                                    >
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Modifier
                                    </DropdownMenuItem>
                                )}
                                {onDelete && !entry.facturee && (
                                    <DropdownMenuItem
                                        onClick={() => onDelete(entry)}
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
        </Card>
    );
}
