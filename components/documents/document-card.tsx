"use client";

import { memo } from "react";
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
import { DocumentStatusBadge } from "@/components/ui/document-status-badge";
import {
    Calendar,
    Edit,
    Eye,
    FileText,
    MoreHorizontal,
    Receipt,
    Trash2,
    User,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DocumentCardProps<T> {
    document: T & {
        id: string;
        numero: string;
        dateEmission: Date;
        statut: "BROUILLON" | "ENVOYE" | "ACCEPTE" | "REFUSE" | "PAYE" | "ANNULE";
        client: {
            nom: string;
            prenom: string | null;
        };
        total_ttc: number;
    };
    type: "DEVIS" | "FACTURE" | "AVOIR";
    onView?: (doc: T) => void;
    onEdit?: (doc: T) => void;
    onDelete?: (doc: T) => void;
    onConvertToInvoice?: (doc: T) => void;
}

const TYPE_CONFIG = {
    DEVIS: {
        icon: FileText,
        bgClass: "bg-blue-50",
        iconClass: "text-blue-500",
        borderClass: "border-blue-200",
        label: "Devis",
    },
    FACTURE: {
        icon: Receipt,
        bgClass: "bg-green-50",
        iconClass: "text-green-500",
        borderClass: "border-green-200",
        label: "Facture",
    },
    AVOIR: {
        icon: Receipt,
        bgClass: "bg-red-50",
        iconClass: "text-red-500",
        borderClass: "border-red-200",
        label: "Avoir",
    },
};

export const DocumentCard = memo(function DocumentCard<T>({
    document,
    type,
    onView,
    onEdit,
    onDelete,
    onConvertToInvoice,
}: DocumentCardProps<T>) {
    const config = TYPE_CONFIG[type];
    const Icon = config.icon;
    const clientName = `${document.client.nom}${document.client.prenom ? ` ${document.client.prenom}` : ""}`;

    return (
        <Card
            className={`group overflow-hidden hover:shadow-lg transition-all ${config.borderClass}`}
        >
            {/* Header with icon */}
            <div className={`relative p-6 ${config.bgClass}`}>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-12 h-12 rounded-lg ${config.bgClass} border ${config.borderClass} flex items-center justify-center`}
                        >
                            <Icon className={`h-6 w-6 ${config.iconClass}`} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-[15px] tracking-[-0.01em]">
                                {document.numero}
                            </h3>
                            <p className="text-[13px] text-black/50 mt-0.5">
                                {config.label}
                            </p>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 cursor-pointer"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onView?.(document as T)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit?.(document as T)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                            </DropdownMenuItem>
                            {type === "DEVIS" && onConvertToInvoice && document.statut === "ACCEPTE" && (
                                <DropdownMenuItem
                                    onClick={() => onConvertToInvoice(document as T)}
                                >
                                    <Receipt className="mr-2 h-4 w-4" />
                                    Convertir en facture
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete?.(document as T)}
                                className="text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Status Badge */}
                <div className="mt-4">
                    <DocumentStatusBadge status={document.statut} />
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                {/* Client */}
                <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-black/40 mt-0.5" strokeWidth={2} />
                    <div className="flex-1">
                        <p className="text-[13px] text-black/50 mb-0.5">Client</p>
                        <p className="text-[14px] font-medium">{clientName}</p>
                    </div>
                </div>

                {/* Date */}
                <div className="flex items-start gap-2">
                    <Calendar
                        className="h-4 w-4 text-black/40 mt-0.5"
                        strokeWidth={2}
                    />
                    <div className="flex-1">
                        <p className="text-[13px] text-black/50 mb-0.5">
                            Date d'émission
                        </p>
                        <p className="text-[14px] font-medium">
                            {format(new Date(document.dateEmission), "d MMMM yyyy", {
                                locale: fr,
                            })}
                        </p>
                    </div>
                </div>

                {/* Amount */}
                <div className="pt-4 border-t border-black/5">
                    <p className="text-[13px] text-black/50 mb-1">Montant total TTC</p>
                    <p className="text-[24px] font-bold tracking-[-0.02em]">
                        {Number(document.total_ttc || 0).toFixed(2)} €
                    </p>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="px-4 pb-4 flex gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 cursor-pointer h-9"
                    onClick={() => onView?.(document as T)}
                >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 cursor-pointer h-9"
                    onClick={() => onEdit?.(document as T)}
                >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                </Button>
            </div>
        </Card>
    );
});
