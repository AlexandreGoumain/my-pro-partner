"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { TempsReportData } from "@/hooks/use-temps";
import { formatDuree } from "@/lib/utils/format";
import { Users } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export interface ReportByClientProps {
    data: TempsReportData["byClient"];
}

export function ReportByClient({ data }: ReportByClientProps) {
    const maxTracked = useMemo(() => {
        return Math.max(...data.map((d) => d.tracked), 1);
    }, [data]);

    if (data.length === 0) {
        return (
            <Card className="p-5 border-black/8">
                <h3 className="text-[15px] font-medium text-black/80 mb-4">
                    Par client
                </h3>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Users className="h-10 w-10 text-black/20 mb-3" />
                    <p className="text-[14px] text-black/40">
                        Aucun client sur cette période
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-5 border-black/8">
            <h3 className="text-[15px] font-medium text-black/80 mb-4">
                Par client
            </h3>
            <div className="space-y-4">
                {data.slice(0, 10).map((client) => {
                    const percent = Math.round(
                        (client.tracked / maxTracked) * 100
                    );

                    return (
                        <div key={client.id}>
                            <div className="flex items-center justify-between mb-1.5">
                                <Link
                                    href={`/dashboard/clients/${client.id}`}
                                    className="text-[13px] font-medium text-black/80 hover:text-black truncate max-w-[180px]"
                                >
                                    {client.nom}
                                </Link>
                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] text-black/40">
                                        {client.missions} mission
                                        {client.missions > 1 ? "s" : ""}
                                    </span>
                                    <span className="text-[12px] text-black/50">
                                        {formatDuree(client.tracked)}
                                    </span>
                                    <span className="text-[12px] font-medium text-black/70">
                                        {client.amount.toLocaleString("fr-FR", {
                                            style: "currency",
                                            currency: "EUR",
                                            maximumFractionDigits: 0,
                                        })}
                                    </span>
                                </div>
                            </div>
                            <Progress
                                value={percent}
                                className="h-2 [&>div]:bg-black"
                            />
                        </div>
                    );
                })}
            </div>
            {data.length > 10 && (
                <p className="text-[12px] text-black/40 mt-4 text-center">
                    +{data.length - 10} autres clients
                </p>
            )}
        </Card>
    );
}
