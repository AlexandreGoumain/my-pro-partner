"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { TempsReportData } from "@/hooks/use-temps";
import { formatDuree } from "@/lib/utils/format";
import { Briefcase } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export interface ReportByMissionProps {
    data: TempsReportData["byMission"];
}

export function ReportByMission({ data }: ReportByMissionProps) {
    const maxTracked = useMemo(() => {
        return Math.max(...data.map((d) => d.tracked), 1);
    }, [data]);

    if (data.length === 0) {
        return (
            <Card className="p-5 border-black/8">
                <h3 className="text-[15px] font-medium text-black/80 mb-4">
                    Par mission
                </h3>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Briefcase className="h-10 w-10 text-black/20 mb-3" />
                    <p className="text-[14px] text-black/40">
                        Aucune mission sur cette période
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-5 border-black/8">
            <h3 className="text-[15px] font-medium text-black/80 mb-4">
                Par mission
            </h3>
            <div className="space-y-4">
                {data.slice(0, 10).map((mission) => {
                    const percent = Math.round(
                        (mission.tracked / maxTracked) * 100
                    );
                    const billablePercent =
                        mission.tracked > 0
                            ? Math.round(
                                  (mission.billable / mission.tracked) * 100
                              )
                            : 0;

                    return (
                        <div key={mission.id}>
                            <div className="flex items-center justify-between mb-1.5">
                                <Link
                                    href={`/dashboard/missions/${mission.id}`}
                                    className="text-[13px] font-medium text-black/80 hover:text-black truncate max-w-[200px]"
                                >
                                    {mission.numero} - {mission.nom}
                                </Link>
                                <div className="flex items-center gap-3">
                                    <span className="text-[12px] text-black/50">
                                        {formatDuree(mission.tracked)}
                                    </span>
                                    <span className="text-[12px] font-medium text-black/70">
                                        {mission.amount.toLocaleString(
                                            "fr-FR",
                                            {
                                                style: "currency",
                                                currency: "EUR",
                                                maximumFractionDigits: 0,
                                            }
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Progress
                                    value={percent}
                                    className="h-2 flex-1 [&>div]:bg-black"
                                />
                                <span className="text-[11px] text-black/40 w-12 text-right">
                                    {billablePercent}% fact.
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
            {data.length > 10 && (
                <p className="text-[12px] text-black/40 mt-4 text-center">
                    +{data.length - 10} autres missions
                </p>
            )}
        </Card>
    );
}
