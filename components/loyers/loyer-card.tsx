import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, User, Calendar, Send, Download, Euro } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LoyerWithRelations } from "@/hooks/gestion-locative/use-loyers";

const STATUT_CONFIG: Record<string, { label: string; variant: "default" | "outline" | "secondary" | "destructive" }> = {
    A_ENVOYER: { label: "À envoyer", variant: "outline" },
    ENVOYE: { label: "Envoyé", variant: "secondary" },
    PAYE: { label: "Payé", variant: "default" },
    PARTIELLEMENT_PAYE: { label: "Partiel", variant: "secondary" },
    IMPAYE: { label: "Impayé", variant: "destructive" },
    EN_CONTENTIEUX: { label: "Contentieux", variant: "destructive" },
};

export interface LoyerCardProps {
    loyer: LoyerWithRelations;
    onView: (loyer: LoyerWithRelations) => void;
    onAction: (loyer: LoyerWithRelations, action: string) => void;
    className?: string;
}

export function LoyerCard({ loyer, onView, onAction, className }: LoyerCardProps) {
    const statutConfig = STATUT_CONFIG[loyer.statut] || STATUT_CONFIG.A_ENVOYER;
    const totalDu = Number(loyer.totalDu) || 0;
    const montantPaye = Number(loyer.montantPaye) || 0;
    const resteAPayer = totalDu - montantPaye;

    const moisLabel = new Date(loyer.annee, loyer.mois - 1, 1).toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
    });

    const echeanceDate = loyer.dateEcheance ? new Date(loyer.dateEcheance) : null;
    const isOverdue = echeanceDate && echeanceDate < new Date() && loyer.statut !== "PAYE";

    return (
        <Card
            className={cn(
                "p-4 border-black/[0.08] hover:border-black/20 transition-all cursor-pointer",
                isOverdue && "border-l-4 border-l-red-500",
                className
            )}
            onClick={() => onView(loyer)}
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[12px] text-black/40">{loyer.numero}</span>
                        <Badge variant={statutConfig.variant} className="text-[10px] h-5">
                            {statutConfig.label}
                        </Badge>
                    </div>
                    <p className="text-[14px] font-medium text-black capitalize">
                        {moisLabel}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[16px] font-bold text-black">
                        {totalDu.toLocaleString("fr-FR")} €
                    </p>
                    {resteAPayer > 0 && loyer.statut !== "A_ENVOYER" && (
                        <p className="text-[11px] text-red-600">
                            Reste: {resteAPayer.toLocaleString("fr-FR")} €
                        </p>
                    )}
                </div>
            </div>

            {/* Bien et locataire */}
            <div className="space-y-1.5 mb-3">
                {loyer.bail?.bien && (
                    <div className="flex items-center gap-2 text-[13px] text-black/60">
                        <Home className="w-3.5 h-3.5 text-black/40" />
                        <span className="line-clamp-1">{loyer.bail.bien.titre}</span>
                    </div>
                )}
                {loyer.bail?.locatairePrincipal && (
                    <div className="flex items-center gap-2 text-[12px] text-black/40">
                        <User className="w-3.5 h-3.5" />
                        <span>
                            {loyer.bail.locatairePrincipal.prenom} {loyer.bail.locatairePrincipal.nom}
                        </span>
                    </div>
                )}
            </div>

            {/* Détails */}
            <div className="flex items-center gap-3 text-[11px] text-black/40 mb-3">
                <span>HC: {Number(loyer.loyerHC || 0).toLocaleString("fr-FR")} €</span>
                <span>+</span>
                <span>Provisions: {Number(loyer.provisions || 0).toLocaleString("fr-FR")} €</span>
            </div>

            {/* Échéance */}
            {echeanceDate && (
                <div className="flex items-center gap-2 text-[12px] mb-3">
                    <Calendar className="w-3.5 h-3.5 text-black/40" />
                    <span className={cn(
                        isOverdue ? "text-red-600 font-medium" : "text-black/40"
                    )}>
                        Échéance: {echeanceDate.toLocaleDateString("fr-FR")}
                    </span>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                {loyer.statut === "A_ENVOYER" && (
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-black hover:bg-black/90 text-white text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(loyer, "send");
                        }}
                    >
                        <Send className="w-3 h-3 mr-1" />
                        Envoyer
                    </Button>
                )}
                {loyer.statut === "PAYE" && !loyer.quittanceGeneree && (
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-black hover:bg-black/90 text-white text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(loyer, "quittance");
                        }}
                    >
                        <Download className="w-3 h-3 mr-1" />
                        Quittance
                    </Button>
                )}
                {loyer.statut === "PAYE" && loyer.quittanceGeneree && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(loyer, "download");
                        }}
                    >
                        <Download className="w-3 h-3 mr-1" />
                        Télécharger
                    </Button>
                )}
                {(loyer.statut === "ENVOYE" || loyer.statut === "PARTIELLEMENT_PAYE") && (
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-black hover:bg-black/90 text-white text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(loyer, "encaissement");
                        }}
                    >
                        <Euro className="w-3 h-3 mr-1" />
                        Encaisser
                    </Button>
                )}
                {loyer.statut === "IMPAYE" && (
                    <Button
                        variant="destructive"
                        size="sm"
                        className="text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(loyer, "relance");
                        }}
                    >
                        <Send className="w-3 h-3 mr-1" />
                        Relancer
                    </Button>
                )}
            </div>
        </Card>
    );
}
