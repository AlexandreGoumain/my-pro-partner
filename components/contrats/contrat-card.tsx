import { AlertCircle } from "lucide-react";
import {
    STATUT_CONTRAT_LABELS,
    TYPE_CONTRAT_LABELS,
    type ContratEntretien,
    type StatutContrat,
} from "@/lib/types/contrats";
import { cn } from "@/lib/utils";

export interface ContratCardProps {
    contrat: ContratEntretien;
    onClick?: () => void;
    className?: string;
}

const STATUT_BADGE_COLORS: Record<StatutContrat, string> = {
    ACTIF: "bg-green-100 text-green-800 border-green-200",
    EXPIRE: "bg-red-100 text-red-800 border-red-200",
    RESILIE: "bg-black/10 text-black/60 border-black/20",
    EN_ATTENTE: "bg-orange-100 text-orange-800 border-orange-200",
    SUSPENDU: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

function isRevisionProche(date: string | null | undefined): boolean {
    if (!date) return false;
    const revision = new Date(date);
    const now = new Date();
    const diffDays = Math.ceil(
        (revision.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 30 && diffDays >= 0;
}

export function ContratCard({ contrat, onClick, className }: ContratCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "p-5 rounded-xl bg-white border border-black/8 shadow-sm hover:border-black/20 hover:shadow-md transition-all duration-200",
                onClick && "cursor-pointer",
                className
            )}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-[16px] font-semibold text-black">
                            {contrat.numero} - {contrat.nom}
                        </h3>
                        <span
                            className={cn(
                                "px-3 py-1 rounded-lg text-[12px] font-medium border",
                                STATUT_BADGE_COLORS[contrat.statut]
                            )}
                        >
                            {STATUT_CONTRAT_LABELS[contrat.statut]}
                        </span>
                        {isRevisionProche(contrat.prochaineRevision) && (
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-orange-100 text-orange-800 border border-orange-200 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" strokeWidth={2} />
                                Révision proche
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[13px] text-black/60">
                            {contrat.client?.prenom} {contrat.client?.nom}
                        </span>
                        <span className="text-[13px] text-black/30">•</span>
                        <span className="text-[13px] text-black/60">
                            {TYPE_CONTRAT_LABELS[contrat.typeContrat]}
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[20px] font-bold text-black mb-1">
                        {Number(contrat.montantTTC).toFixed(2)}€
                    </p>
                    <p className="text-[12px] text-black/40">par an</p>
                </div>
            </div>

            <div className="flex items-center justify-between text-[13px] text-black/50">
                <div className="flex items-center gap-4">
                    <span>
                        Début:{" "}
                        {new Date(contrat.dateDebut).toLocaleDateString("fr-FR")}
                    </span>
                    <span>
                        Fin:{" "}
                        {new Date(contrat.dateFin).toLocaleDateString("fr-FR")}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span>
                        Interventions: {contrat.interventionsUtilisees}/
                        {contrat.interventionsIncluses}
                    </span>
                    <span>{contrat.nombreRevisionsAn} révision(s)/an</span>
                </div>
            </div>
        </div>
    );
}
