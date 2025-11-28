"use client";

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
import {
    type Affaire,
    DOMAINE_JURIDIQUE_LABELS,
    JURIDICTION_LABELS,
    STATUT_AFFAIRE_COLORS,
    STATUT_AFFAIRE_LABELS,
    TYPE_HONORAIRES_LABELS,
} from "@/lib/types/juridique";
import { cn } from "@/lib/utils";
import {
    AlertCircle,
    Clock,
    FileText,
    MoreHorizontal,
    Scale,
    User,
} from "lucide-react";

export interface AffaireCardProps {
    affaire: Affaire & {
        _count?: {
            parties: number;
            echeances: number;
            diligences: number;
        };
    };
    onClick?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    className?: string;
}

export function AffaireCard({
    affaire,
    onClick,
    onEdit,
    onDelete,
    className,
}: AffaireCardProps) {
    const hasProchainEcheance = affaire.prochainEcheance;

    return (
        <Card
            className={cn(
                "p-4 border-black/8 hover:border-black/15 transition-colors cursor-pointer",
                className
            )}
            onClick={onClick}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    {/* Header: Reference & Status */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[12px] font-mono text-black/40">
                            {affaire.reference}
                        </span>
                        <Badge
                            variant="outline"
                            className={cn(
                                "text-[10px] px-1.5 py-0",
                                STATUT_AFFAIRE_COLORS[affaire.statut]
                            )}
                        >
                            {STATUT_AFFAIRE_LABELS[affaire.statut]}
                        </Badge>
                        {!affaire.conflitVerifie && (
                            <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 bg-orange-50 text-orange-600 border-orange-200"
                            >
                                <AlertCircle className="h-3 w-3 mr-0.5" />
                                Conflit à vérifier
                            </Badge>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-[15px] font-medium text-black mb-1 line-clamp-1">
                        {affaire.intitule}
                    </h3>

                    {/* Client & Domain */}
                    <div className="flex items-center gap-3 text-[13px] text-black/50 mb-2">
                        <div className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            <span className="truncate max-w-[150px]">
                                {affaire.client.nom}
                                {affaire.client.prenom &&
                                    ` ${affaire.client.prenom}`}
                            </span>
                        </div>
                        <span className="text-black/20">•</span>
                        <span>{DOMAINE_JURIDIQUE_LABELS[affaire.domaine]}</span>
                    </div>

                    {/* Juridiction & RG */}
                    {(affaire.juridiction || affaire.numeroRG) && (
                        <div className="flex items-center gap-2 text-[12px] text-black/40 mb-2">
                            <Scale className="h-3 w-3" />
                            {affaire.juridiction && (
                                <span>
                                    {JURIDICTION_LABELS[affaire.juridiction]}
                                </span>
                            )}
                            {affaire.numeroRG && (
                                <>
                                    <span className="text-black/20">-</span>
                                    <span className="font-mono">
                                        RG {affaire.numeroRG}
                                    </span>
                                </>
                            )}
                        </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-[12px] text-black/40">
                        {affaire._count && (
                            <>
                                <div className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    <span>
                                        {affaire._count.echeances} échéance
                                        {affaire._count.echeances > 1
                                            ? "s"
                                            : ""}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                        {affaire._count.diligences} diligence
                                        {affaire._count.diligences > 1
                                            ? "s"
                                            : ""}
                                    </span>
                                </div>
                            </>
                        )}
                        {affaire.typeHonoraires && (
                            <span className="text-black/30">
                                {TYPE_HONORAIRES_LABELS[affaire.typeHonoraires]}
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {hasProchainEcheance && (
                        <div className="text-right">
                            <p className="text-[10px] text-black/40 uppercase tracking-wider">
                                Prochaine échéance
                            </p>
                            <p className="text-[13px] font-medium text-black">
                                {new Date(
                                    affaire.prochainEcheance!.dateEcheance
                                ).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "short",
                                })}
                            </p>
                        </div>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit?.();
                                }}
                            >
                                Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete?.();
                                }}
                            >
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </Card>
    );
}
