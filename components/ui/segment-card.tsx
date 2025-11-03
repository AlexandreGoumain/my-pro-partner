import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Segment } from "@/lib/types";
import {
    BarChart3,
    Download,
    Edit,
    Mail,
    MoreHorizontal,
    Trash2,
} from "lucide-react";
import React from "react";

export interface SegmentCardProps {
    segment: Segment;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    percentage: number;
    totalClients: number;
    type: "predefined" | "custom";
    onExport: (segmentId: string, format: "csv" | "json") => void;
    onSendEmail: (segment: Segment) => void;
    onEdit?: (segment: Segment) => void;
    onDelete?: (segmentId: string) => void;
    onViewAnalytics: (segmentId: string) => void;
}

export function SegmentCard({
    segment,
    icon: Icon,
    percentage,
    type,
    onExport,
    onSendEmail,
    onEdit,
    onDelete,
    onViewAnalytics,
}: SegmentCardProps) {
    return (
        <Card className="group border-black/8 shadow-sm hover:border-black/20 transition-all duration-200 overflow-hidden py-2">
            <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-black/5 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <Icon
                                className="h-5 w-5 text-black/60"
                                strokeWidth={2}
                            />
                        </div>
                        <div>
                            <h4 className="text-[15px] font-medium tracking-[-0.01em] text-black mb-1.5">
                                {segment.nom}
                            </h4>
                            <Badge
                                variant="secondary"
                                className="bg-black/5 text-black/60 border-0 text-[11px] h-5 px-2"
                            >
                                {segment.nombreClients ?? 0} client
                                {(segment.nombreClients ?? 0) > 1 ? "s" : ""}
                            </Badge>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/5"
                            >
                                <MoreHorizontal
                                    className="h-4 w-4 text-black/60"
                                    strokeWidth={2}
                                />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-48 border-black/10"
                        >
                            {type === "custom" && onEdit && (
                                <>
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(segment);
                                        }}
                                        className="text-[13px]"
                                    >
                                        <Edit
                                            className="mr-2 h-4 w-4 text-black/60"
                                            strokeWidth={2}
                                        />
                                        <span className="text-black/80">
                                            Modifier
                                        </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-black/8" />
                                </>
                            )}
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onExport(segment.id, "csv");
                                }}
                                className="text-[13px]"
                            >
                                <Download
                                    className="mr-2 h-4 w-4 text-black/60"
                                    strokeWidth={2}
                                />
                                <span className="text-black/80">
                                    Exporter (CSV)
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSendEmail(segment);
                                }}
                                className="text-[13px]"
                            >
                                <Mail
                                    className="mr-2 h-4 w-4 text-black/60"
                                    strokeWidth={2}
                                />
                                <span className="text-black/80">
                                    Envoyer un email
                                </span>
                            </DropdownMenuItem>
                            {type === "custom" && onDelete && (
                                <>
                                    <DropdownMenuSeparator className="bg-black/8" />
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(segment.id);
                                        }}
                                        className="text-[13px] text-red-600"
                                    >
                                        <Trash2
                                            className="mr-2 h-4 w-4"
                                            strokeWidth={2}
                                        />
                                        <span>Supprimer</span>
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <p className="text-[13px] text-black/60 mb-4">
                    {segment.description}
                </p>

                {/* Progress bar */}
                <div>
                    <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-black transition-all duration-500"
                            style={{
                                width: `${percentage}%`,
                            }}
                        />
                    </div>
                    <p className="text-[12px] text-black/40 mt-2">
                        {percentage.toFixed(1)}% de votre base
                    </p>
                </div>
            </div>

            {/* Quick actions - visible on hover */}
            <div className="border-t border-black/8 p-3 bg-black/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-9 text-[13px] font-medium hover:bg-black/5"
                    onClick={(e) => {
                        e.stopPropagation();
                        onViewAnalytics(segment.id);
                    }}
                >
                    <BarChart3 className="h-4 w-4 mr-2" strokeWidth={2} />
                    Analytics
                </Button>
            </div>
        </Card>
    );
}
