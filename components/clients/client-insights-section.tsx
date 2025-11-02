import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Users, TrendingUp, ArrowUpRight } from "lucide-react";

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
            <Card className="border-black/8 shadow-sm">
                <div className="p-5">
                    <SectionHeader
                        title="Qualité des données"
                        description="Taux de complétion des fiches clients"
                    />
                    <div className="mb-4">
                        <p className="text-[32px] font-semibold tracking-[-0.02em] text-black">
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
            <Card className="border-black/8 shadow-sm">
                <div className="p-5">
                    <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black mb-4">
                        Actions rapides
                    </h3>
                    <div className="space-y-2">
                        <Button
                            variant="outline"
                            className="w-full justify-between h-12 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5 cursor-pointer"
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
                            className="w-full justify-between h-12 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5 cursor-pointer"
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
                            className="w-full justify-between h-12 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5 cursor-pointer"
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
