import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Building2, Calendar, MapPin, Clock,
    FileText, Send, Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AssembleeGenerale } from "@/lib/types/ag.types";
import { TYPE_LABELS, STATUT_CONFIG } from "@/lib/constants/ag.constants";

export interface AGCardProps {
    ag: AssembleeGenerale;
    onView: (ag: AssembleeGenerale) => void;
    onAction: (ag: AssembleeGenerale, action: string) => void;
    className?: string;
}

export function AGCard({ ag, onView, onAction, className }: AGCardProps) {
    const statutConfig = STATUT_CONFIG[ag.statut];
    const agDate = new Date(ag.dateAG);
    const isFuture = agDate > new Date();
    const isToday = agDate.toDateString() === new Date().toDateString();
    const daysUntil = Math.ceil((agDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    return (
        <Card
            className={cn(
                "p-5 border-black/[0.08] hover:border-black/20 transition-all cursor-pointer",
                isToday && "border-l-4 border-l-black",
                className
            )}
            onClick={() => onView(ag)}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[12px] text-black/40">{ag.reference}</span>
                        <Badge variant={statutConfig.variant} className="text-[10px] h-5">
                            {statutConfig.label}
                        </Badge>
                    </div>
                    <h3 className="text-[15px] font-medium text-black">
                        {TYPE_LABELS[ag.type]}
                    </h3>
                </div>
                <Badge variant="outline" className="text-[10px]">
                    {ag.nbResolutions} résolutions
                </Badge>
            </div>

            {/* Copropriété */}
            <div className="flex items-center gap-2 text-[13px] text-black/60 mb-3">
                <Building2 className="w-4 h-4 text-black/40" />
                <span>{ag.copropriete.nom}</span>
            </div>

            {/* Date et heure */}
            <div className="flex items-center gap-2 text-[13px] mb-2">
                <Calendar className="w-4 h-4 text-black/40" />
                <span className={cn(
                    isToday ? "text-black font-medium" : isFuture ? "text-black/60" : "text-black/40"
                )}>
                    {agDate.toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    })}
                </span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-black/40 mb-3">
                <Clock className="w-3.5 h-3.5" />
                <span>{ag.heureDebut}</span>
            </div>

            {/* Lieu */}
            <div className="flex items-start gap-2 text-[12px] text-black/40 mb-4">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{ag.lieu}</span>
            </div>

            {/* Countdown ou résultats */}
            {isFuture && daysUntil <= 30 && (
                <div className="bg-black/[0.02] rounded-lg p-2 mb-4">
                    <p className="text-[12px] text-black/60 text-center">
                        {isToday ? "Aujourd'hui" : `Dans ${daysUntil} jour${daysUntil > 1 ? "s" : ""}`}
                    </p>
                </div>
            )}

            {ag.statut === "TERMINEE" || ag.statut === "PV_ENVOYE" ? (
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-black/[0.02] rounded-lg p-2 text-center">
                        <p className="text-[14px] font-bold text-black">{ag.quorum}%</p>
                        <p className="text-[10px] text-black/40">Quorum</p>
                    </div>
                    <div className="bg-black/[0.02] rounded-lg p-2 text-center">
                        <p className="text-[14px] font-bold text-black">{ag.nbPresents}</p>
                        <p className="text-[10px] text-black/40">Présents</p>
                    </div>
                    <div className="bg-black/[0.02] rounded-lg p-2 text-center">
                        <p className="text-[14px] font-bold text-black">{ag.nbRepresentes}</p>
                        <p className="text-[10px] text-black/40">Représentés</p>
                    </div>
                </div>
            ) : null}

            {/* Actions */}
            <div className="flex gap-2">
                {ag.statut === "PLANIFIEE" && (
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-black hover:bg-black/90 text-white text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(ag, "convoquer");
                        }}
                    >
                        <Send className="w-3 h-3 mr-1" />
                        Convoquer
                    </Button>
                )}
                {ag.statut === "CONVOCATIONS_ENVOYEES" && (
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-black hover:bg-black/90 text-white text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(ag, "feuille_presence");
                        }}
                    >
                        <FileText className="w-3 h-3 mr-1" />
                        Feuille présence
                    </Button>
                )}
                {ag.statut === "TERMINEE" && (
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-black hover:bg-black/90 text-white text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(ag, "envoyer_pv");
                        }}
                    >
                        <Send className="w-3 h-3 mr-1" />
                        Envoyer PV
                    </Button>
                )}
                {ag.statut === "PV_ENVOYE" && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(ag, "telecharger_pv");
                        }}
                    >
                        <Download className="w-3 h-3 mr-1" />
                        Télécharger PV
                    </Button>
                )}
                <Button
                    variant="outline"
                    size="sm"
                    className="text-[11px] h-7"
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(ag);
                    }}
                >
                    Détails
                </Button>
            </div>
        </Card>
    );
}
