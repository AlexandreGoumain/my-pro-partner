import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, Euro, Maximize, MapPin, Heart, Mail } from "lucide-react";
import type { RechercheAcquereur } from "@/lib/types/matching.types";
import { TYPE_BIEN_LABELS } from "@/lib/types/matching.types";

export interface RechercheCardProps {
    recherche: RechercheAcquereur;
    onView: (recherche: RechercheAcquereur) => void;
    onMatch: (recherche: RechercheAcquereur) => void;
    className?: string;
}

export function RechercheCard({ recherche, onView, onMatch, className }: RechercheCardProps) {
    const budgetText = recherche.budgetMin && recherche.budgetMax
        ? `${(recherche.budgetMin / 1000).toFixed(0)}k - ${(recherche.budgetMax / 1000).toFixed(0)}k €`
        : recherche.budgetMax
            ? `Max ${(recherche.budgetMax / 1000).toFixed(0)}k €`
            : recherche.budgetMin
                ? `Min ${(recherche.budgetMin / 1000).toFixed(0)}k €`
                : "Non défini";

    const surfaceText = recherche.surfaceMin && recherche.surfaceMax
        ? `${recherche.surfaceMin} - ${recherche.surfaceMax} m²`
        : recherche.surfaceMin
            ? `Min ${recherche.surfaceMin} m²`
            : recherche.surfaceMax
                ? `Max ${recherche.surfaceMax} m²`
                : null;

    return (
        <Card
            className={className}
            onClick={() => onView(recherche)}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-[15px] font-medium text-black">
                        {recherche.client.prenom} {recherche.client.nom}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        {recherche.client.email && (
                            <a
                                href={`mailto:${recherche.client.email}`}
                                className="text-[12px] text-black/40 hover:text-black flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Mail className="w-3 h-3" />
                                {recherche.client.email}
                            </a>
                        )}
                    </div>
                </div>
                {recherche.matchCount !== undefined && recherche.matchCount > 0 && (
                    <Badge variant="default" className="bg-black text-white text-[11px]">
                        {recherche.matchCount} match{recherche.matchCount > 1 ? "s" : ""}
                    </Badge>
                )}
            </div>

            {/* Critères */}
            <div className="space-y-3 mb-4">
                {/* Types de bien */}
                <div className="flex flex-wrap gap-1.5">
                    {recherche.typeBien.map((type) => (
                        <Badge key={type} variant="outline" className="text-[11px]">
                            <Home className="w-3 h-3 mr-1" />
                            {TYPE_BIEN_LABELS[type] || type}
                        </Badge>
                    ))}
                </div>

                {/* Budget */}
                <div className="flex items-center gap-2 text-[13px]">
                    <Euro className="w-4 h-4 text-black/40" />
                    <span className="text-black/60">{budgetText}</span>
                </div>

                {/* Surface */}
                {surfaceText && (
                    <div className="flex items-center gap-2 text-[13px]">
                        <Maximize className="w-4 h-4 text-black/40" />
                        <span className="text-black/60">{surfaceText}</span>
                        {recherche.nbPiecesMin && (
                            <span className="text-black/40">· Min {recherche.nbPiecesMin} pièces</span>
                        )}
                    </div>
                )}

                {/* Villes */}
                <div className="flex items-center gap-2 text-[13px]">
                    <MapPin className="w-4 h-4 text-black/40" />
                    <span className="text-black/60">
                        {recherche.villesRecherchees.slice(0, 3).join(", ")}
                        {recherche.villesRecherchees.length > 3 && (
                            <span className="text-black/40"> +{recherche.villesRecherchees.length - 3}</span>
                        )}
                    </span>
                </div>

                {/* Critères spécifiques */}
                {recherche.criteres && Object.keys(recherche.criteres).length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {Object.entries(recherche.criteres)
                            .filter(([_, v]) => v)
                            .map(([key]) => (
                                <span key={key} className="text-[11px] text-black/40 bg-black/5 px-2 py-0.5 rounded">
                                    {key}
                                </span>
                            ))}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <Button
                    variant="default"
                    size="sm"
                    className="bg-black hover:bg-black/90 text-white text-[12px] h-8 flex-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        onMatch(recherche);
                    }}
                >
                    <Heart className="w-3 h-3 mr-1.5" />
                    Trouver des biens
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-[12px] h-8"
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(recherche);
                    }}
                >
                    Voir
                </Button>
            </div>
        </Card>
    );
}
