import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ArrowUpRight, TrendingUp, Users } from "lucide-react";

export interface ClientInsightsSectionProps {
    completionRate: number;
    completeCount: number;
    onSegmentsClick: () => void;
    onStatisticsClick: () => void;
    onImportExportClick: () => void;
}

export function ClientInsightsSection({
    completionRate,
    completeCount,
    onSegmentsClick,
    onStatisticsClick,
    onImportExportClick,
}: ClientInsightsSectionProps) {
    return (
        <div className="grid gap-5 md:grid-cols-2">
            {/* Qualité des données */}
            <Card className="group relative overflow-hidden border-black/[0.08] bg-white hover:shadow-sm transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-6">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                            <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                                Qualité des données
                            </h3>
                        </div>
                        <p className="text-[13px] text-black/40 ml-3">
                            Taux de complétion des fiches clients
                        </p>
                    </div>
                    <div className="mb-4">
                        <p className="text-[40px] font-bold tracking-[-0.03em] text-black">
                            {completionRate.toFixed(0)}%
                        </p>
                    </div>
                    <div className="space-y-3">
                        <ProgressBar
                            label=""
                            value={completionRate}
                            size="sm"
                            labelClassName="hidden"
                        />
                        <p className="text-[12px] text-black/40">
                            {completeCount} clients avec informations complètes
                            (email + téléphone + adresse)
                        </p>
                    </div>
                </div>
            </Card>

            {/* Actions rapides */}
            <Card className="group relative overflow-hidden border-black/[0.08] bg-white hover:shadow-sm transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-6">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                            <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                                Actions rapides
                            </h3>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Button
                            variant="outline"
                            className="w-full justify-between h-11 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5 hover:border-black/15 cursor-pointer transition-all duration-200"
                            onClick={onSegmentsClick}
                        >
                            <div className="flex items-center gap-2.5">
                                <Users
                                    className="h-4 w-4 text-black/60"
                                    strokeWidth={2}
                                />
                                <span className="text-black/80">
                                    Voir les segments clients
                                </span>
                            </div>
                            <ArrowUpRight
                                className="h-4 w-4 text-black/40"
                                strokeWidth={2}
                            />
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-between h-11 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5 hover:border-black/15 cursor-pointer transition-all duration-200"
                            onClick={onStatisticsClick}
                        >
                            <div className="flex items-center gap-2.5">
                                <TrendingUp
                                    className="h-4 w-4 text-black/60"
                                    strokeWidth={2}
                                />
                                <span className="text-black/80">
                                    Consulter les statistiques
                                </span>
                            </div>
                            <ArrowUpRight
                                className="h-4 w-4 text-black/40"
                                strokeWidth={2}
                            />
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-between h-11 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5 hover:border-black/15 cursor-pointer transition-all duration-200"
                            onClick={onImportExportClick}
                        >
                            <div className="flex items-center gap-2.5">
                                <ArrowUpRight
                                    className="h-4 w-4 text-black/60"
                                    strokeWidth={2}
                                />
                                <span className="text-black/80">
                                    Import / Export
                                </span>
                            </div>
                            <ArrowUpRight
                                className="h-4 w-4 text-black/40"
                                strokeWidth={2}
                            />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
