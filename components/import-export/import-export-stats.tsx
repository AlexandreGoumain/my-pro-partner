import { Card } from "@/components/ui/card";
import { Download, FileUp, Users } from "lucide-react";

export interface ImportExportStatsProps {
    clientsCount: number;
}

/**
 * Stats pour l'import/export
 * Note: Garde un style custom avec icône à gauche pour ce layout spécifique
 */
export function ImportExportStats({ clientsCount }: ImportExportStatsProps) {
    return (
        <div className="grid gap-5 md:grid-cols-3">
            <Card className="group relative overflow-hidden border-black/[0.08] bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black/5">
                            <Users
                                className="h-5 w-5 text-black/60"
                                strokeWidth={2}
                            />
                        </div>
                        <div>
                            <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                                {clientsCount}
                            </p>
                            <p className="text-[13px] text-black/60">
                                Clients dans la base
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="group relative overflow-hidden border-black/[0.08] bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black/5">
                            <Download
                                className="h-5 w-5 text-black/60"
                                strokeWidth={2}
                            />
                        </div>
                        <div>
                            <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                                2
                            </p>
                            <p className="text-[13px] text-black/60">
                                Formats d&apos;export
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="group relative overflow-hidden border-black/[0.08] bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black/5">
                            <FileUp
                                className="h-5 w-5 text-black/60"
                                strokeWidth={2}
                            />
                        </div>
                        <div>
                            <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                                CSV
                            </p>
                            <p className="text-[13px] text-black/60">
                                Format d&apos;import
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
