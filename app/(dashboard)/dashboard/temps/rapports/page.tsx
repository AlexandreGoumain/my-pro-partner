"use client";

import {
    ReportByClient,
    ReportByCollaborator,
    ReportByMission,
    ReportStatsCards,
    ReportTimeChart,
} from "@/components/temps";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCapabilities } from "@/hooks/use-capabilities";
import { useTempsReports } from "@/hooks/use-temps";
import { ArrowLeft, BarChart3, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const PERIOD_OPTIONS = [
    { value: "7", label: "7 derniers jours" },
    { value: "14", label: "14 derniers jours" },
    { value: "30", label: "30 derniers jours" },
    { value: "60", label: "60 derniers jours" },
    { value: "90", label: "90 derniers jours" },
];

const GROUP_BY_OPTIONS = [
    { value: "day", label: "Par jour" },
    { value: "week", label: "Par semaine" },
    { value: "month", label: "Par mois" },
];

export default function RapportsTempsPage() {
    const { hasCapability } = useCapabilities();
    const hasAccess = hasCapability("projets");

    const [period, setPeriod] = useState("30");
    const [groupBy, setGroupBy] = useState("day");

    const { data, isLoading, error } = useTempsReports(
        parseInt(period),
        groupBy,
        { enabled: hasAccess }
    );

    if (!hasAccess) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-black/20 mx-auto mb-4" />
                    <h2 className="text-[18px] font-semibold text-black/80 mb-2">
                        Accès non disponible
                    </h2>
                    <p className="text-[14px] text-black/40">
                        Cette fonctionnalité n&apos;est pas activée pour votre
                        type d&apos;entreprise.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link
                        href="/dashboard/temps"
                        className="inline-flex items-center text-[13px] text-black/50 hover:text-black mb-2"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Retour au suivi du temps
                    </Link>
                    <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                        Rapports
                    </h1>
                    <p className="text-[14px] text-black/40 mt-1">
                        Analysez votre activité et votre productivité
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={groupBy} onValueChange={setGroupBy}>
                        <SelectTrigger className="h-10 w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {GROUP_BY_OPTIONS.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="h-10 w-[160px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PERIOD_OPTIONS.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        onClick={() => {
                            const params = new URLSearchParams();
                            if (data?.period.start)
                                params.append(
                                    "dateDebut",
                                    data.period.start.split("T")[0]
                                );
                            if (data?.period.end)
                                params.append(
                                    "dateFin",
                                    data.period.end.split("T")[0]
                                );
                            window.open(
                                `/api/temps/export?${params.toString()}`,
                                "_blank"
                            );
                        }}
                        disabled={!data}
                        className="h-10 px-4 border-black/10"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Exporter
                    </Button>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-black/20" />
                </div>
            ) : error ? (
                <div className="text-center py-20">
                    <p className="text-[14px] text-red-500">
                        Erreur lors du chargement des rapports
                    </p>
                </div>
            ) : data ? (
                <div className="space-y-6">
                    {/* Stats cards */}
                    <ReportStatsCards data={data} />

                    {/* Time chart */}
                    <ReportTimeChart data={data.timeSeries} groupBy={groupBy} />

                    {/* Breakdown grids */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        <ReportByMission data={data.byMission} />
                        <ReportByClient data={data.byClient} />
                    </div>

                    {/* Collaborators */}
                    {data.byCollaborator.length > 0 && (
                        <ReportByCollaborator data={data.byCollaborator} />
                    )}
                </div>
            ) : (
                <EmptyState
                    icon={BarChart3}
                    title="Aucune donnée"
                    description="Commencez à tracker votre temps pour voir les rapports"
                    variant="minimal"
                />
            )}
        </div>
    );
}
