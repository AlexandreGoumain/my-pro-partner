"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { EntreeTemps } from "@/lib/types/mission";
import { formatDuree } from "@/lib/types/mission";
import { ArrowRight, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export interface RecentTimeEntriesProps {
    entries: EntreeTemps[];
}

export function RecentTimeEntries({ entries }: RecentTimeEntriesProps) {
    const router = useRouter();

    if (entries.length === 0) {
        return (
            <Card className="p-6 border-black/8">
                <div className="text-center py-8">
                    <Clock className="h-10 w-10 text-black/20 mx-auto mb-3" />
                    <h3 className="text-[14px] font-medium text-black/80 mb-1">
                        Aucune entrée récente
                    </h3>
                    <p className="text-[13px] text-black/40 mb-4">
                        Commencez à tracker votre temps
                    </p>
                    <Button
                        onClick={() =>
                            router.push("/dashboard/temps?action=new")
                        }
                        className="h-10 px-4 text-[13px] bg-black hover:bg-black/90"
                    >
                        Saisir du temps
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
                        Dernières saisies
                    </h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/dashboard/temps")}
                        className="h-8 text-[13px] text-black/60 hover:text-black"
                    >
                        Voir tout
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>

            <div className="divide-y divide-black/5">
                {entries.slice(0, 5).map((entry) => {
                    const formattedDate = new Date(
                        entry.date
                    ).toLocaleDateString("fr-FR", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                    });

                    return (
                        <div
                            key={entry.id}
                            className="p-4 hover:bg-black/2 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    {entry.mission && (
                                        <div className="text-[12px] text-black/50 mb-1">
                                            {entry.mission.numero} •{" "}
                                            {entry.mission.nom}
                                        </div>
                                    )}
                                    <p className="text-[13px] text-black/80 line-clamp-2">
                                        {entry.description}
                                    </p>
                                    <div className="text-[11px] text-black/40 mt-1">
                                        {formattedDate}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-[14px] font-medium text-black/70">
                                        <Clock className="h-3.5 w-3.5" />
                                        {formatDuree(entry.duree)}
                                    </div>
                                    {!entry.facturable && (
                                        <div className="text-[10px] text-black/30 mt-0.5">
                                            Non facturable
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
