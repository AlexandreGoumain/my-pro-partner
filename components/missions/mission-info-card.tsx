"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { MissionWithDetails } from "@/lib/types/mission";
import {
    TYPE_FACTURATION_DESCRIPTIONS,
    TYPE_FACTURATION_LABELS,
    calculateBudgetProgress,
    formatDuree,
} from "@/lib/types/mission";
import {
    Calendar,
    Clock,
    Mail,
    MapPin,
    Phone,
    Target,
    User,
} from "lucide-react";

export interface MissionInfoCardProps {
    mission: MissionWithDetails;
}

export function MissionInfoCard({ mission }: MissionInfoCardProps) {
    const budgetProgress = calculateBudgetProgress(
        mission.totalHeures,
        mission.budgetHeures
    );

    const formatDate = (date: string | null | undefined) => {
        if (!date) return "Non définie";
        return new Date(date).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="grid gap-4 lg:grid-cols-2">
            {/* Client info */}
            <Card className="p-5 border-black/8">
                <h3 className="text-[15px] font-medium text-black/80 mb-4">
                    Client
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-black/40" />
                        <span className="text-[14px] text-black/70">
                            {mission.client.nom}
                            {mission.client.prenom &&
                                ` ${mission.client.prenom}`}
                        </span>
                    </div>
                    {mission.client.email && (
                        <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-black/40" />
                            <a
                                href={`mailto:${mission.client.email}`}
                                className="text-[14px] text-black/70 hover:text-black"
                            >
                                {mission.client.email}
                            </a>
                        </div>
                    )}
                    {mission.client.telephone && (
                        <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-black/40" />
                            <a
                                href={`tel:${mission.client.telephone}`}
                                className="text-[14px] text-black/70 hover:text-black"
                            >
                                {mission.client.telephone}
                            </a>
                        </div>
                    )}
                    {(mission.client as any).adresse && (
                        <div className="flex items-start gap-3">
                            <MapPin className="h-4 w-4 text-black/40 mt-0.5" />
                            <span className="text-[14px] text-black/70">
                                {(mission.client as any).adresse}
                                {(mission.client as any).codePostal &&
                                    `, ${(mission.client as any).codePostal}`}
                                {(mission.client as any).ville &&
                                    ` ${(mission.client as any).ville}`}
                            </span>
                        </div>
                    )}
                </div>
            </Card>

            {/* Billing info */}
            <Card className="p-5 border-black/8">
                <h3 className="text-[15px] font-medium text-black/80 mb-4">
                    Facturation
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[13px] text-black/50">Type</span>
                        <div className="text-right">
                            <span className="text-[14px] font-medium text-black/70">
                                {TYPE_FACTURATION_LABELS[mission.typeFact]}
                            </span>
                            <p className="text-[12px] text-black/40">
                                {
                                    TYPE_FACTURATION_DESCRIPTIONS[
                                        mission.typeFact
                                    ]
                                }
                            </p>
                        </div>
                    </div>

                    {mission.typeFact === "FORFAIT" &&
                        mission.montantForfait && (
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] text-black/50">
                                    Montant forfait
                                </span>
                                <span className="text-[14px] font-medium text-black/70">
                                    {mission.montantForfait.toLocaleString(
                                        "fr-FR",
                                        {
                                            style: "currency",
                                            currency: "EUR",
                                        }
                                    )}
                                </span>
                            </div>
                        )}

                    {(mission.typeFact === "REGIE" ||
                        mission.typeFact === "MIXTE") &&
                        mission.tauxHoraire && (
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] text-black/50">
                                    Taux horaire
                                </span>
                                <span className="text-[14px] font-medium text-black/70">
                                    {mission.tauxHoraire.toLocaleString(
                                        "fr-FR",
                                        {
                                            style: "currency",
                                            currency: "EUR",
                                        }
                                    )}
                                    /h
                                </span>
                            </div>
                        )}

                    <div className="flex items-center justify-between">
                        <span className="text-[13px] text-black/50">
                            Montant total
                        </span>
                        <span className="text-[16px] font-semibold text-black">
                            {mission.totalMontant.toLocaleString("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                            })}
                        </span>
                    </div>
                </div>
            </Card>

            {/* Dates */}
            <Card className="p-5 border-black/8">
                <h3 className="text-[15px] font-medium text-black/80 mb-4">
                    Planning
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-black/40" />
                            <span className="text-[13px] text-black/50">
                                Début
                            </span>
                        </div>
                        <span className="text-[14px] text-black/70">
                            {formatDate(mission.dateDebut)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-black/40" />
                            <span className="text-[13px] text-black/50">
                                Fin prévue
                            </span>
                        </div>
                        <span className="text-[14px] text-black/70">
                            {formatDate(mission.dateFin)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-black/40" />
                            <span className="text-[13px] text-black/50">
                                Échéance
                            </span>
                        </div>
                        <span className="text-[14px] text-black/70">
                            {formatDate(mission.dateEcheance)}
                        </span>
                    </div>
                </div>
            </Card>

            {/* Budget hours */}
            <Card className="p-5 border-black/8">
                <h3 className="text-[15px] font-medium text-black/80 mb-4">
                    Budget heures
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-black/40" />
                            <span className="text-[13px] text-black/50">
                                Consommé
                            </span>
                        </div>
                        <span className="text-[14px] font-medium text-black/70">
                            {formatDuree(mission.totalHeures)}
                        </span>
                    </div>

                    {mission.budgetHeures && (
                        <>
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] text-black/50">
                                    Budget
                                </span>
                                <span className="text-[14px] text-black/70">
                                    {formatDuree(mission.budgetHeures)}
                                </span>
                            </div>

                            {budgetProgress !== null && (
                                <div className="space-y-2">
                                    <Progress
                                        value={Math.min(budgetProgress, 100)}
                                        className={`h-2 ${
                                            budgetProgress > 100
                                                ? "[&>div]:bg-red-500"
                                                : budgetProgress > 80
                                                  ? "[&>div]:bg-orange-500"
                                                  : "[&>div]:bg-black"
                                        }`}
                                    />
                                    <div className="flex items-center justify-between text-[12px]">
                                        <span
                                            className={
                                                budgetProgress > 100
                                                    ? "text-red-500"
                                                    : budgetProgress > 80
                                                      ? "text-orange-500"
                                                      : "text-black/40"
                                            }
                                        >
                                            {budgetProgress}% utilisé
                                        </span>
                                        {budgetProgress > 100 && (
                                            <span className="text-red-500 font-medium">
                                                Dépassement !
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {!mission.budgetHeures && (
                        <p className="text-[13px] text-black/40 italic">
                            Aucun budget défini
                        </p>
                    )}
                </div>
            </Card>
        </div>
    );
}
