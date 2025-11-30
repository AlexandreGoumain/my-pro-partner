"use client";

import { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MandatWithRelations } from "@/hooks/immobilier/use-mandats";
import {
    FileSignature,
    MoreHorizontal,
    Edit,
    Eye,
    Calendar,
    User,
    Home,
    AlertTriangle,
} from "lucide-react";
import { format, differenceInDays, isPast } from "date-fns";
import { fr } from "date-fns/locale";

interface MandatCardProps {
    mandat: MandatWithRelations;
    onView?: (mandat: MandatWithRelations) => void;
    onEdit?: (mandat: MandatWithRelations) => void;
    onRenew?: (mandat: MandatWithRelations) => void;
}

const TYPE_MANDAT_LABELS: Record<string, string> = {
    SIMPLE: "Simple",
    EXCLUSIF: "Exclusif",
    SEMI_EXCLUSIF: "Semi-exclusif",
    RECHERCHE: "Recherche",
};

const TYPE_MANDAT_COLORS: Record<string, string> = {
    SIMPLE: "bg-black/5 text-black/60 border-black/10",
    EXCLUSIF: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    SEMI_EXCLUSIF: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    RECHERCHE: "bg-purple-500/10 text-purple-700 border-purple-500/20",
};

const STATUT_COLORS: Record<string, string> = {
    ACTIF: "bg-green-500/10 text-green-700 border-green-500/20",
    EXPIRE: "bg-red-500/10 text-red-700 border-red-500/20",
    RESILIE: "bg-black/10 text-black/60 border-black/20",
    SUSPENDU: "bg-amber-500/10 text-amber-700 border-amber-500/20",
};

const STATUT_LABELS: Record<string, string> = {
    ACTIF: "Actif",
    EXPIRE: "Expiré",
    RESILIE: "Résilié",
    SUSPENDU: "Suspendu",
};

export const MandatCard = memo(function MandatCard({
    mandat,
    onView,
    onEdit,
    onRenew,
}: MandatCardProps) {
    const handleView = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            onView?.(mandat);
        },
        [mandat, onView]
    );

    const handleEdit = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            onEdit?.(mandat);
        },
        [mandat, onEdit]
    );

    const handleRenew = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            onRenew?.(mandat);
        },
        [mandat, onRenew]
    );

    const formatPrice = (price: number | null | undefined) => {
        if (!price) return "-";
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    const daysUntilExpiry = mandat.dateFin
        ? differenceInDays(new Date(mandat.dateFin), new Date())
        : null;

    const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry > 0 && daysUntilExpiry <= 30;
    const isExpired = mandat.dateFin && isPast(new Date(mandat.dateFin));

    return (
        <Card
            className="group relative cursor-pointer overflow-hidden border-black/[0.08] bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-500"
            onClick={handleView}
        >
            <div className="relative p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                            <FileSignature className="h-5 w-5 text-black/60" strokeWidth={2} />
                        </div>
                        <div>
                            <p className="text-[11px] text-black/40 font-medium">
                                {mandat.numero}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <Badge
                                    className={`text-[10px] font-medium border ${
                                        TYPE_MANDAT_COLORS[mandat.typeMandat] || "bg-black/5"
                                    }`}
                                >
                                    {TYPE_MANDAT_LABELS[mandat.typeMandat] || mandat.typeMandat}
                                </Badge>
                                <Badge
                                    className={`text-[10px] font-medium border ${
                                        STATUT_COLORS[mandat.statut] || "bg-black/5"
                                    }`}
                                >
                                    {STATUT_LABELS[mandat.statut] || mandat.statut}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-black/5 transition-all duration-200"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreHorizontal className="h-4 w-4 text-black/60" strokeWidth={2} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-white border-black/10">
                            <DropdownMenuItem onClick={handleView} className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" strokeWidth={2} />
                                Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" strokeWidth={2} />
                                Modifier
                            </DropdownMenuItem>
                            {isExpiringSoon && onRenew && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleRenew} className="cursor-pointer">
                                        <Calendar className="mr-2 h-4 w-4" strokeWidth={2} />
                                        Renouveler
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Bien */}
                {mandat.bien && (
                    <div className="flex items-center gap-2 p-3 bg-black/[0.02] rounded-lg mb-3">
                        <Home className="h-4 w-4 text-black/40" strokeWidth={2} />
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-black truncate">
                                {mandat.bien.titre}
                            </p>
                            <p className="text-[11px] text-black/40">
                                {mandat.bien.reference} • {mandat.bien.ville}
                            </p>
                        </div>
                        <p className="text-[14px] font-semibold text-black">
                            {formatPrice(Number(mandat.bien.prix))}
                        </p>
                    </div>
                )}

                {/* Mandant */}
                {mandat.mandant && (
                    <div className="flex items-center gap-2 mb-3">
                        <User className="h-4 w-4 text-black/40" strokeWidth={2} />
                        <p className="text-[13px] text-black/60">
                            {mandat.mandant.prenom} {mandat.mandant.nom}
                        </p>
                    </div>
                )}

                {/* Dates */}
                <div className="flex items-center gap-4 text-[12px] text-black/40 mb-4">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
                        <span>
                            {format(new Date(mandat.dateDebut), "dd MMM yyyy", { locale: fr })}
                        </span>
                    </div>
                    <span>→</span>
                    <span className={isExpired ? "text-red-600" : isExpiringSoon ? "text-amber-600" : ""}>
                        {format(new Date(mandat.dateFin), "dd MMM yyyy", { locale: fr })}
                    </span>
                </div>

                {/* Alerte expiration */}
                {isExpiringSoon && !isExpired && (
                    <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-amber-600" strokeWidth={2} />
                        <p className="text-[12px] text-amber-700 font-medium">
                            Expire dans {daysUntilExpiry} jour{daysUntilExpiry > 1 ? "s" : ""}
                        </p>
                    </div>
                )}

                {/* Agent */}
                {mandat.agent && (
                    <div className="flex items-center justify-between pt-3 border-t border-black/5 mt-3">
                        <p className="text-[11px] text-black/40">Agent responsable</p>
                        <p className="text-[12px] font-medium text-black/60">
                            {mandat.agent.prenom} {mandat.agent.nom}
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
});
