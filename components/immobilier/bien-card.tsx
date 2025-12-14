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
import type { BienWithRelations } from "@/hooks/immobilier/use-biens";
import {
    BedDouble,
    Calendar,
    Edit,
    Eye,
    Home,
    MapPin,
    Maximize,
    MoreHorizontal,
    Share2,
    Trash2,
} from "lucide-react";
import { memo, useCallback } from "react";

interface BienCardProps {
    bien: BienWithRelations;
    onView?: (bien: BienWithRelations) => void;
    onEdit?: (bien: BienWithRelations) => void;
    onDelete?: (bien: BienWithRelations) => void;
    onDiffuse?: (bien: BienWithRelations) => void;
}

const TYPE_BIEN_LABELS: Record<string, string> = {
    APPARTEMENT: "Appartement",
    MAISON: "Maison",
    TERRAIN: "Terrain",
    LOCAL_COMMERCIAL: "Local commercial",
    BUREAU: "Bureau",
    IMMEUBLE: "Immeuble",
    PARKING: "Parking",
    CAVE: "Cave",
    AUTRE: "Autre",
};

const STATUT_COLORS: Record<string, string> = {
    DISPONIBLE: "bg-green-500/10 text-green-700 border-green-500/20",
    EN_ATTENTE: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    SOUS_COMPROMIS: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    VENDU: "bg-black/10 text-black/60 border-black/20",
    LOUE: "bg-purple-500/10 text-purple-700 border-purple-500/20",
    RETIRE: "bg-red-500/10 text-red-700 border-red-500/20",
};

const STATUT_LABELS: Record<string, string> = {
    DISPONIBLE: "Disponible",
    EN_ATTENTE: "En attente",
    SOUS_COMPROMIS: "Sous compromis",
    VENDU: "Vendu",
    LOUE: "Loué",
    RETIRE: "Retiré",
};

export const BienCard = memo(function BienCard({
    bien,
    onView,
    onEdit,
    onDelete,
    onDiffuse,
}: BienCardProps) {
    const handleView = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            onView?.(bien);
        },
        [bien, onView]
    );

    const handleEdit = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            onEdit?.(bien);
        },
        [bien, onEdit]
    );

    const handleDelete = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            onDelete?.(bien);
        },
        [bien, onDelete]
    );

    const handleDiffuse = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            onDiffuse?.(bien);
        },
        [bien, onDiffuse]
    );

    const formatPrice = (price: number | null) => {
        if (!price) return "Prix non défini";
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    const photos = bien.photos as string[] | null;
    const firstPhoto = photos?.[0];

    return (
        <Card
            className="group relative cursor-pointer overflow-hidden border-black/[0.08] bg-white hover:shadow-sm transition-all duration-300"
            onClick={handleView}
        >
            {/* Image */}
            <div className="relative aspect-[4/3] bg-black/5 overflow-hidden">
                {firstPhoto ? (
                    <img
                        src={firstPhoto}
                        alt={bien.titre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Home
                            className="h-12 w-12 text-black/20"
                            strokeWidth={1.5}
                        />
                    </div>
                )}

                {/* Badge statut */}
                <Badge
                    className={`absolute top-3 left-3 text-[11px] font-medium border ${
                        STATUT_COLORS[bien.statut] ||
                        "bg-black/10 text-black/60"
                    }`}
                >
                    {STATUT_LABELS[bien.statut] || bien.statut}
                </Badge>

                {/* Stats overlay */}
                {bien._count && (
                    <div className="absolute bottom-3 left-3 flex gap-2">
                        {bien._count.visites > 0 && (
                            <div className="flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded text-[11px]">
                                <Calendar className="h-3 w-3" />
                                {bien._count.visites}
                            </div>
                        )}
                        {bien._count.diffusions > 0 && (
                            <div className="flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded text-[11px]">
                                <Share2 className="h-3 w-3" />
                                {bien._count.diffusions}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="relative p-4">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-black/40 font-medium mb-1">
                            {bien.reference} •{" "}
                            {TYPE_BIEN_LABELS[bien.typeBien] || bien.typeBien}
                        </p>
                        <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-black line-clamp-1">
                            {bien.titre}
                        </h3>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-black/5 transition-all duration-200 shrink-0"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreHorizontal
                                    className="h-4 w-4 text-black/60"
                                    strokeWidth={2}
                                />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-48 bg-white border-black/10"
                        >
                            <DropdownMenuItem
                                onClick={handleView}
                                className="cursor-pointer"
                            >
                                <Eye className="mr-2 h-4 w-4" strokeWidth={2} />
                                Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={handleEdit}
                                className="cursor-pointer"
                            >
                                <Edit
                                    className="mr-2 h-4 w-4"
                                    strokeWidth={2}
                                />
                                Modifier
                            </DropdownMenuItem>
                            {onDiffuse && (
                                <DropdownMenuItem
                                    onClick={handleDiffuse}
                                    className="cursor-pointer"
                                >
                                    <Share2
                                        className="mr-2 h-4 w-4"
                                        strokeWidth={2}
                                    />
                                    Diffuser
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleDelete}
                                className="text-black/80 cursor-pointer"
                            >
                                <Trash2
                                    className="mr-2 h-4 w-4"
                                    strokeWidth={2}
                                />
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Location */}
                {bien.ville && (
                    <div className="flex items-center gap-1.5 text-[13px] text-black/60 mb-3">
                        <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
                        <span>{bien.ville}</span>
                    </div>
                )}

                {/* Caractéristiques */}
                <div className="flex items-center gap-4 text-[13px] text-black/60 mb-4">
                    {bien.surface && (
                        <div className="flex items-center gap-1">
                            <Maximize className="h-3.5 w-3.5" strokeWidth={2} />
                            <span>{Number(bien.surface)} m²</span>
                        </div>
                    )}
                    {bien.nbChambres && (
                        <div className="flex items-center gap-1">
                            <BedDouble
                                className="h-3.5 w-3.5"
                                strokeWidth={2}
                            />
                            <span>{bien.nbChambres} ch.</span>
                        </div>
                    )}
                    {bien.dpeConsommation && (
                        <div className="flex items-center gap-1 font-medium">
                            DPE {bien.dpeConsommation}
                        </div>
                    )}
                </div>

                {/* Prix */}
                <div className="flex items-center justify-between pt-3 border-t border-black/5">
                    <p className="text-[18px] font-bold tracking-[-0.02em] text-black">
                        {formatPrice(
                            Number(bien.prixVente || bien.prixLocation)
                        )}
                    </p>
                    {bien.proprietaire && (
                        <p className="text-[12px] text-black/40">
                            {bien.proprietaire.nom}
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
});
