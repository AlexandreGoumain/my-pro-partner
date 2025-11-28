"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Mission } from "@/lib/types/mission";
import {
    formatDuree,
    STATUT_MISSION_COLORS,
    STATUT_MISSION_LABELS,
} from "@/lib/types/mission";
import { ArrowRight, Briefcase, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export interface RecentMissionsListProps {
    missions: Mission[];
}

export function RecentMissionsList({ missions }: RecentMissionsListProps) {
    const router = useRouter();

    if (missions.length === 0) {
        return (
            <Card className="p-6 border-black/8">
                <div className="text-center py-8">
                    <Briefcase className="h-10 w-10 text-black/20 mx-auto mb-3" />
                    <h3 className="text-[14px] font-medium text-black/80 mb-1">
                        Aucune mission récente
                    </h3>
                    <p className="text-[13px] text-black/40 mb-4">
                        Créez votre première mission pour commencer
                    </p>
                    <Button
                        onClick={() =>
                            router.push("/dashboard/missions?action=new")
                        }
                        className="h-10 px-4 text-[13px] bg-black hover:bg-black/90"
                    >
                        Créer une mission
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <Card className="border-black/8">
            <div className="p-4 border-b border-black/5">
                <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-medium text-black/80">
                        Missions récentes
                    </h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/dashboard/missions")}
                        className="h-8 text-[13px] text-black/60 hover:text-black"
                    >
                        Voir tout
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>

            <div className="divide-y divide-black/5">
                {missions.slice(0, 5).map((mission) => (
                    <div
                        key={mission.id}
                        className="p-4 hover:bg-black/2 transition-colors cursor-pointer"
                        onClick={() =>
                            router.push(`/dashboard/missions/${mission.id}`)
                        }
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[12px] font-medium text-black/50">
                                        {mission.numero}
                                    </span>
                                    <Badge
                                        className={`text-[10px] h-5 ${STATUT_MISSION_COLORS[mission.statut]}`}
                                    >
                                        {STATUT_MISSION_LABELS[mission.statut]}
                                    </Badge>
                                </div>
                                <h4 className="text-[14px] font-medium text-black/80 truncate">
                                    {mission.nom}
                                </h4>
                                <p className="text-[12px] text-black/40 mt-0.5">
                                    {mission.client.nom}
                                </p>
                            </div>

                            <div className="text-right">
                                <div className="flex items-center gap-1 text-[13px] text-black/60">
                                    <Clock className="h-3.5 w-3.5" />
                                    {formatDuree(mission.totalHeures)}
                                </div>
                                {mission.totalMontant > 0 && (
                                    <div className="text-[12px] text-black/40 mt-0.5">
                                        {mission.totalMontant.toLocaleString(
                                            "fr-FR",
                                            {
                                                style: "currency",
                                                currency: "EUR",
                                                maximumFractionDigits: 0,
                                            }
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
