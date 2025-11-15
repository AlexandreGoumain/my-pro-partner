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
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-black/10">
                <div className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/5">
                            <Users
                                className="h-5 w-5 text-black/60"
                                strokeWidth={2}
                            />
                        </div>
                        <div>
                            <p className="text-[24px] font-semibold tracking-[-0.01em] text-black">
                                {clientsCount}
                            </p>
                            <p className="text-[14px] text-black/60">
                                Clients dans la base
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="border-black/10">
                <div className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/5">
                            <Download
                                className="h-5 w-5 text-black/60"
                                strokeWidth={2}
                            />
                        </div>
                        <div>
                            <p className="text-[24px] font-semibold tracking-[-0.01em] text-black">
                                2
                            </p>
                            <p className="text-[14px] text-black/60">
                                Formats d'export
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="border-black/10">
                <div className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/5">
                            <FileUp
                                className="h-5 w-5 text-black/60"
                                strokeWidth={2}
                            />
                        </div>
                        <div>
                            <p className="text-[24px] font-semibold tracking-[-0.01em] text-black">
                                CSV
                            </p>
                            <p className="text-[14px] text-black/60">
                                Format d&apos;import
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
