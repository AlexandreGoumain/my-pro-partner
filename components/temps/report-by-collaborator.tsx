"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { TempsReportData } from "@/hooks/use-temps";
import { formatDuree } from "@/lib/utils/format";
import { UserCircle } from "lucide-react";
import { useMemo } from "react";

export interface ReportByCollaboratorProps {
    data: TempsReportData["byCollaborator"];
}

export function ReportByCollaborator({ data }: ReportByCollaboratorProps) {
    const maxTracked = useMemo(() => {
        return Math.max(...data.map((d) => d.tracked), 1);
    }, [data]);

    if (data.length === 0) {
        return (
            <Card className="p-5 border-black/8">
                <h3 className="text-[15px] font-medium text-black/80 mb-4">
                    Par collaborateur
                </h3>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <UserCircle className="h-10 w-10 text-black/20 mb-3" />
                    <p className="text-[14px] text-black/40">
                        Aucun collaborateur sur cette période
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-5 border-black/8">
            <h3 className="text-[15px] font-medium text-black/80 mb-4">
                Par collaborateur
            </h3>
            <div className="space-y-4">
                {data.map((collab) => {
                    const percent = Math.round(
                        (collab.tracked / maxTracked) * 100
                    );
                    const billablePercent =
                        collab.tracked > 0
                            ? Math.round(
                                  (collab.billable / collab.tracked) * 100
                              )
                            : 0;

                    return (
                        <div key={collab.id}>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center">
                                        <span className="text-[11px] font-medium text-black/60">
                                            {collab.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-[13px] font-medium text-black/80">
                                        {collab.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[12px] text-black/50">
                                        {formatDuree(collab.tracked)}
                                    </span>
                                    <span className="text-[12px] font-medium text-black/70">
                                        {collab.amount.toLocaleString("fr-FR", {
                                            style: "currency",
                                            currency: "EUR",
                                            maximumFractionDigits: 0,
                                        })}
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
        </Card>
    );
}
