import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Table, TableStatus } from "@/lib/types/table.types";
import { cn } from "@/lib/utils";
import {
    getTableStatusBadgeColor,
    getTableStatusCardColor,
} from "@/lib/utils/badge-colors";
import { Clock, MapPin, Users } from "lucide-react";

export interface TableCardProps {
    table: Table;
    onClick?: (table: Table) => void;
    className?: string;
}

const TABLE_STATUS_LABELS: Record<TableStatus, string> = {
    LIBRE: "Libre",
    OCCUPEE: "Occupée",
    RESERVEE: "Réservée",
};

export function TableCard({ table, onClick, className }: TableCardProps) {
    return (
        <Card
            className={cn(
                "border shadow-sm transition-all duration-200",
                getTableStatusCardColor(table.statut),
                onClick && "cursor-pointer",
                className
            )}
            onClick={() => onClick?.(table)}
        >
            <div className="p-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-black">
                        Table {table.numero}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[14px] text-black/60">
                        <Users className="h-4 w-4" strokeWidth={2} />
                        <span className="font-medium">{table.capacite}</span>
                    </div>
                </div>

                {/* Zone */}
                <div className="flex items-center gap-1.5 mb-3">
                    <MapPin
                        className="h-3.5 w-3.5 text-black/40"
                        strokeWidth={2}
                    />
                    <span className="text-[13px] text-black/60">
                        {table.zone}
                    </span>
                </div>

                {/* Status Badge */}
                <Badge
                    variant="outline"
                    className={cn(
                        "text-[12px] font-medium border",
                        getTableStatusBadgeColor(table.statut)
                    )}
                >
                    {TABLE_STATUS_LABELS[table.statut]}
                </Badge>

                {/* Client info (if occupied or reserved) */}
                {table.client && (
                    <div className="mt-3 pt-3 border-t border-black/8">
                        <p className="text-[14px] font-medium text-black mb-1">
                            {table.client}
                        </p>
                        {table.depuis && (
                            <div className="flex items-center gap-1.5">
                                <Clock
                                    className="h-3.5 w-3.5 text-black/40"
                                    strokeWidth={2}
                                />
                                <span className="text-[13px] text-black/60">
                                    Depuis {table.depuis}
                                </span>
                            </div>
                        )}
                        {table.heure && (
                            <div className="flex items-center gap-1.5">
                                <Clock
                                    className="h-3.5 w-3.5 text-black/40"
                                    strokeWidth={2}
                                />
                                <span className="text-[13px] text-black/60">
                                    À {table.heure}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}
