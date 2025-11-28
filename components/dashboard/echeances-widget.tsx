"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEcheancesStats } from "@/hooks/use-echeances";
import { TYPE_DOSSIER_LABELS, type EcheanceFiscale } from "@/lib/types/mission";
import { cn } from "@/lib/utils";
import {
    AlertTriangle,
    CalendarClock,
    ChevronRight,
    Loader2,
} from "lucide-react";
import Link from "next/link";

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
    });
}

function getDaysUntil(dateString: string): number {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(dateString);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

interface EcheanceItemProps {
    echeance: EcheanceFiscale;
}

function EcheanceItem({ echeance }: EcheanceItemProps) {
    const daysUntil = getDaysUntil(echeance.dateEcheance);
    const isOverdue = daysUntil < 0;
    const isUrgent = daysUntil <= 3 && daysUntil >= 0;

    return (
        <div
            className={cn(
                "flex items-center justify-between p-3 rounded-lg border border-black/5 hover:bg-black/2 transition-colors",
                isOverdue && "border-l-2 border-l-red-500 bg-red-50/50",
                isUrgent && "border-l-2 border-l-orange-500"
            )}
        >
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <Badge
                        variant="outline"
                        className="text-[10px] border-black/10 px-1.5"
                    >
                        {TYPE_DOSSIER_LABELS[echeance.type]}
                    </Badge>
                </div>
                <p className="text-[13px] font-medium text-black truncate">
                    {echeance.libelle}
                </p>
                <p className="text-[12px] text-black/40 truncate">
                    {echeance.client?.nom}
                </p>
            </div>
            <div className="text-right flex-shrink-0 ml-3">
                <p className="text-[12px] text-black/60">
                    {formatDate(echeance.dateEcheance)}
                </p>
                <p
                    className={cn(
                        "text-[11px]",
                        isOverdue
                            ? "text-red-600 font-medium"
                            : isUrgent
                              ? "text-orange-600"
                              : "text-black/40"
                    )}
                >
                    {isOverdue
                        ? `${Math.abs(daysUntil)}j retard`
                        : daysUntil === 0
                          ? "Aujourd'hui"
                          : daysUntil === 1
                            ? "Demain"
                            : `${daysUntil}j`}
                </p>
            </div>
        </div>
    );
}

export function EcheancesWidget() {
    const { data, isLoading, error } = useEcheancesStats();

    if (isLoading) {
        return (
            <Card className="p-5 border-black/8">
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-black/20" />
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="p-5 border-black/8">
                <p className="text-[13px] text-black/40 text-center py-4">
                    Erreur de chargement
                </p>
            </Card>
        );
    }

    const { stats, echeancesSemaine, echeancesRetard } = data || {
        stats: null,
        echeancesSemaine: [],
        echeancesRetard: [],
    };

    return (
        <div className="space-y-4">
            {/* En retard alert */}
            {stats && stats.enRetard > 0 && (
                <Card className="p-4 border-red-200 bg-red-50/50">
                    <Link
                        href="/dashboard/echeances?periode=retard"
                        className="flex items-center gap-3 group"
                    >
                        <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[14px] font-medium text-red-800">
                                {stats.enRetard} échéance
                                {stats.enRetard > 1 ? "s" : ""} en retard
                            </p>
                            <p className="text-[12px] text-red-600">
                                Action requise
                            </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-red-400 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </Card>
            )}

            {/* Cette semaine */}
            <Card className="p-5 border-black/8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <CalendarClock className="h-5 w-5 text-black/40" />
                        <h3 className="text-[15px] font-medium text-black/80">
                            Échéances cette semaine
                        </h3>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                        <Link
                            href="/dashboard/echeances"
                            className="text-[13px] text-black/60 hover:text-black"
                        >
                            Voir tout
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                    </Button>
                </div>

                {echeancesSemaine.length === 0 ? (
                    <div className="text-center py-6">
                        <CalendarClock className="h-8 w-8 text-black/10 mx-auto mb-2" />
                        <p className="text-[13px] text-black/40">
                            Aucune échéance cette semaine
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {echeancesSemaine.slice(0, 5).map((echeance) => (
                            <EcheanceItem
                                key={echeance.id}
                                echeance={echeance}
                            />
                        ))}
                        {echeancesSemaine.length > 5 && (
                            <Link
                                href="/dashboard/echeances?periode=semaine"
                                className="block text-center text-[12px] text-black/40 hover:text-black/60 py-2"
                            >
                                +{echeancesSemaine.length - 5} autres
                            </Link>
                        )}
                    </div>
                )}
            </Card>

            {/* Stats rapides */}
            {stats && (
                <div className="grid grid-cols-3 gap-3">
                    <Card className="p-3 border-black/8 text-center">
                        <p className="text-[20px] font-semibold text-black">
                            {stats.aVenir}
                        </p>
                        <p className="text-[11px] text-black/40">À venir</p>
                    </Card>
                    <Card className="p-3 border-black/8 text-center">
                        <p className="text-[20px] font-semibold text-black">
                            {stats.enCours}
                        </p>
                        <p className="text-[11px] text-black/40">En cours</p>
                    </Card>
                    <Card className="p-3 border-black/8 text-center">
                        <p className="text-[20px] font-semibold text-black">
                            {stats.deposees}
                        </p>
                        <p className="text-[11px] text-black/40">Déposées</p>
                    </Card>
                </div>
            )}
        </div>
    );
}
